import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';
import { StudentRegistration } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'yosu-enterprise-super-secret-key-2026-fud-chapter'
);

const MEMBER_SESSION_COOKIE_NAME = 'yosu_member_session';

export interface MemberSessionPayload {
  studentId: string;
  regNumber: string;
  matricNumber: string;
  fullName: string;
  email: string;
  roleCodes: ['MEMBER'];
}

/**
 * Encrypts member payload into JWT string
 */
export async function encryptMemberSession(payload: MemberSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

/**
 * Decrypts and verifies member JWT session
 */
export async function decryptMemberSession(token: string): Promise<MemberSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as MemberSessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieves the current member session from HTTP-Only cookie
 */
export async function getMemberSession(): Promise<MemberSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await decryptMemberSession(token);
}

/**
 * Server guard: throws error if not authenticated as a member
 */
export async function requireMemberAuth(): Promise<MemberSessionPayload> {
  const session = await getMemberSession();
  if (!session) {
    throw new Error('UNAUTHENTICATED_MEMBER');
  }
  return session;
}

/**
 * Fetches full student registration record for current authenticated member
 */
export async function getAuthenticatedStudent(): Promise<StudentRegistration | null> {
  const session = await getMemberSession();
  if (!session?.studentId) return null;

  return await db.studentRegistration.findUnique({
    where: { id: session.studentId },
  });
}
