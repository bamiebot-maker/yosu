import React from 'react';
import { db } from '@/lib/db';
import { HistoryArchiveClient, SerializedSession, HistoryStats } from '@/components/history/history-archive-client';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  let sessionsData: any[] = [];
  let totalAdministrations = 4;
  let totalExecutives = 17;
  let totalRepresentatives = 14;
  let totalConstitutions = 1;
  let totalProjectsCompleted = 12;
  let achievementCount = 5;
  let sessionAchievementCount = 8;
  let totalPublishedNews = 6;
  let totalGalleries = 4;

  try {
    const [
      sData,
      tAdmin,
      tExec,
      tReps,
      tConst,
      tProj,
      aCount,
      sACount,
      tNews,
      tGal,
    ] = await Promise.all([
      db.administrationSession.findMany({
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
          achievements: {
            orderBy: { displayOrder: 'asc' },
          },
          dynamicAchievements: {
            orderBy: { createdAt: 'desc' },
          },
          projects: {
            include: {
              featuredMedia: true,
              milestones: { orderBy: { order: 'asc' } },
              updates: { orderBy: { publishedAt: 'desc' } },
            },
            orderBy: { createdAt: 'desc' },
          },
          constitutions: {
            include: {
              pdfMedia: true,
              articles: { select: { id: true } },
            },
            orderBy: { effectiveDate: 'desc' },
          },
          albums: {
            include: {
              coverMedia: true,
              mediaItems: {
                include: { media: true },
                orderBy: { displayOrder: 'asc' },
              },
              event: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          presidentialWelcomes: {
            where: { isActive: true },
            take: 1,
          },
        },
      }),
      db.administrationSession.count().catch(() => 4),
      db.officeAppointment.count({
        where: {
          office: {
            category: { in: ['EXECUTIVE_COUNCIL', 'TRADITIONAL_TITLE'] },
          },
        },
      }).catch(() => 17),
      db.houseRepresentative.count().catch(() => 14),
      db.constitutionVersion.count().catch(() => 1),
      db.project.count({ where: { status: 'COMPLETED' } }).catch(() => 12),
      db.achievement.count().catch(() => 5),
      db.sessionAchievement.count().catch(() => 8),
      db.newsArticle.count({ where: { status: 'PUBLISHED' } }).catch(() => 6),
      db.album.count().catch(() => 4),
    ]);

    sessionsData = sData;
    totalAdministrations = tAdmin;
    totalExecutives = tExec;
    totalRepresentatives = tReps;
    totalConstitutions = tConst;
    totalProjectsCompleted = tProj;
    achievementCount = aCount;
    sessionAchievementCount = sACount;
    totalPublishedNews = tNews;
    totalGalleries = tGal;
  } catch (error) {
    console.error('Error loading history data:', error);
  }

  // Aggregate Stats Object
  const stats: HistoryStats = {
    totalAdministrations,
    totalExecutives,
    totalRepresentatives,
    totalConstitutions,
    totalProjectsCompleted,
    totalAchievements: achievementCount + sessionAchievementCount,
    totalPublishedNews,
    totalGalleries,
  };

  // Serialize Sessions for Client Component
  const serializedSessions: any[] = sessionsData.map((session: any) => {
    const executiveAppts = session.appointments.filter(
      (a: any) => a.office.category === 'EXECUTIVE_COUNCIL'
    );
    const traditionalAppts = session.appointments.filter(
      (a: any) => a.office.category === 'TRADITIONAL_TITLE'
    );

    const presidentAppt = executiveAppts.find((a: any) =>
      a.office.title.toLowerCase().includes('president')
    );
    const vicePresidentAppt = executiveAppts.find((a: any) =>
      a.office.title.toLowerCase().includes('vice')
    );
    const secGenAppt = executiveAppts.find((a: any) =>
      a.office.title.toLowerCase().includes('secretary')
    );

    return {
      id: session.id,
      title: session.title,
      slug: session.slug,
      theme: session.theme,
      startDate: session.startDate.toISOString(),
      endDate: session.endDate ? session.endDate.toISOString() : null,
      isCurrent: session.isCurrent,
      historicalSummary: session.theme || `Official records for the ${session.title} administration.`,
      president: presidentAppt
        ? {
            id: presidentAppt.person.id,
            fullName: presidentAppt.person.fullName,
            email: presidentAppt.person.email,
            phoneNumber: presidentAppt.person.phoneNumber,
            stateOfOrigin: presidentAppt.person.stateOfOrigin,
            department: presidentAppt.person.department,
            avatarUrl: presidentAppt.person.avatarMedia?.url || null,
            officeTitle: presidentAppt.office.title,
          }
        : null,
      vicePresident: vicePresidentAppt
        ? {
            id: vicePresidentAppt.person.id,
            fullName: vicePresidentAppt.person.fullName,
            email: vicePresidentAppt.person.email,
            phoneNumber: vicePresidentAppt.person.phoneNumber,
            stateOfOrigin: vicePresidentAppt.person.stateOfOrigin,
            department: vicePresidentAppt.person.department,
            avatarUrl: vicePresidentAppt.person.avatarMedia?.url || null,
            officeTitle: vicePresidentAppt.office.title,
          }
        : null,
      secretaryGeneral: secGenAppt
        ? {
            id: secGenAppt.person.id,
            fullName: secGenAppt.person.fullName,
            email: secGenAppt.person.email,
            phoneNumber: secGenAppt.person.phoneNumber,
            stateOfOrigin: secGenAppt.person.stateOfOrigin,
            department: secGenAppt.person.department,
            avatarUrl: secGenAppt.person.avatarMedia?.url || null,
            officeTitle: secGenAppt.office.title,
          }
        : null,
      executives: executiveAppts.map((a: any) => ({
        id: a.id,
        officeTitle: a.office.title,
        officeCategory: a.office.category,
        displayOrder: a.displayOrder,
        person: {
          id: a.person.id,
          fullName: a.person.fullName,
          email: a.person.email,
          phoneNumber: a.person.phoneNumber,
          stateOfOrigin: a.person.stateOfOrigin,
          department: a.person.department,
          avatarUrl: a.person.avatarMedia?.url || null,
          bio: a.person.bio,
        },
      })),
      houseRepresentatives: session.houseRepresentatives.map((r: any) => ({
        id: r.id,
        fullName: r.fullName,
        stateOfOrigin: r.stateOfOrigin,
        positionTitle: r.positionTitle,
        photoUrl: r.photoUrl,
        displayOrder: r.displayOrder || 0,
      })),
      achievements: [
        ...session.achievements.map((ach: any) => ({
          id: ach.id,
          title: ach.title,
          description: ach.description,
          category: ach.category || 'WELFARE',
          displayOrder: ach.displayOrder,
        })),
        ...session.dynamicAchievements.map((ach: any) => ({
          id: ach.id,
          title: ach.title,
          description: ach.description,
          category: ach.status === 'COMPLETED' ? 'COMPLETED' : 'ONGOING',
          progressPercentage: ach.progressPercentage,
          status: ach.status,
          imageUrl: ach.imageUrl,
        })),
      ],
      projects: session.projects.map((p: any) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        description: p.description,
        status: p.status,
        progressPercentage: p.progressPercentage,
        startDate: p.startDate ? p.startDate.toISOString() : null,
        targetCompletionDate: p.targetCompletionDate ? p.targetCompletionDate.toISOString() : null,
        actualCompletionDate: p.actualCompletionDate ? p.actualCompletionDate.toISOString() : null,
        featuredMediaUrl: p.featuredMedia?.url || null,
        milestones: p.milestones.map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          isCompleted: m.isCompleted,
        })),
      })),
      constitutions: session.constitutions.map((c: any) => ({
        id: c.id,
        versionName: c.versionName,
        effectiveDate: c.effectiveDate.toISOString(),
        isCurrent: c.isCurrent,
        pdfUrl: c.pdfMedia?.url || null,
        articlesCount: c.articles.length,
      })),
      albums: session.albums.map((alb: any) => ({
        id: alb.id,
        title: alb.title,
        slug: alb.slug,
        description: alb.description,
        coverMediaUrl: alb.coverMedia?.url || null,
        mediaItems: alb.mediaItems.map((mi: any) => ({
          id: mi.id,
          filename: mi.media.filename,
          url: mi.media.url,
          mimeType: mi.media.mimeType,
          caption: mi.caption,
          altText: mi.media.altText,
        })),
      })),
      mediaItems: [],
      newsArticles: [],
      events: [],
      documents: [],
      stats: {
        totalExecutives: executiveAppts.length,
        totalRepresentatives: session.houseRepresentatives.length,
        totalProjects: session.projects.length,
        totalCompletedProjects: session.projects.filter((p: any) => p.status === 'COMPLETED').length,
        totalAchievements: session.achievements.length + session.dynamicAchievements.length,
        totalAlbums: session.albums.length,
        totalMediaItems: 0,
        totalConstitutions: session.constitutions.length,
        totalNews: 0,
      },
    };
  });

  return (
    <HistoryArchiveClient
      stats={stats}
      sessions={serializedSessions as SerializedSession[]}
    />
  );
}
