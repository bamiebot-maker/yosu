'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  ChevronRight,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  Heart,
  Share2,
  Quote,
  Newspaper,
  BookOpen,
} from 'lucide-react';
import { LEADER_NEWS_ARTICLES } from '@/lib/history-leader-stories-data';

export function HistoryLeaderStoriesClient() {
  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-6 sm:space-y-8 font-sans">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/history" className="hover:text-emerald-700 transition-colors">
          <span>History Archive</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900">3. Voices from Past Leaders</span>
      </nav>

      {/* EDITORIAL BROADSHEET HEADER */}
      <div className="border-b border-stone-200 pb-4 sm:pb-6 space-y-2">
        <span className="bg-emerald-950 text-amber-300 font-extrabold text-[9px] sm:text-[10px] uppercase px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
          HISTORICAL GAZETTE • NEWSROOM COLLECTION
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Voices from Past Leaders &amp; Presidential Memoirs
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
          Explore firsthand journalistic reflections, founding memoirs, and advice on moral conduct and academic mastery transcribed from past presidents of YOSU FUD. Select any headline below to read the complete article.
        </p>
      </div>

      {/* NEWS HEADLINE COLLECTION LIST */}
      <div className="space-y-4 sm:space-y-6">
        {LEADER_NEWS_ARTICLES.map((article, idx) => (
          <article
            key={article.id}
            className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200 hover:border-emerald-700 hover:shadow-lg transition-all overflow-hidden p-4 sm:p-7 space-y-3.5 sm:space-y-4"
          >
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-500">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-950 text-amber-300 font-extrabold uppercase px-2 py-0.5 rounded-full text-[9px] border border-amber-400/30">
                  {article.category}
                </span>
                <span className="bg-stone-100 text-slate-700 font-bold uppercase px-2 py-0.5 rounded text-[9px] border border-stone-200">
                  {article.sessionEra}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  {article.readTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {article.publishedDate}
                </span>
              </div>
            </div>

            {/* Headline & Subheadline */}
            <div className="space-y-1">
              <Link href={`/history/leader-stories/${article.slug}`}>
                <h2 className="font-serif text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-emerald-900 transition-colors leading-snug">
                  {article.headline}
                </h2>
              </Link>
              <p className="text-xs sm:text-sm text-amber-800 font-medium italic line-clamp-1">
                {article.subheadline}
              </p>
            </div>

            {/* Excerpt Lead */}
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>

            {/* Key Quote Snippet */}
            <div className="bg-stone-50 p-3 sm:p-4 rounded-xl border border-stone-200/80 flex items-start gap-2.5">
              <Quote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="font-serif italic text-xs sm:text-sm text-slate-700 line-clamp-1">
                &ldquo;{article.keyAdviceQuote}&rdquo;
              </p>
            </div>

            {/* Bottom Bar: Author Profile & Read Article CTA */}
            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-emerald-900 shrink-0 bg-stone-100">
                  <Image
                    src={article.imageUrl}
                    alt={article.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-xs leading-tight">
                  <span className="font-bold text-slate-900 block">{article.author}</span>
                  <span className="text-[10px] text-emerald-800 font-medium">{article.officeTitle}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden sm:inline-block text-[10px] font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                  Official Presidential Archive
                </span>

                <Link
                  href={`/history/leader-stories/${article.slug}`}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-300 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 group-hover:bg-amber-400 group-hover:text-slate-950"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Chapter Pagination Navigation - Side by Side on Mobile & Desktop */}
      <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-2 sm:gap-4">
        <Link
          href="/history/past-leadership"
          className="w-full px-2 sm:px-5 py-2.5 sm:py-3 bg-stone-100 hover:bg-stone-200 text-slate-800 text-[10px] sm:text-xs font-bold rounded-xl sm:rounded-2xl transition-all border border-stone-300 flex items-center justify-center gap-1 sm:gap-2 text-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="truncate">Prev: 2. Past Administrations</span>
        </Link>

        <Link
          href="/history/timeline"
          className="w-full px-2 sm:px-5 py-2.5 sm:py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-[10px] sm:text-xs font-extrabold rounded-xl sm:rounded-2xl transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 text-center"
        >
          <span className="truncate">Next: 4. Chronological Timeline</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
