'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, History, Calendar, Users, Building2, Crown, UserCheck, Shield, Clock, ArrowRight } from 'lucide-react';
import { SerializedSession } from './history-archive-client';

interface HistoryPastLeadershipClientProps {
  sessions: SerializedSession[];
}

export function HistoryPastLeadershipClient({ sessions }: HistoryPastLeadershipClientProps) {
  const [selectedJumpId, setSelectedJumpId] = useState('');

  const handleJump = (sessionId: string) => {
    setSelectedJumpId(sessionId);
    if (!sessionId) return;
    const elem = document.getElementById(`session-${sessionId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        <span className="font-semibold text-slate-900">2. Past Administrations & Roster</span>
      </nav>

      {/* EDITORIAL HEADER (NO DARK HERO BANNER, NO METRICS GRID) */}
      <div className="border-b border-stone-200 pb-6 space-y-4">
        <div className="space-y-2">
          <span className="bg-emerald-950 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-amber-400" />
            HISTORICAL SUBPAGE 2 OF 5
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Past Administrations & Sworn Roster
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
            Session-by-session historical gazette of all recorded YOSU Executive Cabinets and Legislative Assemblies at Federal University Dutse.
          </p>
        </div>

        {/* JUMP TO YEAR / SESSION DROPDOWN */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-700" />
            <label htmlFor="jump-session-select" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Jump to Session / Academic Year:
            </label>
          </div>

          <select
            id="jump-session-select"
            value={selectedJumpId}
            onChange={(e) => handleJump(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 shadow-2xs cursor-pointer"
          >
            <option value="">-- Select Session or President --</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.president?.fullName ? `Pres. ${s.president.fullName}` : s.startDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SESSIONS GAZETTE LIST */}
      <div className="space-y-12">
        {sessions.map((session) => (
          <div
            key={session.id}
            id={`session-${session.id}`}
            className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6 scroll-mt-24"
          >
            {/* Session Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-950 text-amber-300 font-extrabold text-xs px-3 py-0.5 rounded-full uppercase">
                    {session.title}
                  </span>
                  {session.isCurrent && (
                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase border border-emerald-200">
                      Active Tenure
                    </span>
                  )}
                </div>
                <h2 className="font-serif font-bold text-2xl text-slate-900 mt-2">
                  Theme: {session.theme || 'Official Administration Tenure'}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Tenure: {session.startDate} {session.endDate ? `to ${session.endDate}` : 'to Present'}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 font-light leading-relaxed">
              {session.historicalSummary}
            </p>

            {/* Principal Officers */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                PRINCIPAL OFFICERS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* President */}
                <div className="bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border border-amber-400 bg-slate-800 shrink-0">
                    {session.president?.avatarUrl ? (
                      <Image src={session.president.avatarUrl} alt={session.president.fullName} fill className="object-cover" />
                    ) : (
                      <Crown className="w-6 h-6 text-amber-400 m-auto mt-2.5" />
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-400 uppercase block">{session.president?.officeTitle || 'Executive President'}</span>
                    <h4 className="font-serif font-bold text-sm text-white">{session.president?.fullName || 'Holder On Record'}</h4>
                  </div>
                </div>

                {/* VP */}
                <div className="bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border border-emerald-400 bg-slate-800 shrink-0">
                    {session.vicePresident?.avatarUrl ? (
                      <Image src={session.vicePresident.avatarUrl} alt={session.vicePresident.fullName} fill className="object-cover" />
                    ) : (
                      <UserCheck className="w-6 h-6 text-emerald-400 m-auto mt-2.5" />
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase block">{session.vicePresident?.officeTitle || 'Vice President'}</span>
                    <h4 className="font-serif font-bold text-sm text-white">{session.vicePresident?.fullName || 'Holder On Record'}</h4>
                  </div>
                </div>

                {/* SecGen */}
                <div className="bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border border-blue-400 bg-slate-800 shrink-0">
                    {session.secretaryGeneral?.avatarUrl ? (
                      <Image src={session.secretaryGeneral.avatarUrl} alt={session.secretaryGeneral.fullName} fill className="object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-blue-400 m-auto mt-2.5" />
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-blue-400 uppercase block">{session.secretaryGeneral?.officeTitle || 'Secretary General'}</span>
                    <h4 className="font-serif font-bold text-sm text-white">{session.secretaryGeneral?.fullName || 'Holder On Record'}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Page Link */}
      <div className="pt-6 border-t border-stone-200 flex justify-end">
        <Link
          href="/history/leader-stories"
          className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold rounded-2xl transition-all shadow-md flex items-center gap-2"
        >
          <span>Next Page: 3. Voices & Stories from Past Leaders</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>
    </div>
  );
}
