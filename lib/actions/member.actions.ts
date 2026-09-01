'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { encryptMemberSession, requireMemberAuth, getMemberSession } from '@/lib/member-auth';
import { requireRole } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const memberLoginSchema = z.object({
  identifier: z.string().min(3, 'Please enter your registered Email address (or Reg No / Matric No).'),
  verification: z.string().min(3, 'Please enter your registered Phone Number.'),
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

  const cleanEmail = validated.data.identifier.toLowerCase();
  const cleanId = validated.data.identifier.toUpperCase();
  const verCleanPhone = validated.data.verification.replace(/[^0-9+]/g, '');

  const reqHeaders = await headers();
  const ipAddress = reqHeaders.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = reqHeaders.get('user-agent') || 'Unknown Browser';

  try {
    // 1. Search for student record primarily by Email (with Reg No / Matric No fallback)
    const student = await db.studentRegistration.findFirst({
      where: {
        OR: [
          { email: { equals: cleanEmail } },
          { regNumber: { equals: cleanId } },
          { matricNumber: { equals: cleanId } },
        ],
      },
    });

    if (!student) {
      await db.auditLog.create({
        data: {
          action: 'MEMBER_LOGIN_FAILED',
          details: `Member login attempt failed: Email/Identifier "${validated.data.identifier}" not found`,
          ipAddress,
          userAgent,
        },
      });
      return {
        error: `No registered student found with email address "${validated.data.identifier}". Please verify your email or complete registration first.`,
      };
    }

    if (student.status === 'REJECTED') {
      return {
        error: 'Your student registration record has been flagged as invalid or rejected. Please contact the YOSU Executive Secretariat.',
      };
    }

    // 2. Verify Phone Number matches registered record
    const studentPhoneClean = student.phone.replace(/[^0-9+]/g, '');
    const studentWhatsappClean = (student.whatsapp || '').replace(/[^0-9+]/g, '');

    const phoneMatches =
      (verCleanPhone.length >= 6 && studentPhoneClean.includes(verCleanPhone)) ||
      (studentPhoneClean.length >= 6 && verCleanPhone.includes(studentPhoneClean)) ||
      (verCleanPhone.length >= 6 && studentWhatsappClean.includes(verCleanPhone));

    if (!phoneMatches) {
      await db.auditLog.create({
        data: {
          action: 'MEMBER_LOGIN_FAILED',
          details: `Member login failed for ${student.email}: Phone number mismatch`,
          ipAddress,
          userAgent,
        },
      });
      return {
        error: 'Verification failed. The phone number provided does not match the record on file for this email address.',
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

/**
 * Self-service Profile Edit Action for logged-in students in Member Portal
 */
export async function updateMemberProfileSelfAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const session = await requireMemberAuth();
    const student = await db.studentRegistration.findUnique({
      where: { id: session.studentId },
    });

    if (!student) {
      return { success: false, error: 'Student record not found.' };
    }

    const fullName = (formData.get('fullName') as string || student.fullName).trim();
    const phone = (formData.get('phone') as string || student.phone).trim();
    const whatsapp = (formData.get('whatsapp') as string || student.whatsapp || '').trim();
    const faculty = (formData.get('faculty') as string || student.faculty).trim();
    const department = (formData.get('department') as string || student.department).trim();
    const level = (formData.get('level') as string || student.level).trim();
    const stateOfOrigin = (formData.get('stateOfOrigin') as string || student.stateOfOrigin).trim();
    const lga = (formData.get('lga') as string || student.lga).trim();
    const homeTown = (formData.get('homeTown') as string || student.homeTown).trim();
    const passportUrl = (formData.get('passportUrl') as string || student.passportUrl || '').trim();

    await db.studentRegistration.update({
      where: { id: student.id },
      data: {
        fullName,
        phone,
        whatsapp: whatsapp || null,
        faculty,
        department,
        level,
        stateOfOrigin,
        lga,
        homeTown,
        passportUrl: passportUrl || null,
      },
    });

    revalidatePath('/member');
    revalidatePath('/admin/students');

    return {
      success: true,
      message: 'Your profile details have been updated successfully!',
    };
  } catch (error: any) {
    console.error('Member self-update error:', error);
    return { success: false, error: error.message || 'Failed to update profile details.' };
  }
}
