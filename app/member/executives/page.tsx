import React from 'react';
import { db } from '@/lib/db';
import { ExecutiveDirectory, ExecutiveOfficerData } from '@/components/member/executive-directory';

export const revalidate = 60; // Cache for 60 seconds

export default async function MemberExecutivesPage() {
  // Query active administration session
  const activeSession =
    (await db.administrationSession.findFirst({ where: { isCurrent: true } })) ||
    (await db.administrationSession.findFirst({ orderBy: { startDate: 'desc' } }));

  const sessionId = activeSession?.id;

  // 1. Fetch Executive Council Appointments
  const appointments = sessionId
    ? await db.officeAppointment.findMany({
        where: { sessionId, status: 'ACTIVE' },
        include: {
          person: { include: { avatarMedia: true } },
          office: true,
        },
        orderBy: { displayOrder: 'asc' },
      })
    : [];

  const executives: ExecutiveOfficerData[] = appointments.map((appt) => ({
    id: appt.id,
    name: appt.person.fullName,
    officeTitle: appt.office.title,
    stateOfOrigin: appt.person.stateOfOrigin,
    phone: appt.person.phoneNumber,
    email: appt.person.email,
    photoUrl: appt.person.avatarMedia?.url || null,
    category: 'EXECUTIVE',
  }));

  // 2. Fetch House of Representatives Delegates
  const houseReps = sessionId
    ? await db.houseRepresentative.findMany({
        where: { sessionId },
        orderBy: [{ stateOfOrigin: 'asc' }, { displayOrder: 'asc' }],
      })
    : [];

  const representatives: ExecutiveOfficerData[] = houseReps.map((rep) => ({
    id: rep.id,
    name: rep.fullName,
    officeTitle: rep.positionTitle || 'House Representative',
    stateOfOrigin: rep.stateOfOrigin,
    photoUrl: rep.photoUrl,
    category: 'HOUSE',
  }));

  const statesList = ['Oyo', 'Osun', 'Ogun', 'Ondo', 'Ekiti', 'Lagos', 'Kwara', 'Kogi'];

  return (
    <ExecutiveDirectory
      executives={executives}
      representatives={representatives}
      statesList={statesList}
    />
  );
}
