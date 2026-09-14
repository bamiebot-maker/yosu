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

      let archivalPhotos: Array<{ url: string; caption?: string }> = [];
      if ((s as any).archivalPhotos && Array.isArray((s as any).archivalPhotos)) {
        archivalPhotos = ((s as any).archivalPhotos as any[])
          .filter((p) => p && typeof p.url === 'string' && p.url.trim().length > 0)
          .slice(0, 10);
      }

      let cabinetFromSession: any[] = [];
      if ((s as any).cabinetMembers && Array.isArray((s as any).cabinetMembers)) {
        cabinetFromSession = ((s as any).cabinetMembers as any[])
          .filter((m) => m && m.fullName && m.officeTitle)
          .map((m, idx) => ({
            id: m.id || `cab-${s.id}-${idx}`,
            person: {
              id: m.id || `p-cab-${s.id}-${idx}`,
              fullName: m.fullName,
              stateOfOrigin: m.stateOfOrigin || 'Yoruba',
              department: m.department || '',
              avatarUrl: m.avatarUrl || null,
            },
            officeTitle: m.officeTitle,
            officeCategory: 'EXECUTIVE_COUNCIL',
            displayOrder: idx,
          }));
      }

      const appointmentExecutives = s.appointments.map((a) => ({
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
      }));

      const executives = cabinetFromSession.length > 0 ? cabinetFromSession : appointmentExecutives;

      const cabVp = cabinetFromSession.find((c) => c.officeTitle.toLowerCase().includes('vice president'));
      const cabSecGen = cabinetFromSession.find((c) => c.officeTitle.toLowerCase().includes('secretary general'));

      const vicePresident = vp ? {
        id: vp.person.id,
        fullName: vp.person.fullName,
        stateOfOrigin: vp.person.stateOfOrigin,
        avatarUrl: vp.person.avatarMedia?.url || null,
        officeTitle: vp.office.title,
      } : (cabVp ? {
        id: cabVp.id,
        fullName: cabVp.person.fullName,
        stateOfOrigin: cabVp.person.stateOfOrigin,
        avatarUrl: cabVp.person.avatarUrl,
        officeTitle: cabVp.officeTitle,
      } : null);

      const secretaryGeneral = secGen ? {
        id: secGen.person.id,
        fullName: secGen.person.fullName,
        stateOfOrigin: secGen.person.stateOfOrigin,
        avatarUrl: secGen.person.avatarMedia?.url || null,
        officeTitle: secGen.office.title,
      } : (cabSecGen ? {
        id: cabSecGen.id,
        fullName: cabSecGen.person.fullName,
        stateOfOrigin: cabSecGen.person.stateOfOrigin,
        avatarUrl: cabSecGen.person.avatarUrl,
        officeTitle: cabSecGen.officeTitle,
      } : null);

      return {
        id: s.id,
        title: s.title,
        slug: s.slug,
        theme: s.theme || s.motto || 'Preserving Yoruba Heritage & Student Dignity',
        startDate: s.startDate ? new Date(s.startDate).getFullYear().toString() : '2026',
        endDate: s.endDate ? new Date(s.endDate).getFullYear().toString() : null,
        isCurrent: s.isCurrent,
        historicalSummary: s.historicalNarrative || (s as any).historicalSummary || 'Official administration session record and historical proceedings.',
        archivalPhotos,
        president: {
          id: pres?.person.id || `pres-${s.id}`,
          fullName: presidentName,
          stateOfOrigin: presidentState,
          avatarUrl: presidentPhoto,
          officeTitle: presidentOffice,
          bio: presidentBio,
        },
        vicePresident,
        secretaryGeneral,
        executives,
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
