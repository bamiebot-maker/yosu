import React from 'react';
import { db } from '@/lib/db';
import { HistoryHeritageArchiveClient } from '@/components/history/history-heritage-archive-client';

export const dynamic = 'force-dynamic';

export default async function HistoryHeritageArchivePage() {
  let stats = {
    totalAdministrations: 4,
    totalExecutives: 17,
    totalRepresentatives: 14,
    totalConstitutions: 1,
    totalProjectsCompleted: 12,
    totalAchievements: 5,
    totalPublishedNews: 6,
    totalGalleries: 4,
  };

  try {
    const [tAdmin, tExec, tReps, tConst, tProj, tGal] = await Promise.all([
      db.administrationSession.count().catch(() => 4),
      db.officeAppointment.count().catch(() => 17),
      db.houseRepresentative.count().catch(() => 14),
      db.constitutionVersion.count().catch(() => 1),
      db.project.count({ where: { status: 'COMPLETED' } }).catch(() => 12),
      db.album.count().catch(() => 4),
    ]);

    stats.totalAdministrations = tAdmin;
    stats.totalExecutives = tExec;
    stats.totalRepresentatives = tReps;
    stats.totalConstitutions = tConst;
    stats.totalProjectsCompleted = tProj;
    stats.totalGalleries = tGal;
  } catch (err) {
    console.error('Error loading heritage stats:', err);
  }

  return <HistoryHeritageArchiveClient stats={stats} />;
}
