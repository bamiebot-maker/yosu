import { db } from './db';
import { StudentRegistration, RegistrationStatus } from '@prisma/client';

export interface PermanentStudentProfile {
  id: string;
  matricNumber: string;
  fullName: string;
  gender: string;
  dateOfBirth?: Date | null;
  email: string;
  phone: string;
  stateOfOrigin: string;
  lga: string;
  homeTown: string;
  faculty: string;
  department: string;
  programme: string;
  passportUrl?: string | null;
}

export interface SessionAwareMembership {
  registrationNumber: string;
  academicSession: string;
  academicLevel: string;
  membershipCategory: string;
  status: RegistrationStatus;
  isVerified: boolean;
}

export interface UnifiedMemberData {
  profile: PermanentStudentProfile;
  membership: SessionAwareMembership;
}

/**
 * Resolves active academic session from database settings or administration session.
 */
export async function resolveCurrentAcademicSession(): Promise<string> {
  try {
    const settings = await db.registrationSettings.findFirst();
    if (settings?.academicSession) {
      return settings.academicSession;
    }

    const currentAdminSession = await db.administrationSession.findFirst({
      where: { isCurrent: true },
    });
    if (currentAdminSession?.title) {
      return currentAdminSession.title;
    }

    return '2026/2027 Academic Session';
  } catch (error) {
    return '2026/2027 Academic Session';
  }
}

/**
 * Converts a StudentRegistration record into a Session-Aware Member structure.
 * This guarantees backwards compatibility with existing registration records
 * while providing an abstraction layer for future SessionMembership records.
 */
export async function buildMemberSessionData(
  student: StudentRegistration,
  targetSession?: string
): Promise<UnifiedMemberData> {
  const currentSession = targetSession || (await resolveCurrentAcademicSession());

  return {
    profile: {
      id: student.id,
      matricNumber: student.matricNumber,
      fullName: student.fullName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      email: student.email,
      phone: student.phone,
      stateOfOrigin: student.stateOfOrigin,
      lga: student.lga,
      homeTown: student.homeTown,
      faculty: student.faculty,
      department: student.department,
      programme: student.programme,
      passportUrl: student.passportUrl,
    },
    membership: {
      registrationNumber: student.regNumber,
      academicSession: currentSession,
      academicLevel: student.level || '100L',
      membershipCategory: student.membershipCategory || 'Undergraduate',
      status: student.status,
      isVerified: student.status === 'VERIFIED',
    },
  };
}
