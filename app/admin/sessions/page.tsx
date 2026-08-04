import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Calendar, ShieldCheck, Sparkles, Plus, Award, CheckCircle2, History } from 'lucide-react';

export const revalidate = 0; // Dynamic server page

export default async function AdminSessionsPage() {
  const sessions = await db.administrationSession.findMany({
    include: {
      appointments: {
        include: {
          person: true,
          office: true,
        },
      },
      achievements: {
        orderBy: { displayOrder: 'asc' },
      },
      _count: {
        select: {
          appointments: true,
          albums: true,
          projects: true,
        },
      },
    },
    orderBy: { startDate: 'desc' },
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            ADMINISTRATION MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Sessions & Administrations Manager
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage multi-session leadership archives, create future academic sessions, and toggle active platform administration.
          </p>
        </div>

        <button className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>New Session</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="space-y-6">
        {sessions.map((sess) => {
          const presidentAppt = sess.appointments.find(
            (a) => a.office.title.toLowerCase().includes('president') && !a.office.title.toLowerCase().includes('vice')
          );
          const vpAppt = sess.appointments.find((a) => a.office.title.toLowerCase().includes('vice president'));

          return (
            <div
              key={sess.id}
              className={`bg-white rounded-3xl border ${
                sess.isCurrent ? 'border-2 border-amber-400 shadow-xl' : 'border-stone-200 shadow-sm'
              } overflow-hidden space-y-4 p-6 sm:p-8`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">{sess.title}</h2>
                    {sess.isCurrent ? (
                      <span className="bg-emerald-950 text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        ACTIVE PLATFORM SESSION
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border border-stone-200">
                        HISTORICAL ARCHIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-emerald-900">
                    Theme: {sess.theme || 'Standard Academic Administration'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!sess.isCurrent && (
                    <button className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-xl transition-colors border border-emerald-300">
                      Set as Active
                    </button>
                  )}
                  <button className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-xl transition-colors border border-stone-200">
                    Edit Session
                  </button>
                </div>
              </div>

              {/* Officers Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                    President
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {presidentAppt?.person.fullName || 'Not Appointed'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {presidentAppt?.person.department || 'Public Administration'}
                  </span>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                    Vice President
                  </span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {vpAppt?.person.fullName || 'Not Appointed'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {vpAppt?.person.department || 'Microbiology'}
                  </span>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                    Session Stats
                  </span>
                  <div className="flex flex-wrap gap-2 text-slate-700 pt-0.5">
                    <span className="font-bold text-emerald-900">{sess._count.appointments} Officers</span> •{' '}
                    <span>{sess._count.albums} Albums</span> • <span>{sess._count.projects} Projects</span>
                  </div>
                </div>
              </div>

              {/* Session Achievements */}
              {sess.achievements.length > 0 && (
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Achievements ({sess.achievements.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {sess.achievements.map((ach) => (
                      <div key={ach.id} className="bg-amber-50/60 p-3 rounded-lg border border-amber-200 space-y-0.5">
                        <span className="text-[9px] font-bold text-amber-800 uppercase block">{ach.category || 'MILESTONE'}</span>
                        <h4 className="font-bold text-xs text-slate-900">{ach.title}</h4>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{ach.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
