import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { AchievementsCrudPage } from '@/components/admin/crud-pages/achievements-crud-page';

export const revalidate = 0;

export default async function AdminAchievementsPage() {
  const session = await getSession();
  const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN') ?? false;

  const [achievements, sessions] = await Promise.all([
    db.achievement.findMany({
      include: { session: true },
      orderBy: [{ sessionId: 'desc' }, { progressPercentage: 'desc' }],
    }),
    db.administrationSession.findMany({
      orderBy: { startDate: 'desc' },
    }),
  ]);

  return (
    <AchievementsCrudPage
      achievements={achievements}
      sessions={sessions}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
