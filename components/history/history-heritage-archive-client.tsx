'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, FolderOpen, Image as ImageIcon, FileText, FolderKanban, ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';
import { HistoryStats } from './history-archive-client';

interface HistoryHeritageArchiveClientProps {
  stats: HistoryStats;
}

export function HistoryHeritageArchiveClient({ stats }: HistoryHeritageArchiveClientProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-sans">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/history/origin" className="hover:text-emerald-700 transition-colors">
          <span>History Archive</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">5. Heritage Gallery & Documents</span>
      </nav>

      {/* EDITORIAL HEADER (NO DARK HERO BANNER) */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <span className="bg-emerald-950 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
          <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
          HISTORICAL SUBPAGE 5 OF 5
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
          Heritage Gallery & Document Repository
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
          Inspect official photography archives, completed capital projects, and ratified constitutional versions.
        </p>
      </div>

      {/* ARCHIVE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Photo Gallery Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-xl text-slate-900">Historical Photo Albums</h2>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Official high-resolution photography archives documenting Cultural Days, Inaugural Balls, and Assembly Congresses ({stats.totalGalleries} Albums).
            </p>
          </div>
          <Link
            href="/gallery"
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Explore Photo Gallery</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Projects Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-xl text-slate-900">Completed Capital Projects</h2>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Record of infrastructure, bursary schemes, and student welfare capital projects completed across tenures ({stats.totalProjectsCompleted} Projects).
            </p>
          </div>
          <Link
            href="/projects"
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2"
          >
            <span>View Capital Projects</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Supreme Constitution Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-xl text-slate-900">Ratified Supreme Constitution</h2>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Read or download the official codified Supreme Constitution of the Yoruba Students&apos; Union, Federal University Dutse.
            </p>
          </div>
          <Link
            href="/constitution"
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2"
          >
            <span>Read Supreme Constitution</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Dual Bottom Navigation Links */}
      <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/history/timeline"
          className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-2xl transition-all border border-stone-300 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-amber-700" />
          <span>Previous: 4. Chronological Timeline</span>
        </Link>

        <Link
          href="/history/origin"
          className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>Next Page: 1. Origin & Genesis of YOSU</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>
    </div>
  );
}
