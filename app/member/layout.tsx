import React from 'react';
import { getMemberSession } from '@/lib/member-auth';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { MemberLayoutHeader, MemberLayoutMobileNav } from '@/components/member/member-layout-header';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const memberSession = await getMemberSession();
  const adminSession = await getSession();

  if (!memberSession && !adminSession) {
    return <>{children}</>;
  }

  // Fetch full student registration record if memberSession exists
  let student = null;
  if (memberSession?.studentId) {
    student = await db.studentRegistration.findUnique({
      where: { id: memberSession.studentId },
    });
  }

  const memberName = student?.fullName || memberSession?.fullName || adminSession?.fullName || 'Verified Member';
  const regNumber = student?.regNumber || memberSession?.regNumber || 'YOSU MEMBER';

  return (
    <div className="min-h-screen bg-stone-100 font-sans flex flex-col justify-between pb-20 md:pb-8">
      {/* Sticky Top Navigation Bar */}
      <MemberLayoutHeader memberName={memberName} regNumber={regNumber} />

      {/* Main Page Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-grow">
        {children}
      </main>

      {/* Sticky Mobile Navigation Bar */}
      <MemberLayoutMobileNav />
    </div>
  );
}
