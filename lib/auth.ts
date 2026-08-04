import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';
import { RoleCode } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'yosu-enterprise-super-secret-key-2026-fud-chapter'
);

const SESSION_COOKIE_NAME = 'yosu_session';

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  roleCodes: RoleCode[];
  personId?: string | null;
  avatarUrl?: string | null;
}

/**
 * Encrypts payload into a JWT session string
 */
export async function encryptSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Decrypts and verifies JWT session token
 */
export async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieves the current verified session from HTTP-Only cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await decryptSession(token);
}

/**
 * Server guard: throws or redirects if not authenticated
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHENTICATED');
  }
  return session;
}

/**
 * Server guard: checks if session has a specific role
 */
export async function requireRole(allowedRoles: RoleCode[]): Promise<SessionPayload> {
  const session = await requireAuth();
  const hasRole = session.roleCodes.some((role) => allowedRoles.includes(role));
  if (!hasRole) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
