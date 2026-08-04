import React from 'react';
import { db } from '@/lib/db';
import { NewsCrudPage } from '@/components/admin/crud-pages/news-crud-page';

export const revalidate = 0; // Dynamic server page

export default async function AdminNewsPage() {
  const articles = await db.newsArticle.findMany({
    include: { category: true, featuredMedia: true },
    orderBy: { createdAt: 'desc' },
  });

  return <NewsCrudPage articles={articles} />;
}
