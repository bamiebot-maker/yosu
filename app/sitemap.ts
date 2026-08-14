import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yosu.fud.edu.ng';

  // Static Public Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/history',
    '/leadership',
    '/constitution',
    '/news',
    '/gallery',
    '/projects',
    '/contact',
    '/register',
    '/downloads',
    '/culture',
    '/events',
    '/constituent-states',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic News Article Routes
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = await db.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      take: 100,
    });

    newsRoutes = articles.map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (e) {
    // Graceful fallback if database connection is unavailable during build
  }

  return [...staticRoutes, ...newsRoutes];
}
