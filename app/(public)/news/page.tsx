import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { Newspaper, Calendar, Clock, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function NewsroomPage() {
  const articles = await db.newsArticle.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true, featuredMedia: true, author: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 font-sans">
      {/* Minimalist Header */}
      <div className="space-y-1.5 border-b border-stone-200/80 pb-4 font-sans">
        <span className="text-[10px] sm:text-xs font-bold text-amber-700 uppercase tracking-widest block">
          PRESS &amp; ANNOUNCEMENTS
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">
          YOSU Official Newsroom
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl">
          Verified press releases, executive gazettes, academic updates, and campus announcements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <Link
            key={art.id}
            href={`/news/${art.slug}`}
            className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
          >
            <div className="relative h-48 bg-stone-100 border-b border-stone-100">
              <Image
                src={art.featuredMedia?.url || '/images/logo.png'}
                alt={art.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded shadow">
                {art.category.name}
              </span>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-emerald-900 transition-colors leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{art.summary}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : 'Recent'}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-900 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
