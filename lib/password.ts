import bcrypt from 'bcryptjs';

/**
 * Generates a secure salted bcrypt password hash (10 salt rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Verifies a plain text password against a salted bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
