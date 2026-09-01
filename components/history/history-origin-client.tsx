'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, BookOpen, ShieldCheck, Building2, Download, ArrowRight } from 'lucide-react';

export function HistoryOriginClient() {
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
        <span className="font-semibold text-slate-900">1. Origin & Genesis</span>
      </nav>

      {/* CLEAN BROADSHEET EDITORIAL HEADER */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <span className="bg-emerald-950 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          HISTORICAL SUBPAGE 1 OF 5
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
          What Brought About YOSU • Origin & Founding Genesis
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
          The foundational history of the Yoruba Students&apos; Union (YOSU) at Federal University Dutse, Jigawa State. Birthed out of a collective mandate to foster unity, academic excellence, and cultural dignity in Northern Nigeria.
        </p>
      </div>

      {/* MAIN EDITORIAL CONTENT */}
      <div className="space-y-8">
        <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-900 space-y-4 shadow-md">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-300">The Omoluabi Mandate at FUD</h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-light">
            Established as a socio-cultural beacon for Yoruba students at the Federal University Dutse, the Yoruba Students&apos; Union (YOSU) was birthed out of a collective aspiration to preserve Yoruba heritage, foster academic excellence, promote unity among constituent state students, and provide robust welfare support in Northern Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" /> 4 Pillars of Omoluabi
            </h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 list-disc list-inside">
              <li><strong>Cultural Heritage:</strong> Preservation of Yoruba customs, language, and traditional royal court titles.</li>
              <li><strong>Academic Excellence:</strong> Peer mentorship, tutorial support, and academic welfare programs.</li>
              <li><strong>Unity & Solidarity:</strong> Fostering brotherhood among students across the 8 Yoruba states.</li>
              <li><strong>Omoluabi Integrity:</strong> High moral standards, leadership accountability, and civic responsibility.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-700" /> The 8 Constituent Delegations
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
              YOSU FUD unites students hailing from all Yoruba constituent states: <strong>Ekiti, Kwara, Oyo, Osun, Ondo, Ogun, Lagos, and Kogi (Okun Land)</strong>. Each state maintains honorable legislative representation in the YOSU House of Representatives.
            </p>
          </div>
        </div>

        {/* Next Subpage Link */}
        <div className="pt-6 border-t border-stone-200 flex justify-end">
          <Link
            href="/history/past-leadership"
            className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold rounded-2xl transition-all shadow-md flex items-center gap-2"
          >
            <span>Next Page: 2. Past Administrations & Roster</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
