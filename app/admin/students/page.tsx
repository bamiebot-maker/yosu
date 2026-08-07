import React from 'react';
import { db } from '@/lib/db';
import { StudentsCrudPage } from '@/components/admin/crud-pages/students-crud-page';

export const revalidate = 0;

export default async function AdminStudentsPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [students, totalCount, maleCount, femaleCount, verifiedCount, pendingCount, todayCount] = await Promise.all([
    db.studentRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    db.studentRegistration.count(),
    db.studentRegistration.count({ where: { gender: 'MALE' } }),
    db.studentRegistration.count({ where: { gender: 'FEMALE' } }),
    db.studentRegistration.count({ where: { status: 'VERIFIED' } }),
    db.studentRegistration.count({ where: { status: 'PENDING' } }),
    db.studentRegistration.count({ where: { createdAt: { gte: startOfToday } } }),
  ]);

  const serializedStudents = students.map((s) => ({
    id: s.id,
    regNumber: s.regNumber,
    fullName: s.fullName,
    gender: s.gender,
    birthMonth: s.birthMonth,
    birthDay: s.birthDay,
    passportUrl: s.passportUrl,
    matricNumber: s.matricNumber,
    jambRegNumber: s.jambRegNumber,
    faculty: s.faculty,
    department: s.department,
    programme: s.programme,
    level: s.level,
    phone: s.phone,
    whatsapp: s.whatsapp,
    email: s.email,
    stateOfOrigin: s.stateOfOrigin,
    lga: s.lga,
    homeTown: s.homeTown,
    residenceType: s.residenceType,
    hallOfResidence: s.hallOfResidence,
    roomNumber: s.roomNumber,
    residentialAddress: s.residentialAddress,
    areaCouncil: s.areaCouncil,
    membershipCategory: s.membershipCategory,
    emergencyContactName: s.emergencyContactName,
    emergencyContactRelationship: s.emergencyContactRelationship,
    emergencyContactPhone: s.emergencyContactPhone,
    status: s.status,
    notes: s.notes,
    createdAt: s.createdAt.toISOString(),
  }));

  const stats = {
    totalStudents: totalCount,
    maleCount,
    femaleCount,
    verifiedCount,
    pendingCount,
    todayCount,
  };

  return <StudentsCrudPage students={serializedStudents} stats={stats} />;
}
