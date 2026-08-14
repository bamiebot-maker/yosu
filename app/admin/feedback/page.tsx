import React from 'react';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { FeedbackCrudPage, MemberFeedbackAdminItem } from '@/components/admin/crud-pages/feedback-crud-page';

export const revalidate = 0; // Dynamic server component

export default async function AdminFeedbackPage() {
  await requireRole(['SUPER_ADMIN', 'ADMIN', 'PRESIDENT', 'VICE_PRESIDENT', 'SECRETARY_GENERAL']);

  const feedbackRecords = await db.memberFeedback.findMany({
    include: {
      student: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const feedbacks: MemberFeedbackAdminItem[] = feedbackRecords.map((f) => ({
    id: f.id,
    studentId: f.studentId,
    studentName: f.student.fullName,
    studentRegNumber: f.student.regNumber,
    studentMatricNumber: f.student.matricNumber,
    studentDepartment: f.student.department,
    studentEmail: f.student.email,
    studentPhone: f.student.phone,
    subject: f.subject,
    category: f.category,
    message: f.message,
    status: f.status as any,
    adminNotes: f.adminNotes,
    createdAt: f.createdAt.toISOString(),
  }));

  return <FeedbackCrudPage feedbacks={feedbacks} />;
}
