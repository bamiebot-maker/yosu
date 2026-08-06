import React from 'react';
import { db } from '@/lib/db';
import { ContactMessagesCrudPage } from '@/components/admin/crud-pages/contact-messages-crud-page';

export const revalidate = 0;

export default async function AdminContactMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const serializedMessages = messages.map((m) => ({
    id: m.id,
    referenceNo: m.referenceNo,
    fullName: m.fullName,
    email: m.email,
    phone: m.phone,
    institution: m.institution,
    state: m.state,
    subject: m.subject,
    category: m.category,
    message: m.message,
    status: m.status,
    replyMessage: m.replyMessage,
    ipAddress: m.ipAddress,
    createdAt: m.createdAt.toISOString(),
    readAt: m.readAt ? m.readAt.toISOString() : null,
    repliedAt: m.repliedAt ? m.repliedAt.toISOString() : null,
  }));

  return <ContactMessagesCrudPage messages={serializedMessages} />;
}
