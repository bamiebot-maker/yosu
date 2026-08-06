import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RepresentativesCrudPage } from '@/components/admin/crud-pages/representatives-crud-page';

export const revalidate = 0;

export default async function AdminRepresentativesPage() {
  const session = await getSession();
  const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN') ?? false;

  const [representatives, sessions] = await Promise.all([
    db.houseRepresentative.findMany({
      include: { session: true },
      orderBy: [{ sessionId: 'desc' }, { stateOfOrigin: 'asc' }],
    }),
    db.administrationSession.findMany({
      orderBy: { startDate: 'desc' },
    }),
  ]);

  return (
    <RepresentativesCrudPage
      representatives={representatives}
      sessions={sessions}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
