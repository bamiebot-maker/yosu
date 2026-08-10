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
      {/* Header Banner (TASK 5 - COMPACT MOBILE HEADER CARD) */}
      <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 sm:space-y-4 relative z-10">
          <span className="bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5 text-amber-400" />
            PRESS & ANNOUNCEMENTS
          </span>
          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-white">YOSU Official Newsroom</h1>
          <p className="text-stone-200 text-xs sm:text-sm font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
            Verified press releases, executive gazettes, academic updates, and campus announcements.
          </p>
        </div>
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
