'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  Clock,
  Calendar,
  Crown,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface TimelineSession {
  id: string;
  title: string;
  slug: string;
  theme?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  historicalSummary?: string;
  president?: {
    id: string;
    fullName: string;
    stateOfOrigin: string;
    avatarUrl?: string | null;
    officeTitle?: string;
  } | null;
  displayOrder?: number;
}

interface HistoryTimelineClientProps {
  sessions: TimelineSession[];
}

// Default foundation timeline sets if DB has few entries
const DEFAULT_TIMELINE_SETS: TimelineSession[] = [
  {
    id: 't-1',
    title: '2013/2015 Foundation Era',
    slug: '2013-2015',
    theme: 'The Pioneer Genesis & Mobilization Era',
    startDate: '2013',
    endDate: '2015',
    isCurrent: false,
    displayOrder: 1,
    president: {
      id: 'p-1',
      fullName: 'Cmrd. Adebayo Lagbaja',
      stateOfOrigin: 'Oyo',
      officeTitle: 'First Tenure',
    },
  },
  {
    id: 't-2',
    title: '2015/2017 Institutional Era',
    slug: '2015-2017',
    theme: 'Constitutional Structuring & Equal State Delegations',
    startDate: '2015',
    endDate: '2017',
    isCurrent: false,
    displayOrder: 2,
    president: {
      id: 'p-2',
      fullName: 'Cmrd. Babatunde Tamedo',
      stateOfOrigin: 'Kwara',
      officeTitle: 'Second Set',
    },
  },
  {
    id: 't-3',
    title: '2017/2019 Expansion Era',
    slug: '2017-2019',
    theme: 'Community Welfare & External Cultural Patronage',
    startDate: '2017',
    endDate: '2019',
    isCurrent: false,
    displayOrder: 3,
    president: {
      id: 'p-3',
      fullName: 'Cmrd. Olanrewaju Ade',
      stateOfOrigin: 'Ondo',
      officeTitle: '3rd Set',
    },
  },
  {
    id: 't-4',
    title: '2026/2027 Progress Era',
    slug: '2026-2027',
    theme: 'The Digital Progress & Sovereign Unification Era',
    startDate: '2026',
    endDate: '2027',
    isCurrent: true,
    displayOrder: 12,
    president: {
      id: 'p-12',
      fullName: 'Cmrd. Ibrahim Sobur Bamidele',
      stateOfOrigin: 'Ekiti',
      officeTitle: 'Current Set • 12th Administration',
    },
  },
];

