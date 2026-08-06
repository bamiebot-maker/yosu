import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { WelcomeMessageCrudPage } from '@/components/admin/crud-pages/welcome-message-crud-page';

export const revalidate = 0;

export default async function AdminWelcomeMessagePage() {
  const session = await getSession();
  const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN') ?? false;

  const [welcomeMessage, sessions] = await Promise.all([
    db.presidentialWelcome.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.administrationSession.findMany({
      orderBy: { startDate: 'desc' },
    }),
  ]);

  return (
    <WelcomeMessageCrudPage
      welcomeMessage={welcomeMessage}
      sessions={sessions}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
