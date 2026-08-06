import React from 'react';
import { db } from '@/lib/db';
import { ConstitutionCrudPage } from '@/components/admin/crud-pages/constitution-crud-page';

export const revalidate = 0;

export default async function AdminConstitutionPage() {
  const [versions, sessions] = await Promise.all([
    db.constitutionVersion.findMany({
      orderBy: { effectiveDate: 'desc' },
      include: {
        session: true,
        amendments: {
          orderBy: { dateProposed: 'desc' },
        },
        articles: {
          orderBy: { articleNumber: 'asc' },
          include: {
            sections: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    }),
    db.administrationSession.findMany({
      orderBy: { startDate: 'desc' },
      select: { id: true, title: true },
    }),
  ]);

  const serializedVersions = versions.map((v) => ({
    id: v.id,
    versionName: v.versionName,
    edition: v.edition || '1st Harmonized Edition',
    effectiveDate: v.effectiveDate,
    isCurrent: v.isCurrent,
    assentedBy: v.assentedBy,
    speakerCertBy: v.speakerCertBy,
    sessionTitle: v.session?.title || 'General Session',
    articlesCount: v.articles.length,
    amendmentsCount: v.amendments.length,
    articles: v.articles.map((art) => ({
      id: art.id,
      articleNumber: art.articleNumber,
      title: art.title,
      overview: art.overview,
      sectionsCount: art.sections.length,
    })),
    amendments: v.amendments.map((am) => ({
      id: am.id,
      proposedBy: am.proposedBy,
      amendmentSummary: am.amendmentSummary,
    })),
  }));

  return <ConstitutionCrudPage versions={serializedVersions} sessions={sessions} />;
}
