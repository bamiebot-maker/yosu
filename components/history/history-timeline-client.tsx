'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, ChevronDown, Clock, Calendar, Crown, Users, ArrowRight, ArrowLeft, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { SerializedSession } from './history-archive-client';

interface HistoryTimelineClientProps {
  sessions: SerializedSession[];
}

export function HistoryTimelineClient({ sessions }: HistoryTimelineClientProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const activeAdministration = sessions.find((s) => s.isCurrent);
  const archivedAdministrations = sessions.filter((s) => !s.isCurrent);

  const toggleExpand = (id: string) => {
    setExpandedSessionId((prev) => (prev === id ? null : id));
  };

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
          Click any administration tenure below to expand its principal officers, accomplishments, and governance achievements.
        </p>
      </div>

      {/* CHRONOLOGICAL TIMELINE CONTAINER */}
      <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-8 font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              INTERACTIVE CHRONOLOGICAL DIRECTORY
            </span>
            <h2 className="text-2xl font-serif font-bold text-white">
              Administration Tenures Directory
            </h2>
          </div>
          <span className="text-xs text-amber-300 font-semibold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Click any card to inspect details & achievements
          </span>
        </div>

        <div className="space-y-6">
          {/* Active Administration Highlight Card */}
          {activeAdministration && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  ACTIVE CURRENT ADMINISTRATION
                </h3>
              </div>

              <div
                onClick={() => toggleExpand(activeAdministration.id)}
                className="cursor-pointer bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-400/80 shadow-md space-y-4 hover:border-amber-300 transition-all"
              >
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

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/history/past-leadership#session-${activeAdministration.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1"
                    >
                      <span>View Full Roster</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform ${expandedSessionId === activeAdministration.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Accordion View */}
                {expandedSessionId === activeAdministration.id && (
                  <div className="pt-4 border-t border-slate-800/90 space-y-4 animate-in fade-in duration-200">
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {activeAdministration.historicalSummary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="text-[9px] font-bold text-amber-400 uppercase block">President</span>
                        <span className="text-xs font-bold text-white">{activeAdministration.president?.fullName || 'Cmrd. Ibrahim Sobur Bamidele'}</span>
                      </div>
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="text-[9px] font-bold text-emerald-400 uppercase block">Vice President</span>
                        <span className="text-xs font-bold text-white">{activeAdministration.vicePresident?.fullName || 'Comrd. Adewale Rasheed'}</span>
                      </div>
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                        <span className="text-[9px] font-bold text-blue-400 uppercase block">Secretary General</span>
                        <span className="text-xs font-bold text-white">{activeAdministration.secretaryGeneral?.fullName || 'Comrd. Folake Ogunleye'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Archived Administrations Accordion List */}
          {archivedAdministrations.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                ARCHIVED HISTORICAL TENURES ({archivedAdministrations.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {archivedAdministrations.map((session) => {
                  const isExpanded = expandedSessionId === session.id;
                  return (
                    <div
                      key={session.id}
                      onClick={() => toggleExpand(session.id)}
                      className={`cursor-pointer bg-slate-900 p-5 rounded-2xl border transition-all space-y-3 hover:border-amber-400/60 ${
                        isExpanded ? 'border-amber-400 shadow-lg bg-slate-900/90' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">{session.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">{session.startDate} {session.endDate ? `to ${session.endDate}` : ''}</span>
                          <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      <h4 className="font-serif font-bold text-base text-white leading-snug">{session.theme || 'Historical Administration'}</h4>
                      <p className="text-xs text-slate-400 font-light">
                        President: <strong className="text-slate-200">{session.president?.fullName || 'Office Holder On Record'}</strong>
                      </p>

                      {/* Clickable Expanded Accordion Content */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-800 space-y-3 text-xs text-slate-300 animate-in fade-in duration-200">
                          <p className="font-light leading-relaxed">{session.historicalSummary}</p>

                          <div className="pt-2 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                              Ratified Tenure Record
                            </span>

                            <Link
                              href={`/history/past-leadership#session-${session.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] font-extrabold text-amber-300 hover:text-amber-200 flex items-center gap-1"
                            >
                              <span>View Gazette & Roster</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dual Bottom Navigation Links */}
      <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/history/leader-stories"
          className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-2xl transition-all border border-stone-300 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-amber-700" />
          <span>Previous: 3. Voices & Stories from Past Leaders</span>
        </Link>

        <Link
          href="/history/heritage-archive"
          className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>Next Page: 5. Heritage Gallery & Documents</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>
    </div>
  );
}
