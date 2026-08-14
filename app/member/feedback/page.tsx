import React from 'react';
import { redirect } from 'next/navigation';
import { getMemberSession } from '@/lib/member-auth';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { FeedbackCentre, MemberFeedbackItem } from '@/components/member/feedback-centre';

export const revalidate = 0; // Dynamic server component

export default async function MemberFeedbackPage() {
  const memberSession = await getMemberSession();
  const adminSession = await getSession();

  if (!memberSession && !adminSession) {
    redirect('/member/login');
  }

  const studentId = memberSession?.studentId;

  const rawFeedbacks = studentId
    ? await db.memberFeedback.findMany({
        where: { studentId },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  const feedbacks: MemberFeedbackItem[] = rawFeedbacks.map((f) => ({
    id: f.id,
    subject: f.subject,
    category: f.category,
    message: f.message,
    status: f.status,
    adminNotes: f.adminNotes,
    createdAt: f.createdAt,
  }));

  return <FeedbackCentre feedbacks={feedbacks} />;
}
