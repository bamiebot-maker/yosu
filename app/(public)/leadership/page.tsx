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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 font-sans">
      {/* Header Banner (TASK 5 - COMPACT MOBILE HEADER CARD) */}
      <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-2.5 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/15 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border border-amber-400/30">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL GOVERNANCE & LEADERSHIP ROSTER</span>
          </div>

          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-snug">
            Executive Council & Legislative Arms
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
            Currently viewing: <span className="font-bold text-amber-400">{currentSession.title}</span> — {currentSession.theme || 'Administration'}. Governed under the ratified provisions of the Supreme Constitution.
          </p>
        </div>
      </div>

      {/* SESSION SWITCHER & HISTORICAL ARCHIVE SELECTOR */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Administration Session Selector</h3>
              <p className="text-xs text-slate-400">Select any active or historical administration session to switch governance data.</p>
            </div>
          </div>

          {/* Session Timeline Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {sessions.map((s) => {
              const isSelected = s.id === currentSession.id;
              return (
                <Link
                  key={s.id}
                  href={`/leadership?session=${s.slug}`}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>{s.title}</span>
                  {s.isCurrent && (
                    <span className="bg-emerald-950 text-emerald-300 text-[9px] px-2 py-0.5 rounded-md uppercase font-extrabold border border-emerald-800">
                      ACTIVE
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* DYNAMIC SESSION ACHIEVEMENTS BANNER (TASK 3) */}
      {dbAchievements.length > 0 && (
        <section className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-white">
                  Key Achievements of {currentSession.title} ({currentSession.theme})
                </h2>
                <p className="text-xs text-slate-400">Dynamic completion telemetry for flagship administration goals</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              {dbAchievements.length} Initiatives Tracked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbAchievements.map((ach) => {
              const isCompleted = ach.progressPercentage >= 100;
              return (
                <div key={ach.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
                        {isCompleted ? 'Completed' : `${ach.progressPercentage}% Progress`}
                      </span>

                      <span className="text-[10px] text-slate-400 font-mono font-bold">
                        {currentSession.title}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-white">{ach.title}</h4>
                    <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3">{ach.description}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Completion Ratio</span>
                      <span className="text-amber-400">{ach.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-400 to-emerald-500'
                        }`}
                        style={{ width: `${ach.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
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
