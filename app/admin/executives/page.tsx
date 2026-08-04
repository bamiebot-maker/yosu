import React from 'react';
import { db } from '@/lib/db';
import { ExecutivesCrudPage } from '@/components/admin/crud-pages/executives-crud-page';

export const revalidate = 0; // Dynamic server page

export default async function AdminExecutivesPage() {
  const appointments = await db.officeAppointment.findMany({
    where: { status: 'ACTIVE' },
    include: {
      person: { include: { avatarMedia: true } },
      office: true,
    },
    orderBy: { displayOrder: 'asc' },
  });

  return <ExecutivesCrudPage appointments={appointments} />;
}
