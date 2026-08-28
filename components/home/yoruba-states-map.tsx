'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, ChevronRight } from 'lucide-react';

export interface YorubaStateData {
  name: string;
  motto: string;
  capital: string;
  code: string;
  colorClass: string;
  badgeBg: string;
}

const YORUBA_STATES: YorubaStateData[] = [
  { name: 'Ekiti', motto: 'Fountain of Knowledge', capital: 'Ado-Ekiti', code: 'EKT', colorClass: 'from-emerald-950 via-slate-900 to-emerald-950', badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' },
  { name: 'Lagos', motto: 'Centre of Excellence', capital: 'Ikeja', code: 'LOS', colorClass: 'from-amber-950 via-slate-900 to-amber-950', badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40' },
  { name: 'Ogun', motto: 'Gateway State', capital: 'Abeokuta', code: 'OGN', colorClass: 'from-emerald-950 via-slate-900 to-slate-950', badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' },
  { name: 'Ondo', motto: 'Sunshine State', capital: 'Akure', code: 'OND', colorClass: 'from-amber-950 via-slate-900 to-slate-950', badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40' },
  { name: 'Osun', motto: 'State of the Living Spring', capital: 'Osogbo', code: 'OSN', colorClass: 'from-emerald-900 via-slate-950 to-slate-900', badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' },
  { name: 'Oyo', motto: 'Pace Setter State', capital: 'Ibadan', code: 'OYO', colorClass: 'from-amber-900 via-slate-950 to-slate-900', badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40' },
  { name: 'Kwara', motto: 'State of Harmony', capital: 'Ilorin', code: 'KWR', colorClass: 'from-emerald-950 via-slate-900 to-emerald-900', badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' },
  { name: 'Kogi', motto: 'Okun Cultural Heritage', capital: 'Lokoja', code: 'KGI', colorClass: 'from-amber-950 via-slate-900 to-amber-900', badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40' },
];

export function YorubaStatesMap({
  excoCount,
  repCount,
  registeredStudentCount,
}: {
  excoCount: number;
  repCount: number;
  registeredStudentCount: number;
}) {
  return (
    <div className="space-y-6 font-sans">
      {/* Top Compact Telemetry Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center border border-amber-400/30 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-sm sm:text-base font-bold text-white leading-tight">
              Constituent Assembly &amp; Regional Telemetry
            </h4>
            <p className="text-[11px] text-slate-400">
              Uniting scholars across 8 sovereign Yoruba constituent delegations at FUD
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="bg-emerald-950 text-emerald-300 px-3 py-1 rounded-xl border border-emerald-800">
            🏛️ {repCount > 0 ? `${repCount} House Delegates` : '8 State Delegations'}
          </span>
          <span className="bg-amber-950 text-amber-300 px-3 py-1 rounded-xl border border-amber-800">
            👑 {excoCount} Executive Officers
          </span>
          <span className="bg-slate-900 text-stone-200 px-3 py-1 rounded-xl border border-slate-800">
            👥 {registeredStudentCount} Verified Members
          </span>
        </div>
      </div>

      {/* Interactive 8-State Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {YORUBA_STATES.map((state) => (
          <Link
            key={state.code}
            href={`/constituent-states?state=${encodeURIComponent(state.name)}`}
            className={`bg-gradient-to-br ${state.colorClass} border border-slate-800 hover:border-amber-400/60 p-4 rounded-2xl text-white space-y-3 shadow-md hover:-translate-y-1 transition-all group relative overflow-hidden block`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold text-amber-400 tracking-widest uppercase">
                STATE CODE: {state.code}
              </span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${state.badgeBg}`}>
                CONSTITUENT
              </span>
            </div>

            <div>
              <h4 className="font-serif text-base sm:text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1">
                <span>{state.name} State</span>
                <ChevronRight className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-[11px] text-amber-200/90 font-serif italic">
                &quot;{state.motto}&quot;
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-300 font-semibold">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" />
                Capital: {state.capital}
              </span>
              <span className="text-emerald-400 font-bold">Assembly Roster</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
