import React from 'react';
import { db } from '@/lib/db';
import { HistoryArchiveClient, SerializedSession, HistoryStats } from '@/components/history/history-archive-client';

export const revalidate = 60;

export default async function HistoryPage() {
  // Execute all database queries in parallel for peak performance
  const [
    sessionsData,
    totalAdministrations,
    totalExecutives,
    totalRepresentatives,
    totalConstitutions,
    totalProjectsCompleted,
    achievementCount,
    sessionAchievementCount,
    totalPublishedNews,
    totalGalleries,
    allNewsArticles,
    allEvents,
    allDownloads,
  ] = await Promise.all([
    db.administrationSession.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        appointments: {
          include: {
            person: {
              include: { avatarMedia: true },
            },
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
            articles: {
              select: { id: true },
            },
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
    db.administrationSession.count(),
    db.officeAppointment.count({
      where: {
        office: {
          category: {
            in: ['EXECUTIVE_COUNCIL', 'TRADITIONAL_TITLE'],
          },
        },
      },
    }),
    db.houseRepresentative.count(),
    db.constitutionVersion.count(),
    db.project.count({
      where: { status: 'COMPLETED' },
    }),
    db.achievement.count(),
    db.sessionAchievement.count(),
    db.newsArticle.count({
      where: { status: 'PUBLISHED' },
    }),
    db.album.count(),
    db.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: {
          include: { person: true },
        },
        featuredMedia: true,
      },
      orderBy: { publishedAt: 'desc' },
    }),
    db.event.findMany({
      include: {
        bannerMedia: true,
      },
      orderBy: { startDate: 'desc' },
    }),
    db.downloadResource.findMany({
      where: { isPublic: true },
      include: {
        fileMedia: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const globalStats: HistoryStats = {
    totalAdministrations,
    totalExecutives,
    totalRepresentatives,
    totalConstitutions,
    totalProjectsCompleted,
    totalAchievements: achievementCount + sessionAchievementCount,
    totalPublishedNews,
    totalGalleries,
  };

  // Helper date formatter
  const formatDate = (date?: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Map database sessions to fully serialized structures
  const serializedSessions: SerializedSession[] = sessionsData.map((session) => {
    const sStart = new Date(session.startDate);
    const sEnd = session.endDate ? new Date(session.endDate) : new Date();

    // 1. Identify President, VP, SecGen
    const presidentApp = session.appointments.find(
      (a) =>
        a.office.category === 'EXECUTIVE_COUNCIL' &&
        a.office.title.toLowerCase().includes('president') &&
        !a.office.title.toLowerCase().includes('vice') &&
        !a.office.title.toLowerCase().includes('assistant')
    );

    const vpApp = session.appointments.find(
      (a) =>
        a.office.category === 'EXECUTIVE_COUNCIL' &&
        a.office.title.toLowerCase().includes('vice president')
    );

    const secGenApp = session.appointments.find(
      (a) =>
        a.office.category === 'EXECUTIVE_COUNCIL' &&
        a.office.title.toLowerCase().includes('secretary general') &&
        !a.office.title.toLowerCase().includes('assistant')
    );

    const presWelcome = session.presidentialWelcomes[0];

    const president = presidentApp
      ? {
          id: presidentApp.person.id,
          fullName: presidentApp.person.fullName,
          email: presidentApp.person.email,
          phoneNumber: presidentApp.person.phoneNumber,
          stateOfOrigin: presidentApp.person.stateOfOrigin,
          department: presidentApp.person.department,
          level: presidentApp.person.level,
          bio: presidentApp.person.bio || presWelcome?.welcomeSummary,
          avatarUrl: presidentApp.person.avatarMedia?.url || presWelcome?.portraitUrl,
          officeTitle: presidentApp.office.title,
        }
      : presWelcome
      ? {
          id: presWelcome.id,
          fullName: presWelcome.presidentName,
          stateOfOrigin: presWelcome.stateOfOrigin,
          bio: presWelcome.welcomeSummary,
          avatarUrl: presWelcome.portraitUrl,
          officeTitle: presWelcome.officeTitle,
        }
      : null;

    const vicePresident = vpApp
      ? {
          id: vpApp.person.id,
          fullName: vpApp.person.fullName,
          email: vpApp.person.email,
          phoneNumber: vpApp.person.phoneNumber,
          stateOfOrigin: vpApp.person.stateOfOrigin,
          department: vpApp.person.department,
          level: vpApp.person.level,
          bio: vpApp.person.bio,
          avatarUrl: vpApp.person.avatarMedia?.url,
          officeTitle: vpApp.office.title,
        }
      : null;

    const secretaryGeneral = secGenApp
      ? {
          id: secGenApp.person.id,
          fullName: secGenApp.person.fullName,
          email: secGenApp.person.email,
          phoneNumber: secGenApp.person.phoneNumber,
          stateOfOrigin: secGenApp.person.stateOfOrigin,
          department: secGenApp.person.department,
          level: secGenApp.person.level,
          bio: secGenApp.person.bio,
          avatarUrl: secGenApp.person.avatarMedia?.url,
          officeTitle: secGenApp.office.title,
        }
      : null;

    // 2. Executive Officers belonging ONLY to this session
    const executives = session.appointments
      .filter(
        (a) =>
          a.office.category === 'EXECUTIVE_COUNCIL' ||
          a.office.category === 'TRADITIONAL_TITLE'
      )
      .map((a) => ({
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
          level: a.person.level,
          bio: a.person.bio,
          avatarUrl: a.person.avatarMedia?.url,
        },
      }));

    // 3. Representatives belonging ONLY to this session
    const houseRepresentatives = session.houseRepresentatives.map((r) => ({
      id: r.id,
      fullName: r.fullName,
      stateOfOrigin: r.stateOfOrigin,
      positionTitle: r.positionTitle,
      photoUrl: r.photoUrl,
      displayOrder: r.displayOrder,
    }));

    // 4. Combined Session Achievements (dynamic + session achievements)
    const combinedAchievements = [
      ...session.dynamicAchievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        progressPercentage: a.progressPercentage,
        status: a.status,
        imageUrl: a.imageUrl,
      })),
      ...session.achievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        category: a.category,
        displayOrder: a.displayOrder,
      })),
    ];

    // 5. Projects belonging to this session
    const projects = session.projects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      description: p.description,
      status: p.status,
      progressPercentage: p.progressPercentage,
      startDate: formatDate(p.startDate),
      targetCompletionDate: formatDate(p.targetCompletionDate),
      actualCompletionDate: formatDate(p.actualCompletionDate),
      budgetAmount: p.budgetAmount,
      spentAmount: p.spentAmount,
      featuredMediaUrl: p.featuredMedia?.url,
      milestones: p.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        isCompleted: m.isCompleted,
      })),
    }));

    // 6. Constitutions belonging to this session
    const constitutions = session.constitutions.map((c) => ({
      id: c.id,
      versionName: c.versionName,
      effectiveDate: formatDate(c.effectiveDate) || 'Ratified',
      isCurrent: c.isCurrent,
      pdfUrl: c.pdfMedia?.url,
      articlesCount: c.articles.length,
    }));

    // 7. Extract Media Items from Albums belonging to this session
    const albums = session.albums.map((alb) => ({
      id: alb.id,
      title: alb.title,
      slug: alb.slug,
      description: alb.description,
      coverMediaUrl: alb.coverMedia?.url,
      mediaItems: alb.mediaItems.map((item) => ({
        id: item.media.id,
        filename: item.media.filename,
        url: item.media.url,
        mimeType: item.media.mimeType,
        caption: item.caption,
        altText: item.media.altText,
      })),
    }));

    const sessionMediaItems = albums.flatMap((a) => a.mediaItems);

    // 8. News Articles published during this administration session
    const newsArticles = allNewsArticles
      .filter((n) => {
        if (!n.publishedAt) return false;
        const pDate = new Date(n.publishedAt);
        return pDate >= sStart && pDate <= sEnd;
      })
      .map((n) => ({
        id: n.id,
        title: n.title,
        slug: n.slug,
        summary: n.summary,
        publishedAt: formatDate(n.publishedAt),
        featuredMediaUrl: n.featuredMedia?.url,
        categoryName: n.category?.name,
        authorName: n.author?.person?.fullName || 'Secretariat',
      }));

    // 9. Events occurring during this session
    const events = allEvents
      .filter((e) => {
        const eDate = new Date(e.startDate);
        return eDate >= sStart && eDate <= sEnd;
      })
      .map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        description: e.description,
        location: e.location,
        startDate: formatDate(e.startDate) || '',
        endDate: formatDate(e.endDate),
        bannerMediaUrl: e.bannerMedia?.url,
      }));

    // 10. Documents published during this session
    const documents = allDownloads
      .filter((d) => {
        const dDate = new Date(d.createdAt);
        return dDate >= sStart && dDate <= sEnd;
      })
      .map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        category: d.category,
        fileUrl: d.fileMedia?.url || '#',
        mimeType: d.fileMedia?.mimeType || 'application/pdf',
        downloadsCount: d.downloadsCount,
        createdAt: formatDate(d.createdAt) || '',
      }));

    const historicalSummary =
      presWelcome?.welcomeSummary ||
      session.theme ||
      `Official administration session of the Yoruba Students' Union (YOSU), Federal University Dutse Chapter, serving from ${formatDate(
        session.startDate
      )}${session.endDate ? ` to ${formatDate(session.endDate)}` : ' to date'}.`;

    return {
      id: session.id,
      title: session.title,
      slug: session.slug,
      theme: session.theme,
      startDate: formatDate(session.startDate) || '',
      endDate: formatDate(session.endDate),
      isCurrent: session.isCurrent,
      historicalSummary,
      president,
      vicePresident,
      secretaryGeneral,
      executives,
      houseRepresentatives,
      achievements: combinedAchievements,
      projects,
      constitutions,
      albums,
      mediaItems: sessionMediaItems,
      newsArticles,
      events,
      documents,
      stats: {
        totalExecutives: executives.length,
        totalRepresentatives: houseRepresentatives.length,
        totalProjects: projects.length,
        totalCompletedProjects: projects.filter(
          (p) => p.status === 'COMPLETED' || p.progressPercentage === 100
        ).length,
        totalAchievements: combinedAchievements.length,
        totalAlbums: albums.length,
        totalMediaItems: sessionMediaItems.length,
        totalConstitutions: constitutions.length,
        totalNews: newsArticles.length,
      },
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <HistoryArchiveClient stats={globalStats} sessions={serializedSessions} />
    </div>
  );
}
