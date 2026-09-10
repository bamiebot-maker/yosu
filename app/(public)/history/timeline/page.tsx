import React from 'react';
import { db } from '@/lib/db';
import { HistoryTimelineClient } from '@/components/history/history-timeline-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HistoryTimelinePage() {
  let sessionsData: any[] = [];
  try {
    const sData = await db.administrationSession.findMany({
      where: { isPublished: true },
      orderBy: [
        { displayOrder: 'desc' },
        { startDate: 'desc' },
      ],
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

      const presidentName = s.presidentName || pres?.person.fullName || 'Executive Administration';
      const presidentPhoto = s.presidentPhotoUrl || pres?.person.avatarMedia?.url || null;

      return {
        id: s.id,
        title: s.title,
        slug: s.slug,
        theme: s.theme || s.motto || 'Preserving Yoruba Heritage & Student Dignity',
        startDate: s.startDate ? new Date(s.startDate).getFullYear().toString() : '2026',
        endDate: s.endDate ? new Date(s.endDate).getFullYear().toString() : null,
        isCurrent: s.isCurrent,
        historicalSummary: s.historicalNarrative || (s as any).historicalSummary || 'Official administration session record.',
        displayOrder: s.displayOrder,
        president: {
          id: pres?.person.id || `pres-${s.id}`,
          fullName: presidentName,
          stateOfOrigin: pres?.person.stateOfOrigin || 'Yoruba',
          avatarUrl: presidentPhoto,
          officeTitle: pres?.office.title || 'Executive President',
        },
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
