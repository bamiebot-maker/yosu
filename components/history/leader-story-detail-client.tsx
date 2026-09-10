'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  ChevronRight,
  Sparkles,
  Calendar,
  Clock,
  Quote,
  Copy,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FolderOpen,
} from 'lucide-react';
import { LeaderArticle, LEADER_NEWS_ARTICLES } from '@/lib/history-leader-stories-data';
import { LeaderStoryInteraction } from './leader-story-interaction';

interface LeaderStoryDetailClientProps {
  article: LeaderArticle;
}

export function LeaderStoryDetailClient({ article }: LeaderStoryDetailClientProps) {
  const [copiedQuote, setCopiedQuote] = useState(false);

  const handleCopyQuote = (quote: string, author: string) => {
    navigator.clipboard.writeText(`"${quote}" — ${author}, YOSU FUD Historical Gazette.`);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 3000);
  };

  const otherArticles = LEADER_NEWS_ARTICLES.filter((a) => a.id !== article.id);

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-sans">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/history" className="hover:text-emerald-700 transition-colors">
          <span>History Archive</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/history/leader-stories" className="hover:text-emerald-700 transition-colors">
          <span>3. Voices from Past Leaders</span>
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate max-w-[160px] sm:max-w-[260px]">
          {article.headline}
        </span>
      </nav>

      {/* ARTICLE WRAPPER */}
      <article className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm overflow-hidden p-4 sm:p-8 lg:p-10 space-y-6">
        {/* Header Tags & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-emerald-950 text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-400/40">
              {article.category}
            </span>
            <span className="bg-stone-100 text-slate-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-stone-200">
              {article.sessionEra}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {article.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {article.publishedDate}
            </span>
          </div>
        </div>

        {/* Headline & Subheadline */}
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3.5xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
            {article.headline}
          </h1>
          <p className="text-xs sm:text-sm text-amber-800 font-semibold italic leading-relaxed">
            {article.subheadline}
          </p>
        </div>

        {/* Author Byline & Portrait Bar */}
        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border-2 border-emerald-900 shrink-0 bg-stone-200 shadow-sm">
            <Image
              src={article.imageUrl}
              alt={article.author}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900 text-sm">{article.author}</div>
            <div className="text-[11px] text-emerald-800 font-semibold">{article.officeTitle}</div>
            <div className="text-[10px] text-slate-400">{article.sessionEra}</div>
          </div>
        </div>

        {/* Full News Story Body */}
        <div className="prose prose-slate max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 font-light pt-2">
          <p className="font-medium text-slate-900 text-sm sm:text-base border-l-4 border-emerald-800 pl-4 py-1 bg-stone-50/50 rounded-r-lg">
            {article.leadParagraph}
          </p>
          {article.bodyParagraphs.map((para, pIdx) => (
            <p key={pIdx} className="leading-relaxed">{para}</p>
          ))}
        </div>

        {/* Pull Quote Card */}
        <div className="bg-slate-950 text-white p-5 sm:p-7 rounded-2xl border border-emerald-900 space-y-3 shadow-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-300 font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-amber-400" />
              KEY WORDS OF WISDOM
            </span>
            <button
              onClick={() => handleCopyQuote(article.keyAdviceQuote, article.author)}
              className="text-amber-300 hover:text-white font-bold text-[11px] flex items-center gap-1 px-2.5 py-1 bg-stone-900 hover:bg-stone-800 rounded-lg border border-stone-700 transition-colors cursor-pointer"
            >
              {copiedQuote ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Quote</span>
                </>
              )}
            </button>
          </div>
          <p className="font-serif text-base sm:text-lg italic text-amber-100 leading-relaxed">
            &ldquo;{article.keyAdviceQuote}&rdquo;
          </p>
          <div className="text-[11px] text-slate-400 font-medium text-right">
            — {article.author}, {article.officeTitle}
          </div>
        </div>

        {/* Direct Advice to Students Box */}
        <div className="bg-emerald-50/70 p-4 sm:p-6 rounded-2xl border border-emerald-200 space-y-2.5 text-xs">
          <h2 className="font-serif font-bold text-emerald-950 text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Presidential Advice on Moral &amp; Academic Conduct:</span>
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700 font-light pl-1">
            {article.adviceForCurrentStudents.map((adv, aIdx) => (
              <li key={aIdx} className="leading-snug">{adv}</li>
            ))}
          </ul>
        </div>

        {/* Likeable & Shareable Component Exactly Like Newsroom */}
        <LeaderStoryInteraction
          storyId={article.id}
          title={article.headline}
          summary={article.excerpt}
          initialLikeCount={article.initialLikes}
          initialShareCount={article.initialShares}
        />
      </article>

      {/* Back and Next Navigation - Side by Side on Mobile & Desktop */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2">
        <Link
          href="/history/leader-stories"
          className="w-full px-2 sm:px-4 py-2.5 bg-white hover:bg-stone-100 text-slate-700 text-[10px] sm:text-xs font-bold rounded-xl transition-all border border-stone-300 flex items-center justify-center gap-1.5 shadow-sm text-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <span className="truncate">Back to Collection</span>
        </Link>

        <Link
          href="/history/timeline"
          className="w-full px-2 sm:px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 text-[10px] sm:text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 text-center"
        >
          <span className="truncate">Next: 4. Timeline</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </Link>
      </div>

      {/* MORE STORIES IN THE COLLECTION */}
      {otherArticles.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-stone-200">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            More Memoirs &amp; Stories from Past Leaders
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {otherArticles.map((other) => (
              <Link
                key={other.id}
                href={`/history/leader-stories/${other.slug}`}
                className="group block p-4 bg-white rounded-2xl border border-stone-200 hover:border-emerald-700 hover:shadow-md transition-all space-y-2"
              >
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    {other.category}
                  </span>
                  <span className="text-slate-400">• {other.readTime}</span>
                </div>
                <h3 className="font-serif text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug">
                  {other.headline}
                </h3>
                <div className="text-[11px] text-slate-500 font-medium">
                  By {other.author} ({other.officeTitle})
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
