'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, Clock, Calendar, Crown, Users, ArrowRight } from 'lucide-react';
import { SerializedSession } from './history-archive-client';

interface HistoryTimelineClientProps {
  sessions: SerializedSession[];
}

export function HistoryTimelineClient({ sessions }: HistoryTimelineClientProps) {
  const activeAdministration = sessions.find((s) => s.isCurrent);
  const archivedAdministrations = sessions.filter((s) => !s.isCurrent);

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
        <span className="font-semibold text-slate-900">4. Chronological Timeline</span>
      </nav>

      {/* EDITORIAL HEADER (NO DARK HERO BANNER) */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <span className="bg-emerald-950 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          HISTORICAL SUBPAGE 4 OF 5
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
          Chronological Tenure Directory & Timeline
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
          Interactive chronological timeline tracking all recorded administration tenures at Federal University Dutse.
        </p>
      </div>

      {/* CHRONOLOGICAL TIMELINE */}
      <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-8 font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              CHRONOLOGICAL DIRECTORY
            </span>
            <h2 className="text-2xl font-serif font-bold text-white">
              Administration Tenures Directory
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-light">
            Select any tenure to inspect its details
          </span>
        </div>

        <div className="space-y-6">
          {/* Active Administration Highlight */}
          {activeAdministration && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  ACTIVE CURRENT ADMINISTRATION
                </h3>
              </div>

              <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-400/80 shadow-md">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-amber-400 bg-slate-800 shrink-0">
                      {activeAdministration.president?.avatarUrl ? (
                        <Image src={activeAdministration.president.avatarUrl} alt={activeAdministration.president.fullName} fill className="object-cover" />
                      ) : (
                        <Crown className="w-6 h-6 text-amber-400 m-auto mt-3" />
                      )}
                    </div>
                    <div>
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">CURRENT TENURE</span>
                      <h4 className="font-serif font-bold text-lg text-white mt-1">{activeAdministration.title} — {activeAdministration.theme || 'Progress Era'}</h4>
                      <p className="text-xs text-slate-300 font-light">President: <strong className="text-white">{activeAdministration.president?.fullName || 'Cmrd. Ibrahim Sobur Bamidele'}</strong></p>
                    </div>
                  </div>

                  <Link
                    href={`/history/past-leadership#session-${activeAdministration.id}`}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    View Gazette & Roster
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Archived Administrations */}
          {archivedAdministrations.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                ARCHIVED HISTORICAL TENURES ({archivedAdministrations.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {archivedAdministrations.map((session) => (
                  <div key={session.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">{session.title}</span>
                      <span className="text-[10px] text-slate-400">{session.startDate} {session.endDate ? `to ${session.endDate}` : ''}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-white">{session.theme || 'Historical Administration'}</h4>
                    <p className="text-xs text-slate-400 font-light">President: <strong className="text-slate-200">{session.president?.fullName || 'Office Holder On Record'}</strong></p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Page Link */}
      <div className="pt-6 border-t border-stone-200 flex justify-end">
        <Link
          href="/history/heritage-archive"
          className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold rounded-2xl transition-all shadow-md flex items-center gap-2"
        >
          <span>Next Page: 5. Heritage Gallery & Documents</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>
    </div>
  );
}
