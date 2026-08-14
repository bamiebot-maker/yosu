'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { encryptMemberSession, requireMemberAuth, getMemberSession } from '@/lib/member-auth';
import { requireRole } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const memberLoginSchema = z.object({
  identifier: z.string().min(3, 'Please enter your Registration Number or Matriculation Number.'),
  verification: z.string().min(3, 'Please enter your registered Phone Number or Email address.'),
});

export type MemberAuthState = {
  error?: string;
  success?: boolean;
};

export async function memberLoginAction(
  prevState: MemberAuthState | null,
  formData: FormData
): Promise<MemberAuthState> {
  const identifierRaw = (formData.get('identifier') as string || '').trim();
  const verificationRaw = (formData.get('verification') as string || '').trim();
  const callbackUrl = (formData.get('callbackUrl') as string) || '/member';

  const validated = memberLoginSchema.safeParse({
    identifier: identifierRaw,
    verification: verificationRaw,
  });

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const cleanId = validated.data.identifier.toUpperCase();
  const cleanVerification = validated.data.verification.toLowerCase();
  const cleanPhone = validated.data.verification.replace(/[^0-9+]/g, '');

  const reqHeaders = await headers();
  const ipAddress = reqHeaders.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = reqHeaders.get('user-agent') || 'Unknown Browser';

  try {
    // 1. Search for student record by Reg Number or Matric Number
    const student = await db.studentRegistration.findFirst({
      where: {
        OR: [
          { regNumber: { equals: cleanId } },
          { matricNumber: { equals: cleanId } },
          { regNumber: { equals: validated.data.identifier } },
          { matricNumber: { equals: validated.data.identifier } },
        ],
      },
    });

    if (!student) {
      await db.auditLog.create({
        data: {
          action: 'MEMBER_LOGIN_FAILED',
          details: `Member login attempt failed: Identifier "${cleanId}" not found`,
          ipAddress,
          userAgent,
        },
      });
      return {
        error: `No registered student found with Registration/Matriculation Number "${validated.data.identifier}". Please verify your credentials or complete student registration first.`,
      };
    }

    if (student.status === 'REJECTED') {
      return {
        error: 'Your student registration record has been flagged as invalid or rejected. Please contact the YOSU Executive Secretariat.',
      };
    }

    // 2. Verify Phone Number or Email matches
    const studentEmailLower = student.email.toLowerCase().trim();
    const studentPhoneClean = student.phone.replace(/[^0-9+]/g, '');
    const studentWhatsappClean = (student.whatsapp || '').replace(/[^0-9+]/g, '');

    const emailMatches = studentEmailLower === cleanVerification;
    const phoneMatches =
      (cleanPhone.length >= 7 && studentPhoneClean.includes(cleanPhone)) ||
      (studentPhoneClean.length >= 7 && cleanPhone.includes(studentPhoneClean)) ||
      (cleanPhone.length >= 7 && studentWhatsappClean.includes(cleanPhone));

    if (!emailMatches && !phoneMatches) {
      await db.auditLog.create({
        data: {
          action: 'MEMBER_LOGIN_FAILED',
          details: `Member login failed for ${student.matricNumber}: Phone/Email mismatch`,
          ipAddress,
          userAgent,
        },
      });
      return {
        error: 'Verification failed. The phone number or email address provided does not match the record on file for this student ID.',
      };
    }

    // 3. Encrypt & set HTTP-Only Member Cookie
    const token = await encryptMemberSession({
      studentId: student.id,
      regNumber: student.regNumber,
      matricNumber: student.matricNumber,
      fullName: student.fullName,
      email: student.email,
      roleCodes: ['MEMBER'],
    });

    const cookieStore = await cookies();
    cookieStore.set('yosu_member_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // 4. Audit Log
    await db.auditLog.create({
      data: {
        action: 'MEMBER_LOGIN_SUCCESS',
        details: `Member ${student.fullName} (${student.regNumber}) logged into Member Centre`,
        ipAddress,
        userAgent,
      },
    });
  } catch (error: any) {
    console.error('Member login error:', error);
    return { error: 'An unexpected system error occurred during member verification.' };
  }

  redirect(callbackUrl);
}

export async function memberLogoutAction(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.set('yosu_member_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  redirect('/member/login');
}

/**
 * Action for members to submit suggestions, complaints, or recommendations
 */
export async function submitMemberFeedbackAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const session = await requireMemberAuth();
    const subject = (formData.get('subject') as string || '').trim();
    const category = (formData.get('category') as string || 'SUGGESTION').toUpperCase().trim();
    const message = (formData.get('message') as string || '').trim();

    if (!subject || subject.length < 4) {
      return { success: false, error: 'Please provide a clear subject (at least 4 characters).' };
    }

    if (!message || message.length < 10) {
      return { success: false, error: 'Please enter a detailed message (at least 10 characters).' };
    }

    const validCategories = ['SUGGESTION', 'COMPLAINT', 'RECOMMENDATION'];
    const cleanCategory = validCategories.includes(category) ? category : 'SUGGESTION';

    await db.memberFeedback.create({
      data: {
        studentId: session.studentId,
        subject,
        category: cleanCategory,
        message,
        status: 'PENDING',
      },
    });

    revalidatePath('/member/feedback');
    revalidatePath('/member');
    revalidatePath('/admin/feedback');

    return {
      success: true,
      message: 'Your submission has been securely delivered to the YOSU Executive Council. Thank you!',
    };
  } catch (error: any) {
    console.error('Feedback submission error:', error);
    return { success: false, error: error.message || 'Failed to submit feedback. Please try again.' };
  }
}

/**
 * Super Admin Action to review and update feedback status and reply
 */
export async function updateFeedbackStatusAction(
  id: string,
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED',
  adminNotes?: string
) {
  try {
    await requireRole(['SUPER_ADMIN', 'ADMIN', 'PRESIDENT']);

    await db.memberFeedback.update({
      where: { id },
      data: {
        status,
        adminNotes: adminNotes ? adminNotes.trim() : null,
      },
    });

    revalidatePath('/admin/feedback');
    revalidatePath('/member/feedback');
    return { success: true, message: 'Member feedback status updated successfully.' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update feedback status.' };
  }
}
