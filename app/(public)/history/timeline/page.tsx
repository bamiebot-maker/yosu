import React from 'react';
import { db } from '@/lib/db';
import { HistoryTimelineClient } from '@/components/history/history-timeline-client';

export const dynamic = 'force-dynamic';

export default async function HistoryTimelinePage() {
  let sessionsData: any[] = [];
  try {
    const sData = await db.administrationSession.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        appointments: {
          include: {
            person: { include: { avatarMedia: true } },
            office: true,
          },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    sessionsData = sData.map((s) => {
      const pres = s.appointments.find((a) => a.office.title.toLowerCase().includes('president') && !a.office.title.toLowerCase().includes('vice'));

      return {
        id: s.id,
        title: s.title,
        slug: s.slug,
        theme: s.theme,
        startDate: s.startDate ? new Date(s.startDate).getFullYear().toString() : '2026',
        endDate: s.endDate ? new Date(s.endDate).getFullYear().toString() : null,
        isCurrent: s.isCurrent,
        historicalSummary: (s as any).historicalSummary || 'Official administration session.',
        president: pres ? {
          id: pres.person.id,
          fullName: pres.person.fullName,
          stateOfOrigin: pres.person.stateOfOrigin,
          avatarUrl: pres.person.avatarMedia?.url || null,
          officeTitle: pres.office.title,
        } : null,
        vicePresident: null,
        secretaryGeneral: null,
        executives: [],
        houseRepresentatives: [],
        achievements: [],
        projects: [],
        constitutions: [],
        albums: [],
        mediaItems: [],
        newsArticles: [],
        events: [],
        documents: [],
        stats: {
          totalExecutives: s.appointments.length,
          totalRepresentatives: 0,
          totalProjects: 0,
          totalCompletedProjects: 0,
          totalAchievements: 0,
          totalAlbums: 0,
          totalMediaItems: 0,
          totalConstitutions: 0,
          totalNews: 0,
        },
      };
    });
  } catch (err) {
    console.error('Error fetching timeline sessions:', err);
  }

  return <HistoryTimelineClient sessions={sessionsData} />;
}
