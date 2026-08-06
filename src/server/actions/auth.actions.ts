'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db';
import { encryptSession } from '@/lib/auth';
import { verifyPassword } from '@/lib/password';
import { RoleCode } from '@prisma/client';

const loginSchema = z.object({
  email: z.string().email('Please provide a valid official email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const emailRaw = (formData.get('email') as string || '').toLowerCase().trim();
  const password = formData.get('password') as string;
  const callbackUrl = (formData.get('callbackUrl') as string) || '/admin/dashboard';

  const validated = loginSchema.safeParse({ email: emailRaw, password });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const reqHeaders = await headers();
  const ipAddress = reqHeaders.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = reqHeaders.get('user-agent') || 'Unknown Browser';

  try {
    console.log(`[AUTH TRACE] Initiating login attempt for email: "${validated.data.email}"`);

    // Lookup user with exact or case-insensitive query fallback
    let user = await db.user.findFirst({
      where: {
        email: {
          equals: validated.data.email,
        },
      },
      include: {
        person: {
          include: { avatarMedia: true },
        },
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      user = await db.user.findUnique({
        where: { email: validated.data.email },
        include: {
          person: {
            include: { avatarMedia: true },
          },
          userRoles: {
            include: { role: true },
          },
        },
      });
    }

    console.log(`[AUTH TRACE] User search result for "${validated.data.email}": Found = ${!!user}, ID = ${user?.id || 'N/A'}, isActive = ${user?.isActive}`);

    if (!user || !user.isActive) {
      console.warn(`[AUTH REJECTED] User record missing or inactive for email: "${validated.data.email}"`);
      await db.auditLog.create({
        data: {
          action: 'AUTH_LOGIN_FAILED',
          details: `Failed login attempt for non-existent or inactive email: ${emailRaw}`,
          ipAddress,
          userAgent,
        },
      });
      return { error: 'Invalid email credentials or account is deactivated.' };
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    console.log(`[AUTH TRACE] Password comparison result for "${validated.data.email}": ${isValidPassword}`);

    if (!isValidPassword) {
      console.warn(`[AUTH REJECTED] Password hash mismatch for user: "${validated.data.email}"`);
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: 'AUTH_LOGIN_FAILED',
          details: `Failed password authentication for user: ${emailRaw}`,
          ipAddress,
          userAgent,
        },
      });
      return { error: 'Invalid password. Please check your credentials.' };
    }

    // Extract roles
    const roleCodes = user.userRoles.map((ur) => ur.role.code);
    const fullName = user.person?.fullName || user.email.split('@')[0];
    const avatarUrl = user.person?.avatarMedia?.url || null;

    // Encrypt session token
    const token = await encryptSession({
      userId: user.id,
      email: user.email,
      fullName,
      roleCodes,
      personId: user.personId,
      avatarUrl,
    });

    // Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set('yosu_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Audit log successful authentication
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'AUTH_LOGIN_SUCCESS',
        details: `User ${user.email} authenticated successfully with roles: [${roleCodes.join(', ')}]`,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Login action error:', error);
    return { error: 'An unexpected system error occurred during authentication.' };
  }

  redirect(callbackUrl);
}

export async function logoutAction(): Promise<never> {
  const reqHeaders = await headers();
  const ipAddress = reqHeaders.get('x-forwarded-for') || '127.0.0.1';
  const userAgent = reqHeaders.get('user-agent') || 'Unknown Browser';

  const cookieStore = await cookies();
  const token = cookieStore.get('yosu_session')?.value;

  if (token) {
    try {
      const { decryptSession } = await import('@/lib/auth');
      const session = await decryptSession(token);
      if (session) {
        await db.auditLog.create({
          data: {
            userId: session.userId,
            action: 'AUTH_LOGOUT',
            details: `User ${session.email} logged out cleanly`,
            ipAddress,
            userAgent,
          },
        });
      }
    } catch (e) {
      // Ignore error during cleanup
    }
  }

  cookieStore.set('yosu_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  redirect('/login');
}