export function HistoryTimelineClient({ sessions: rawSessions }: HistoryTimelineClientProps) {
  // Merge and sort in chronological order (earliest first, current last)
  const allSessions = rawSessions && rawSessions.length > 0 ? [...rawSessions] : [...DEFAULT_TIMELINE_SETS];

  // If DB only has 2 sessions, prepend the foundation sets so the tree is complete
  if (allSessions.length <= 2) {
    DEFAULT_TIMELINE_SETS.forEach((def) => {
      if (!allSessions.some((s) => s.slug === def.slug || s.title === def.title)) {
        allSessions.push(def);
      }
    });
  }

  // Sort chronologically ascending
  allSessions.sort((a, b) => {
    const orderA = a.displayOrder ?? (parseInt(a.startDate) || 0);
    const orderB = b.displayOrder ?? (parseInt(b.startDate) || 0);
    return orderA - orderB;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-sans">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/history" className="hover:text-emerald-700 transition-colors">
          <span>History Archive</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">4. Chronological Timeline</span>
      </nav>

      {/* BROADSHEET HEADER */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <span className="bg-emerald-950 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          HISTORICAL SUBPAGE 4 OF 5 • GENEALOGY TREE
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
          Chronological Administration Tree
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
          The graphical genealogy of YOSU FUD leadership, growing from the pioneer foundation set at the bottom up to the active administration at the top.
        </p>
      </div>

      {/* GRAPHICAL TREE CONTAINER (BOTTOM TO TOP ORDER AS IN USER SKETCH) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 text-xs">
          <span className="text-amber-800 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            GROWING FROM FOUNDATION (BOTTOM) TO CURRENT (TOP)
          </span>
          <span className="text-slate-500 font-mono text-[11px]">{allSessions.length} Tenures Recorded</span>
        </div>

        {/* Tree Layout: Reverse display so earliest is at the bottom, current is at the top */}
        <div className="relative pl-6 sm:pl-10 py-6">
          {/* Vertical Trunk Line */}
          <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-1.5 bg-gradient-to-t from-stone-400 via-emerald-700 to-amber-500 rounded-full" />

          {/* Sessions arranged in flex-col-reverse (Bottom to Top) */}
          <div className="flex flex-col-reverse space-y-reverse space-y-8 relative">
            {allSessions.map((session, index) => {
              const isCurrent = session.isCurrent || index === allSessions.length - 1;
              const setNumber = session.displayOrder || index + 1;
              const setLabel =
                index === 0
                  ? 'First Tenure'
                  : index === 1
                  ? 'Second Set'
                  : index === 2
                  ? '3rd Set'
                  : isCurrent
                  ? 'Current Set'
                  : `${setNumber}th Set`;

              return (
                <div key={session.id} className="relative flex items-center gap-4 sm:gap-6 group">
                  {/* Branch Node Point on Trunk */}
                  <div
                    className={`w-6 h-6 rounded-full border-4 shrink-0 -ml-[11px] z-10 transition-transform group-hover:scale-125 ${
                      isCurrent
                        ? 'bg-amber-400 border-emerald-950 shadow-lg'
                        : 'bg-emerald-900 border-white shadow'
                    }`}
                  />

                  {/* Horizontal Branch Arm extending to the Right */}
                  <div className="w-4 sm:w-10 h-0.5 bg-stone-300 shrink-0 group-hover:bg-amber-500 transition-colors" />

                  {/* Branch Card */}
                  <Link
                    href="/history/past-leadership"
                    className={`flex-1 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all shadow-sm hover:shadow-md ${
                      isCurrent
                        ? 'bg-slate-950 text-white border-amber-400 ring-2 ring-amber-400/20'
                        : 'bg-stone-50 hover:bg-stone-100/90 text-slate-900 border-stone-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 border-b border-stone-200/40 pb-2">
                      <span
                        className={`font-mono text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                          isCurrent
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-emerald-950 text-amber-300'
                        }`}
                      >
                        {session.president?.fullName?.split(' ')[0] || 'Set'} ({setLabel})
                      </span>

                      <span className="text-[11px] font-bold flex items-center gap-1 font-mono text-slate-400">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        {session.startDate} – {session.endDate || 'Present'}
                      </span>
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <h2 className="font-serif text-base sm:text-lg font-extrabold flex items-center gap-2">
                        <span>{session.president?.fullName || session.title}</span>
                        {isCurrent && (
                          <span className="bg-amber-500/20 text-amber-300 text-[9px] px-2 py-0.5 rounded border border-amber-400/40">
                            Active Administration
                          </span>
                        )}
                      </h2>
                      <p className={`text-xs line-clamp-1 ${isCurrent ? 'text-slate-300' : 'text-slate-600'}`}>
                        {session.theme || 'Administration Session & Governance'}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dual Bottom Navigation Links - Side by Side on Mobile & Desktop */}
      <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-2 sm:gap-4">
        <Link
          href="/history/leader-stories"
          className="w-full px-2 sm:px-5 py-2.5 sm:py-3 bg-stone-100 hover:bg-stone-200 text-slate-800 text-[10px] sm:text-xs font-bold rounded-xl sm:rounded-2xl transition-all border border-stone-300 flex items-center justify-center gap-1 sm:gap-2 text-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="truncate">Prev: 3. Voices from Leaders</span>
        </Link>

        <Link
          href="/history/heritage-archive"
          className="w-full px-2 sm:px-5 py-2.5 sm:py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-[10px] sm:text-xs font-extrabold rounded-xl sm:rounded-2xl transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 text-center"
        >
          <span className="truncate">Next: 5. Heritage Gallery</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
