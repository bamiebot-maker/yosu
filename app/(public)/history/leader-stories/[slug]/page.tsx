import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getLeaderArticleBySlug, LEADER_NEWS_ARTICLES } from '@/lib/history-leader-stories-data';
import { LeaderStoryDetailClient } from '@/components/history/leader-story-detail-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getLeaderArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Leader Story Not Found | YOSU Historical Archive',
    };
  }

  return {
    title: `${article.headline} | YOSU Leader Voices`,
    description: article.excerpt,
    openGraph: {
      title: article.headline,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedDate,
      authors: [article.author],
    },
  };
}

export default async function LeaderStoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getLeaderArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <LeaderStoryDetailClient article={article} />;
}
