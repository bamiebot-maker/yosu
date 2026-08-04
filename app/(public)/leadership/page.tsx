import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Shield, Users, Award, Building2, CheckCircle2, History, Sparkles, ChevronDown } from 'lucide-react';

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

  // Query appointments for the selected session
  const appointments = await db.officeAppointment.findMany({
    where: { sessionId: currentSession.id, status: 'ACTIVE' },
    include: {
      person: { include: { avatarMedia: true } },
      office: true,
    },
    orderBy: { displayOrder: 'asc' },
  });

  // Query achievements for the selected session
  const achievements = await db.sessionAchievement.findMany({
    where: { sessionId: currentSession.id },
    orderBy: { displayOrder: 'asc' },
  });

  const excos = appointments.filter((a) => a.office.category === 'EXECUTIVE_COUNCIL');
  const houseOfficers = appointments.filter((a) => a.office.category === 'PRINCIPAL_OFFICER_HOUSE');
  const traditionalTitles = appointments.filter((a) => a.office.category === 'TRADITIONAL_TITLE');

  const constituentStates = [
    { state: 'Ekiti State', reps: ['Rt. Hon. Ibrahim Sobur Bamidele (Speaker)', 'Hon. Daniel Adeyemi'] },
    { state: 'Osun State', reps: ['Hon. Alabi Oyeniyi (Clerk)', 'Hon. Sultan Olawale Akinkunmi'] },
    { state: 'Kogi State (Okun)', reps: ['Hon. Abdulrauf Jamiu', 'Hon. Ayomide Taiwo Oluwabusayo'] },
    { state: 'Ogun State', reps: ['Hon. Ahmed Faizah', 'Hon. Showole A\'Samad'] },
    { state: 'Ondo State', reps: ['Hon. Bello Roheemah', 'Hon. Okunrotifa Opeyemi Deborah'] },
    { state: 'Lagos State', reps: ['Hon. Abdulazeez Mulikah'] },
    { state: 'Kwara State', reps: ['Hon. Sodiq Ishaku Abubakr', 'Hon. Abdullahi Nuhu Ibrahim'] },
    { state: 'Oyo State', reps: ['Hon. Yusuf Ayanyosola Tairu', 'Hon. Moshood Bunyamin'] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      {/* Header Banner */}
      <div className="emerald-gradient-bg text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-emerald-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>OFFICIAL GOVERNANCE & LEADERSHIP ROSTER</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Executive Council & Legislative Arms
          </h1>

          <p className="text-stone-200 text-sm sm:text-base font-light leading-relaxed">
            Currently viewing: <span className="font-bold text-amber-300">{currentSession.title}</span> — {currentSession.theme || 'Administration'}. Governed under the ratified provisions of the 2026 YOSU Constitution.
          </p>
        </div>
      </div>

      {/* SESSION SWITCHER & HISTORICAL ARCHIVE SELECTOR */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base text-white">Multi-Session Administration Selector</h3>
              <p className="text-xs text-slate-400">Select any active or past administration session to inspect historical leadership records.</p>
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

      {/* SESSION ACHIEVEMENTS BANNER (IF ANY) */}
      {achievements.length > 0 && (
        <section className="bg-gradient-to-r from-amber-900/40 via-emerald-950/80 to-slate-950 border border-amber-400/30 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-amber-400/20 pb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-300">
              Key Achievements of the {currentSession.title} ({currentSession.theme})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div key={ach.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="bg-emerald-950 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-emerald-800 inline-block mb-1">
                  {ach.category || 'MILESTONE'}
                </span>
                <h4 className="font-serif font-bold text-sm text-white">{ach.title}</h4>
                <p className="text-xs text-slate-300 font-light">{ach.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXECUTIVE COUNCIL GRID */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-3 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">EXECUTIVE ARM</span>
            <h2 className="text-2xl font-serif font-bold text-emerald-950">
              The Executive Council ({excos.length} Offices)
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">{excos.length} Officers Listed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {excos.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group"
            >
              <div className="relative h-60 bg-slate-950 border-b border-stone-100 overflow-hidden flex items-center justify-center">
                {appt.person.avatarMedia?.url ? (
                  <Image
                    src={appt.person.avatarMedia.url}
                    alt={appt.person.fullName}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-emerald-900 text-white font-bold text-2xl flex items-center justify-center">
                    {appt.person.fullName.charAt(0)}
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded-md shadow">
                  {appt.person.stateOfOrigin} State
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                    {appt.office.title}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug">
                    {appt.person.fullName}
                  </h3>
                  {appt.person.department && (
                    <p className="text-xs text-slate-500 font-medium">
                      {appt.person.department} {appt.person.level ? `(${appt.person.level})` : ''}
                    </p>
                  )}
                  {appt.person.bio && (
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-light">{appt.person.bio}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Session: {currentSession.title}</span>
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOUSE OF REPRESENTATIVES */}
      <section id="house-of-reps" className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">LEGISLATIVE ARM</span>
          <h2 className="text-2xl font-serif font-bold text-emerald-950">House of Representatives</h2>
          <p className="text-xs text-slate-600 mt-1">
            Comprising 2 Representatives from each of the 8 Constituent States in accordance with Article 7 of the Constitution.
          </p>
        </div>

        {/* Principal Officers */}
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

        {/* State Representation Table */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="bg-slate-950 text-white px-6 py-4 font-serif font-bold text-sm">
            {currentSession.title} Constituent State Legislative Delegations
          </div>
          <div className="divide-y divide-stone-100">
            {constituentStates.map((st) => (
              <div key={st.state} className="p-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-900" />
                  <span className="font-bold text-xs text-slate-900">{st.state}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {st.reps.map((r) => (
                    <span key={r} className="bg-stone-100 text-slate-800 text-xs px-3 py-1 rounded-md border border-stone-200 font-medium">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDEPENDENT BODIES & COMMITTEES */}
      <section id="independent-bodies" className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">INDEPENDENT CONSTITUTIONAL BODIES</span>
          <h2 className="text-2xl font-serif font-bold text-emerald-950">
            Constitutional Review & Compliance Committee (CRC)
          </h2>
        </div>

        <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 border border-emerald-800">
          <h3 className="font-serif font-bold text-lg text-amber-300">CRC Governance & Functions</h3>
          <p className="text-xs text-stone-300 leading-relaxed max-w-3xl font-light">
            Established under Article 8 of the Constitution as an independent constitutional body responsible for constitutional compliance, disciplinary matters, dispute resolution, and constitutional review across all administrations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-800 space-y-1">
              <span className="text-amber-400 font-bold block uppercase text-[10px]">Chairman</span>
              <span className="text-white font-semibold text-sm">Hon. Alabi Oyeniyi</span>
            </div>
            <div className="bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-800 space-y-1">
              <span className="text-amber-400 font-bold block uppercase text-[10px]">Secretary</span>
              <span className="text-white font-semibold text-sm">Okunrotifa Opeyemi Deborah</span>
            </div>
            <div className="bg-emerald-900/60 p-3.5 rounded-xl border border-emerald-800 space-y-1">
              <span className="text-amber-400 font-bold block uppercase text-[10px]">Committee Members</span>
              <span className="text-white font-semibold text-sm">Hon. Abdulrafiu Jamiu, Hon. Sodiq</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
