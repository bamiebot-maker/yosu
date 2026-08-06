import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Calendar, Clock, ArrowLeft, Eye, Newspaper } from 'lucide-react';
import { ArticleInteraction } from '@/components/news/article-interaction';

export const revalidate = 60;

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await db.newsArticle.findUnique({
    where: { slug },
    include: { category: true, featuredMedia: true, author: true },
  });

  if (!article) notFound();

  // Increment viewCount asynchronously
  await db.newsArticle.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  // Fetch 3 Related News articles from same category or latest
  const relatedArticles = await db.newsArticle.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: article.id },
      categoryId: article.categoryId,
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
    include: { category: true, featuredMedia: true },
  });

  // Fallback if less than 3 in same category
  const fallbackArticles = relatedArticles.length < 3
    ? await db.newsArticle.findMany({
        where: {
          status: 'PUBLISHED',
          id: { notIn: [article.id, ...relatedArticles.map((a) => a.id)] },
        },
        take: 3 - relatedArticles.length,
        orderBy: { publishedAt: 'desc' },
        include: { category: true, featuredMedia: true },
      })
    : [];

  const allRelated = [...relatedArticles, ...fallbackArticles];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-950 hover:text-amber-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-amber-500" />
        <span>Back to Official Newsroom</span>
      </Link>

      <div className="space-y-4">
        <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase px-3 py-1 rounded tracking-wider border border-amber-200">
          {article.category.name}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{article.readingTimeMinutes} min read</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span>{article.viewCount + 1} Views</span>
          </div>
        </div>
      </div>

      {article.featuredMedia?.url && (
        <div className="relative w-full h-80 sm:h-[450px] rounded-3xl overflow-hidden shadow-xl border border-stone-200">
          <Image
            src={article.featuredMedia.url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-slate-800 text-base leading-relaxed font-light">
        {article.summary && (
          <p className="font-serif italic text-lg sm:text-xl text-emerald-950 font-medium border-l-4 border-amber-400 pl-5 py-1">
            {article.summary}
          </p>
        )}
        <div className="whitespace-pre-line space-y-4 font-normal text-slate-900">{article.content}</div>

        {/* Interactive Likes & Shares Component */}
        <ArticleInteraction
          articleId={article.id}
          title={article.title}
          summary={article.summary}
          initialLikeCount={article.likeCount}
          initialShareCount={article.shareCount}
        />
      </div>

      {/* Related News Section (TASK 6) */}
      {allRelated.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-stone-200">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-2xl font-bold text-slate-900">Related News & Statements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allRelated.map((rel) => (
              <Link
                key={rel.id}
                href={`/news/${rel.slug}`}
                className="group bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {rel.featuredMedia?.url && (
                    <div className="relative w-full h-40 overflow-hidden">
                      <Image
                        src={rel.featuredMedia.url}
                        alt={rel.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase">
                      {rel.category.name}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-emerald-900 transition-colors">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{rel.summary}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 text-[10px] text-slate-400 font-medium">
                  {rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString() : 'Recent'}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
