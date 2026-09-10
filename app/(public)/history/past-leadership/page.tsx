import React from 'react';
import { db } from '@/lib/db';
import { HistoryPastLeadershipClient } from '@/components/history/history-past-leadership-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HistoryPastLeadershipPage() {
  let sessionsData: any[] = [];
  try {
    const sData = await db.administrationSession.findMany({
      where: { isPublished: true },
      orderBy: [
        { displayOrder: 'desc' },
        { startDate: 'desc' },
      ],
      include: {
        achievements: {
          orderBy: { displayOrder: 'asc' },
        },
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

      const presidentName = s.presidentName || pres?.person.fullName || 'Executive Administration';
      const presidentPhoto = s.presidentPhotoUrl || pres?.person.avatarMedia?.url || null;
      const presidentBio = s.presidentBio || pres?.person.bio || '';
      const presidentState = pres?.person.stateOfOrigin || 'Yoruba';
      const presidentOffice = pres?.office.title || 'Executive President';

      return {
        id: s.id,
        title: s.title,
        slug: s.slug,
        theme: s.theme || s.motto || 'Preserving Yoruba Heritage & Student Dignity',
        startDate: s.startDate ? new Date(s.startDate).getFullYear().toString() : '2026',
        endDate: s.endDate ? new Date(s.endDate).getFullYear().toString() : null,
        isCurrent: s.isCurrent,
        historicalSummary: s.historicalNarrative || (s as any).historicalSummary || 'Official administration session record and historical proceedings.',
        president: {
          id: pres?.person.id || `pres-${s.id}`,
          fullName: presidentName,
          stateOfOrigin: presidentState,
          avatarUrl: presidentPhoto,
          officeTitle: presidentOffice,
          bio: presidentBio,
        },
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
        achievements: s.achievements.map((ach) => ({
          id: ach.id,
          title: ach.title,
          description: ach.description,
          category: ach.category || 'ACADEMIC',
        })),
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
          totalAchievements: s.achievements.length,
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
