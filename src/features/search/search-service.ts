import { db } from '@/lib/db';

export interface SearchResultItem {
  id: string;
  domain: 'NEWS' | 'CONSTITUTION' | 'LEADERSHIP' | 'PROJECTS' | 'EVENTS' | 'DOWNLOADS';
  title: string;
  subtitle?: string;
  snippet: string;
  url: string;
  date?: Date;
}

export async function searchAllDomains(query: string): Promise<SearchResultItem[]> {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim().toLowerCase();
  const results: SearchResultItem[] = [];

  // 1. Search Constitution
  const sections = await db.constitutionSection.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
        { sectionNumber: { contains: q } },
      ],
    },
    include: { article: true },
    take: 10,
  });

  for (const s of sections) {
    results.push({
      id: `const-${s.id}`,
      domain: 'CONSTITUTION',
      title: `${s.sectionNumber}: ${s.title}`,
      subtitle: `Article ${s.article.articleNumber} — ${s.article.title}`,
      snippet: s.content.length > 160 ? s.content.substring(0, 160) + '...' : s.content,
      url: `/constitution#${s.id}`,
    });
  }

  // 2. Search News Articles
  const articles = await db.newsArticle.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q } },
        { summary: { contains: q } },
        { content: { contains: q } },
      ],
    },
    take: 10,
  });

  for (const a of articles) {
    results.push({
      id: `news-${a.id}`,
      domain: 'NEWS',
      title: a.title,
      subtitle: 'Official Press Release',
      snippet: a.summary || a.content.substring(0, 160) + '...',
      url: `/news/${a.slug}`,
      date: a.publishedAt || a.createdAt,
    });
  }

  // 3. Search Leadership & Offices
  const appointments = await db.officeAppointment.findMany({
    where: {
      OR: [
        { person: { fullName: { contains: q } } },
        { office: { title: { contains: q } } },
        { person: { stateOfOrigin: { contains: q } } },
      ],
    },
    include: { person: true, office: true },
    take: 10,
  });

  for (const appt of appointments) {
    results.push({
      id: `lead-${appt.id}`,
      domain: 'LEADERSHIP',
      title: appt.person.fullName,
      subtitle: `${appt.office.title} (${appt.person.stateOfOrigin} State)`,
      snippet: appt.person.bio || `${appt.office.title} of YOSU FUD`,
      url: '/leadership',
    });
  }

  // 4. Search Projects
  const projects = await db.project.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { summary: { contains: q } },
        { description: { contains: q } },
      ],
    },
    take: 5,
  });

  for (const p of projects) {
    results.push({
      id: `proj-${p.id}`,
      domain: 'PROJECTS',
      title: p.title,
      subtitle: `Status: ${p.status} (${p.progressPercentage}% Complete)`,
      snippet: p.summary || p.description.substring(0, 160) + '...',
      url: '/projects',
    });
  }

  return results;
}
