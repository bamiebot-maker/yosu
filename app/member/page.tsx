import React from 'react';
import { redirect } from 'next/navigation';
import { getMemberSession } from '@/lib/member-auth';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildMemberSessionData } from '@/lib/membership';
import { MemberPortalDashboardClient } from '@/components/member/member-portal-dashboard-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MemberDashboardPage() {
  const memberSession = await getMemberSession();
  const adminSession = await getSession();

  if (!memberSession && !adminSession) {
    redirect('/member/login');
  }

  let student = null;
  try {
    if (memberSession?.studentId) {
      student = await db.studentRegistration.findUnique({
        where: { id: memberSession.studentId },
      });
    }

    if (!student) {
      student = await db.studentRegistration.findFirst();
    }
  } catch (error) {
    console.error('Error loading student profile:', error);
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

  return <MemberPortalDashboardClient memberData={memberData} student={student} />;
}
