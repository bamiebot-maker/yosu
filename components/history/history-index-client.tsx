'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  History,
  Sparkles,
  Clock,
  FolderOpen,
  ChevronRight,
  ArrowRight,
  Home,
  Compass,
  FileText,
} from 'lucide-react';

const CHAPTERS = [
  {
    number: '1',
    title: 'Origin & Founding Genesis',
    subtitle: 'What Brought About YOSU at FUD',
    description: 'The pioneer origins, the Omoluabi mandate in Northern Nigeria, and the unification of students across all 8 Yoruba constituent states.',
    href: '/history/origin',
    icon: BookOpen,
    badge: 'Foundational History',
  },
  {
    number: '2',
    title: 'Past Administrations & Roster',
    subtitle: 'Era Directory & Cabinet Records',
    description: 'Chronological chapters of past presidential administrations featuring presidential profiles, tenures, key achievements, and executive cabinets.',
    href: '/history/past-leadership',
    icon: History,
    badge: 'Tenure Gazette',
  },
  {
    number: '3',
    title: 'Voices from Past Leaders',
    subtitle: 'Gazette News & Presidential Memoirs',
    description: 'In-depth feature interviews, advice on academic and moral conduct, and historical memoirs transcribed from past presidents.',
    href: '/history/leader-stories',
    icon: Sparkles,
    badge: 'News & Memoirs',
  },
  {
    number: '4',
    title: 'Chronological Timeline Tree',
    subtitle: 'Graphical Genealogy (Bottom to Top)',
    description: 'An interactive graphical genealogy tree tracking every administration from the pioneer foundation set up to the current active administration.',
    href: '/history/timeline',
    icon: Clock,
    badge: 'Visual Tree',
  },
  {
    number: '5',
    title: 'Heritage Gallery & Documents',
    subtitle: 'Archival Albums & Official Charters',
    description: 'Historic photo collections, archival celebration albums, downloadable gazettes, and official unification constitutions.',
    href: '/history/heritage-archive',
    icon: FolderOpen,
    badge: 'Archival Library',
  },
];

export function HistoryIndexClient() {
  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-5 sm:space-y-8 font-sans">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Historical Archive</span>
      </nav>

      {/* MINIMALIST EDITORIAL HEADER */}
      <div className="border-b border-stone-200 pb-4 sm:pb-6 space-y-2">
        <span className="bg-emerald-950 text-amber-300 font-extrabold text-[9px] sm:text-[10px] uppercase px-2.5 py-0.5 sm:py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
          <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
          HISTORICAL DIRECTORY & TABLE OF CONTENTS
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          YOSU Historical Archive & Gazettes
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm font-light max-w-2xl leading-relaxed">
          Federal University Dutse Chapter. Select any chapter below to explore official records, leadership legacies, and cultural heritage.
        </p>
      </div>

      {/* 5 COMPACT CHAPTER LIST - MOBILE FIRST */}
      <div className="space-y-2.5 sm:space-y-3.5">
        {CHAPTERS.map((ch) => {
          const Icon = ch.icon;
          return (
            <Link
              key={ch.number}
              href={ch.href}
              className="group block bg-white rounded-xl sm:rounded-2xl border border-stone-200 hover:border-emerald-700 hover:shadow-md transition-all p-3 sm:p-5 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  {/* Compact Number Badge */}
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-950 text-amber-300 font-serif font-black text-sm sm:text-base flex items-center justify-center shrink-0 border border-emerald-900/60 shadow-sm group-hover:scale-105 transition-transform">
                    {ch.number}
                  </div>

                  {/* Title & Description */}
                  <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[8px] sm:text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200/80 shrink-0">
                        {ch.badge}
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:inline">
                        • {ch.subtitle}
                      </span>
                    </div>

                    <h2 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors leading-snug truncate">
                      {ch.title}
                    </h2>

                    <p className="text-[11px] sm:text-xs text-slate-500 font-light line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                      {ch.description}
                    </p>
                  </div>
                </div>

                {/* Right Action Button/Arrow */}
                <div className="shrink-0 flex items-center gap-1.5 pl-1 text-slate-400 group-hover:text-emerald-900 transition-colors">
                  <span className="hidden md:inline text-xs font-bold text-emerald-800 group-hover:text-emerald-950">
                    Open
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 group-hover:bg-amber-400 group-hover:text-slate-950 flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
