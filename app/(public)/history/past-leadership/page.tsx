import React from 'react';
import { db } from '@/lib/db';
import { HistoryPastLeadershipClient } from '@/components/history/history-past-leadership-client';

export const dynamic = 'force-dynamic';

export default async function HistoryPastLeadershipPage() {
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
        houseRepresentatives: {
          orderBy: [{ stateOfOrigin: 'asc' }, { displayOrder: 'asc' }],
        },
      },
    });

    sessionsData = sData.map((s) => {
      const pres = s.appointments.find((a) => a.office.title.toLowerCase().includes('president') && !a.office.title.toLowerCase().includes('vice'));
      const vp = s.appointments.find((a) => a.office.title.toLowerCase().includes('vice president'));
      const secGen = s.appointments.find((a) => a.office.title.toLowerCase().includes('secretary general'));

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
        vicePresident: vp ? {
          id: vp.person.id,
          fullName: vp.person.fullName,
          stateOfOrigin: vp.person.stateOfOrigin,
          avatarUrl: vp.person.avatarMedia?.url || null,
          officeTitle: vp.office.title,
        } : null,
        secretaryGeneral: secGen ? {
          id: secGen.person.id,
          fullName: secGen.person.fullName,
          stateOfOrigin: secGen.person.stateOfOrigin,
          avatarUrl: secGen.person.avatarMedia?.url || null,
          officeTitle: secGen.office.title,
        } : null,
        executives: s.appointments.map((a) => ({
          id: a.id,
          person: {
            id: a.person.id,
            fullName: a.person.fullName,
            stateOfOrigin: a.person.stateOfOrigin,
            department: a.person.department,
            avatarUrl: a.person.avatarMedia?.url || null,
          },
          officeTitle: a.office.title,
          officeCategory: a.office.category,
          displayOrder: a.displayOrder,
        })),
        houseRepresentatives: s.houseRepresentatives.map((r) => ({
          id: r.id,
          fullName: r.fullName,
          stateOfOrigin: r.stateOfOrigin,
          positionTitle: r.positionTitle,
          photoUrl: r.photoUrl,
          displayOrder: r.displayOrder,
        })),
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
          totalRepresentatives: s.houseRepresentatives.length,
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
    console.error('Error fetching past leadership sessions:', err);
  }

  return <HistoryPastLeadershipClient sessions={sessionsData} />;
}
