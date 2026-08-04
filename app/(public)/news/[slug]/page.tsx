import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Calendar, Clock, ArrowLeft, Share2, Tag } from 'lucide-react';

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:text-amber-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Newsroom</span>
      </Link>

      <div className="space-y-4">
        <span className="bg-amber-100 text-amber-900 font-bold text-xs uppercase px-3 py-1 rounded">
          {article.category.name}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </div>
      </div>

      {article.featuredMedia?.url && (
        <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md">
          <Image
            src={article.featuredMedia.url}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-slate-800 text-sm sm:text-base leading-relaxed font-light">
        {article.summary && (
          <p className="font-serif italic text-base text-emerald-950 font-medium border-l-4 border-[#E5A91A] pl-4 py-1">
            {article.summary}
          </p>
        )}
        <div className="whitespace-pre-line space-y-4">{article.content}</div>
      </div>
    </div>
  );
}
