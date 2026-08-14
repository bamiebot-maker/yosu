import React from 'react';
import { redirect } from 'next/navigation';
import { getMemberSession } from '@/lib/member-auth';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildMemberSessionData } from '@/lib/membership';
import { DigitalIdCard } from '@/components/member/digital-id-card';

export const revalidate = 0; // Dynamic server component

export default async function MemberDashboardPage() {
  const memberSession = await getMemberSession();
  const adminSession = await getSession();

  if (!memberSession && !adminSession) {
    redirect('/member/login');
  }

  let student = null;
  if (memberSession?.studentId) {
    student = await db.studentRegistration.findUnique({
      where: { id: memberSession.studentId },
    });
  }

  // If no student record found (e.g. logged in as admin previewing), pick first student or dummy fallback
  if (!student) {
    student = await db.studentRegistration.findFirst();
  }

  if (!student) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-4 max-w-md mx-auto">
        <h3 className="font-serif text-lg font-bold text-slate-900">No Student Profile Found</h3>
        <p className="text-xs text-slate-500">
          Please ensure you have completed official student registration to view your digital membership pass.
        </p>
      </div>
    );
  }

  const memberData = await buildMemberSessionData(student);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Digital Membership Card
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Official digital credentials issued for {memberData.membership.academicSession}
        </p>
      </div>

      <DigitalIdCard memberData={memberData} />
    </div>
  );
}
