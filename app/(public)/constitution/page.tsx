import React from 'react';
import { db } from '@/lib/db';
import {
  InteractiveConstitutionPortal,
  SerializedVersion,
} from '@/components/constitution/interactive-constitution-portal';

export const revalidate = 60;

export default async function ConstitutionPage() {
  const [
    allVersionsData,
    totalArticlesCount,
    totalSectionsCount,
    totalAmendmentsCount,
  ] = await Promise.all([
    db.constitutionVersion.findMany({
      orderBy: { effectiveDate: 'desc' },
      include: {
        session: true,
        pdfMedia: true,
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
    db.constitutionArticle.count(),
    db.constitutionSection.count(),
    db.constitutionAmendment.count(),
  ]);

  if (!allVersionsData || allVersionsData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Constitution Gazette Repository</h1>
        <p className="text-slate-500 text-sm">No constitution versions found in the database.</p>
      </div>
    );
  }

  // Format Date Helper
  const formatDate = (date?: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Serialize Versions
  const serializedVersions: SerializedVersion[] = allVersionsData.map((ver) => ({
    id: ver.id,
    versionName: ver.versionName,
    edition: ver.edition || '1st Harmonized Edition',
    effectiveDate: formatDate(ver.effectiveDate) || 'Ratified',
    adoptionDate: formatDate(ver.adoptionDate),
    ratificationDate: formatDate(ver.ratificationDate),
    isCurrent: ver.isCurrent,
    assentedBy: ver.assentedBy || 'President Asiwaju Abdulsalam Oluwagbenga',
    speakerCertBy: ver.speakerCertBy || 'Speaker Rt. Hon. Ibrahim Sobur Bamidele',
    pdfUrl: ver.pdfMedia?.url || '/downloads/YOSU_Unification_Constitution_2026.pdf',
    viewsCount: ver.viewsCount || 0,
    downloadsCount: ver.downloadsCount || 0,
    sessionTitle: ver.session?.title,
    articles: ver.articles.map((art) => ({
      id: art.id,
      articleNumber: art.articleNumber,
      title: art.title,
      slug: art.slug,
      overview: art.overview,
      sections: art.sections.map((sec) => ({
        id: sec.id,
        sectionNumber: sec.sectionNumber,
        title: sec.title,
        content: sec.content,
        displayOrder: sec.displayOrder,
      })),
    })),
    amendments: ver.amendments.map((am) => ({
      id: am.id,
      proposedBy: am.proposedBy,
      dateProposed: formatDate(am.dateProposed) || '',
      dateRatified: formatDate(am.dateRatified),
      amendmentSummary: am.amendmentSummary,
      fullText: am.fullText,
    })),
  }));

  const currentVersion =
    serializedVersions.find((v) => v.isCurrent) || serializedVersions[0];

  const totalViews = serializedVersions.reduce((acc, v) => acc + v.viewsCount, 0);
  const totalDownloads = serializedVersions.reduce((acc, v) => acc + v.downloadsCount, 0);

  const stats = {
    totalChapters: 7,
    totalArticles: totalArticlesCount,
    totalSections: totalSectionsCount,
    totalAmendments: totalAmendmentsCount,
    totalViews,
    totalDownloads,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <InteractiveConstitutionPortal
        currentVersion={currentVersion}
        allVersions={serializedVersions}
        stats={stats}
      />
    </div>
  );
}
