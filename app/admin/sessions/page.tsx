import React from 'react';
import { db } from '@/lib/db';
import { SessionsCrudPage } from '@/components/admin/crud-pages/sessions-crud-page';

export const revalidate = 0; // Dynamic server page

export default async function AdminSessionsPage() {
  const sessions = await db.administrationSession.findMany({
    include: {
      _count: {
        select: {
          appointments: true,
          albums: true,
          projects: true,
        },
      },
    },
    orderBy: { startDate: 'desc' },
  });

  return <SessionsCrudPage sessions={sessions} />;
}
