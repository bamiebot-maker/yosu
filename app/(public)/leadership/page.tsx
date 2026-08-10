import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Shield, Users, Award, Building2, CheckCircle2, History, Sparkles, Clock, Mail, Phone, Globe } from 'lucide-react';

interface LeadershipPageProps {
  searchParams: Promise<{ session?: string }>;
}

export const revalidate = 60;

export default async function LeadershipPage({ searchParams }: LeadershipPageProps) {
  const { session: selectedSessionSlug } = await searchParams;

  // Query all administration sessions
  const sessions = await db.administrationSession.findMany({
    orderBy: { startDate: 'desc' },
  });

  // Find active administration session
  const activeSession = sessions.find((s) => s.isCurrent) || sessions[0];

  // Selected session: either matching query param or default active
  const currentSession = selectedSessionSlug
    ? sessions.find((s) => s.slug === selectedSessionSlug || s.id === selectedSessionSlug) || activeSession
    : activeSession;

  // 1. Query Executive Appointments for selected session
  const appointments = await db.officeAppointment.findMany({
    where: { sessionId: currentSession.id, status: 'ACTIVE' },
    include: {
      person: { include: { avatarMedia: true } },
      office: true,
    },
    orderBy: { displayOrder: 'asc' },
  });

  // 2. Query Dynamic House Representatives for selected session (TASK 2)
  const dbRepresentatives = await db.houseRepresentative.findMany({
    where: { sessionId: currentSession.id },
    orderBy: [{ stateOfOrigin: 'asc' }, { displayOrder: 'asc' }],
  });

  // 3. Query Dynamic Achievements for selected session (TASK 3)
  const dbAchievements = await db.achievement.findMany({
    where: { sessionId: currentSession.id },
    orderBy: [{ progressPercentage: 'desc' }, { createdAt: 'desc' }],
  });

  const excos = appointments.filter((a) => a.office.category === 'EXECUTIVE_COUNCIL');
  const houseOfficers = appointments.filter((a) => a.office.category === 'PRINCIPAL_OFFICER_HOUSE');

  // Group representatives by Yoruba constituent state dynamically (TASK 2)
  const stateRepresentativesMap = dbRepresentatives.reduce<Record<string, typeof dbRepresentatives>>((acc, rep) => {
    if (!acc[rep.stateOfOrigin]) acc[rep.stateOfOrigin] = [];
    acc[rep.stateOfOrigin].push(rep);
    return acc;
  }, {});

  const constituentStateList = Object.keys(stateRepresentativesMap);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 font-sans">
      {/* Streamlined Header & Session Selector (ATTACHMENT 4 - ULTRA COMPACT HEADER) */}
      <div className="space-y-4 font-sans border-b border-stone-200/80 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">
              OFFICIAL GOVERNANCE & ROSTER
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">
              Executive Council & Legislative Arms
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Currently viewing: <span className="font-bold text-emerald-950">{currentSession.title}</span> — {currentSession.theme || 'Administration'}. Governed under the ratified provisions of the Supreme Constitution.
            </p>
          </div>

          {/* Thin & Compact Session Selector Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 sm:pt-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Session:</span>
            {sessions.map((s) => {
              const isSelected = s.id === currentSession.id;
              return (
                <Link
                  key={s.id}
                  href={`/leadership?session=${s.slug}`}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-950 text-amber-300 shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-slate-700 border border-stone-200'
                  }`}
                >
                  <span>{s.title}</span>
                  {s.isCurrent && (
                    <span className="bg-emerald-800 text-emerald-100 text-[8px] px-1.5 py-0.2 rounded uppercase font-extrabold">
                      ACTIVE
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* COMPACT COLLAPSIBLE ACHIEVEMENTS INITIATIVE STRIP */}
      {dbAchievements.length > 0 && (
        <details className="group bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 sm:p-4 text-slate-900 space-y-3 font-sans transition-all">
          <summary className="flex justify-between items-center cursor-pointer list-none select-none font-bold text-xs sm:text-sm text-emerald-950">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Key Initiatives & Achievements ({currentSession.title})</span>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
              {dbAchievements.length} Initiatives • Details ▾
            </span>
          </summary>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-amber-200/60">
            {dbAchievements.map((ach) => {
              const isCompleted = ach.progressPercentage >= 100;
              return (
                <div key={ach.id} className="bg-white p-3 rounded-lg border border-amber-200/60 space-y-1.5 shadow-2xs">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-900 font-serif font-bold truncate max-w-[180px]">{ach.title}</span>
                    <span className={isCompleted ? 'text-emerald-700' : 'text-amber-700'}>
                      {isCompleted ? 'Completed' : `${ach.progressPercentage}%`}
                    </span>
                  </div>
                  {ach.description && <p className="text-[11px] text-slate-600 line-clamp-2">{ach.description}</p>}
                </div>
              );
            })}
          </div>
        </details>
      )}

      {/* EXECUTIVE COUNCIL GRID (TASK 13) */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-3 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">EXECUTIVE ARM</span>
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              The Executive Council ({excos.length} Portfolios)
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">{excos.length} Officers Listed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {excos.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-64 bg-slate-950 border-b border-stone-100 overflow-hidden flex items-center justify-center">
                  {appt.person.avatarMedia?.url ? (
                    <Image
                      src={appt.person.avatarMedia.url}
                      alt={appt.person.fullName}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-emerald-950 text-amber-400 font-bold text-2xl flex items-center justify-center border border-amber-400/40">
                      {appt.person.fullName.charAt(0)}
                    </div>
                  )}

                  <div className="absolute top-4 left-4 bg-emerald-950 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/50 shadow-md">
                    {appt.office.title}
                  </div>

                  <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow">
                    {appt.person.stateOfOrigin} State
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-slate-900 leading-snug">
                      {appt.person.fullName}
                    </h3>
                    {appt.person.department && (
                      <p className="text-xs text-slate-500 font-medium">
                        {appt.person.department} {appt.person.level ? `(${appt.person.level})` : ''}
                      </p>
                    )}
                  </div>

                  {appt.person.bio && (
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-light">{appt.person.bio}</p>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 space-y-3">
                {/* Contact & Social Links */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100 text-xs text-slate-500">
                  {appt.person.email && (
                    <a href={`mailto:${appt.person.email}`} className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700 transition-colors" title="Email Officer">
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {appt.person.phoneNumber && (
                    <a href={`tel:${appt.person.phoneNumber}`} className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700 transition-colors" title="Call Officer">
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {appt.person.twitterUrl && (
                    <a href={appt.person.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700 transition-colors" title="Twitter Profile">
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {appt.person.linkedinUrl && (
                    <a href={appt.person.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700 transition-colors" title="LinkedIn Profile">
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {appt.person.instagramUrl && (
                    <a href={appt.person.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-slate-700 transition-colors" title="Instagram Profile">
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Session: {currentSession.title}</span>
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                    Confirmed Exco
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC HOUSE OF REPRESENTATIVES (TASK 2) */}
      <section id="house-of-reps" className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">LEGISLATIVE ARM</span>
          <h2 className="text-2xl font-serif font-bold text-slate-900">House of Representatives</h2>
          <p className="text-xs text-slate-600 mt-1">
            Dynamic assembly of constituent state delegates for the <strong className="text-slate-900">{currentSession.title}</strong>.
          </p>
        </div>

        {/* Principal Officers */}
        {houseOfficers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {houseOfficers.map((ho) => (
              <div key={ho.id} className="bg-amber-50/70 border border-amber-300 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-md">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
                    {ho.office.title}
                  </span>
                  <h3 className="font-serif font-bold text-base text-slate-900">{ho.person.fullName}</h3>
                  <span className="text-xs text-slate-600 font-medium">{ho.stateRepresented || ho.person.stateOfOrigin} State Delegation</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic State Representation Table (TASK 2) */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="bg-slate-950 text-white px-6 py-4 font-serif font-bold text-sm flex justify-between items-center">
            <span>{currentSession.title} Constituent State Legislative Delegations</span>
            <span className="text-xs font-normal text-amber-400">{dbRepresentatives.length} Representatives Enrolled</span>
          </div>

          <div className="divide-y divide-stone-100">
            {constituentStateList.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No representatives enrolled for this session yet.
              </div>
            ) : (
              constituentStateList.map((stateName) => {
                const reps = stateRepresentativesMap[stateName];
                return (
                  <div key={stateName} className="p-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-950" />
                      <span className="font-bold text-xs text-slate-900">{stateName} State</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {reps.map((r) => (
                        <div key={r.id} className="bg-stone-50 text-slate-900 text-xs px-3 py-1.5 rounded-xl border border-stone-200 font-bold flex items-center gap-2">
                          {r.photoUrl && (
                            <img src={r.photoUrl} alt={r.fullName} className="w-5 h-5 rounded-full object-cover" />
                          )}
                          <span>{r.fullName}</span>
                          <span className="text-[10px] text-amber-700 font-mono">({r.positionTitle})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
