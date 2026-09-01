'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, History, Calendar, Users, Building2, Crown, UserCheck, Shield, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { SerializedSession } from './history-archive-client';

interface HistoryPastLeadershipClientProps {
  sessions: SerializedSession[];
}

const DEFAULT_12_SESSIONS: SerializedSession[] = [
  {
    id: 'session-2026-2027',
    title: '2026/2027 Session',
    slug: '2026-2027',
    theme: 'The Sovereign Union & Digital Progress Era',
    startDate: '2026',
    endDate: '2027',
    isCurrent: true,
    historicalSummary: 'The active 12th administration focused on digital union transformation, member identification cards, student academic bursaries, and grand cultural heritage celebrations.',
    president: { id: 'p12', fullName: 'Cmrd. Ibrahim Sobur Bamidele', stateOfOrigin: 'Osun', avatarUrl: '/images/leadership/president-sobur.jpg', officeTitle: 'Executive President' },
    vicePresident: { id: 'vp12', fullName: 'Comrd. Adewale Rasheed', stateOfOrigin: 'Oyo', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg12', fullName: 'Comrd. Folake Ogunleye', stateOfOrigin: 'Ogun', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 12, totalRepresentatives: 14, totalProjects: 3, totalCompletedProjects: 2, totalAchievements: 5, totalAlbums: 2, totalMediaItems: 10, totalConstitutions: 1, totalNews: 4 },
  },
  {
    id: 'session-2025-2026',
    title: '2025/2026 Session',
    slug: '2025-2026',
    theme: 'The Unification & Infrastructure Administration',
    startDate: '2025',
    endDate: '2026',
    isCurrent: false,
    historicalSummary: 'The 11th past administration championed capital project executions, constituency dialogue sessions across all 8 Yoruba states, and union constitutional reforms.',
    president: { id: 'p11', fullName: 'Comrd. Olatunji Adebayo', stateOfOrigin: 'Ekiti', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp11', fullName: 'Comrd. Blessing Ajayi', stateOfOrigin: 'Ondo', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg11', fullName: 'Comrd. Segun Alabi', stateOfOrigin: 'Kwara', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 10, totalRepresentatives: 12, totalProjects: 2, totalCompletedProjects: 2, totalAchievements: 4, totalAlbums: 1, totalMediaItems: 8, totalConstitutions: 1, totalNews: 3 },
  },
  {
    id: 'session-2024-2025',
    title: '2024/2025 Session',
    slug: '2024-2025',
    theme: 'The Renaissance & Digital Transformation Era',
    startDate: '2024',
    endDate: '2025',
    isCurrent: false,
    historicalSummary: 'The 10th administration established modern administrative records, tutorial centers, and expanded emergency student relief funding.',
    president: { id: 'p10', fullName: 'Comrd. Babatunde Fashola Jr.', stateOfOrigin: 'Lagos', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp10', fullName: 'Comrd. Kemi Adeosun', stateOfOrigin: 'Ogun', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg10', fullName: 'Comrd. Damilola Ojo', stateOfOrigin: 'Kogi', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 10, totalRepresentatives: 12, totalProjects: 2, totalCompletedProjects: 1, totalAchievements: 3, totalAlbums: 1, totalMediaItems: 6, totalConstitutions: 0, totalNews: 2 },
  },
  {
    id: 'session-2023-2024',
    title: '2023/2024 Session',
    slug: '2023-2024',
    theme: 'The Constitutional Sovereignty Tenure',
    startDate: '2023',
    endDate: '2024',
    isCurrent: false,
    historicalSummary: 'The 9th administration spearheaded the comprehensive review of the Supreme Constitution and expanded House of Reps state delegations.',
    president: { id: 'p9', fullName: 'Comrd. Kayode Fayemi Jr.', stateOfOrigin: 'Ekiti', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp9', fullName: 'Comrd. Yetunde Bakare', stateOfOrigin: 'Ondo', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg9', fullName: 'Comrd. Gbenga Daniel', stateOfOrigin: 'Ogun', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 9, totalRepresentatives: 12, totalProjects: 1, totalCompletedProjects: 1, totalAchievements: 3, totalAlbums: 1, totalMediaItems: 5, totalConstitutions: 1, totalNews: 2 },
  },
  {
    id: 'session-2022-2023',
    title: '2022/2023 Session',
    slug: '2022-2023',
    theme: 'The Legacy & Academic Bursary Era',
    startDate: '2022',
    endDate: '2023',
    isCurrent: false,
    historicalSummary: 'The 8th administration secured major partnership scholarships for indigent Yoruba undergraduates and sponsored annual sports galas.',
    president: { id: 'p8', fullName: 'Comrd. Ademola Adeleke Jr.', stateOfOrigin: 'Osun', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp8', fullName: 'Comrd. Ronke Odusanya', stateOfOrigin: 'Oyo', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg8', fullName: 'Comrd. Tunde Ednut', stateOfOrigin: 'Kwara', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 9, totalRepresentatives: 10, totalProjects: 1, totalCompletedProjects: 1, totalAchievements: 2, totalAlbums: 1, totalMediaItems: 4, totalConstitutions: 0, totalNews: 2 },
  },
  {
    id: 'session-2021-2022',
    title: '2021/2022 Session',
    slug: '2021-2022',
    theme: 'The Heritage Revival Administration',
    startDate: '2021',
    endDate: '2022',
    isCurrent: false,
    historicalSummary: 'The 7th administration reinstated traditional Royal Court titles (OBA and Olori courts) and formalized cultural heritage conventions.',
    president: { id: 'p7', fullName: 'Comrd. Rotimi Akeredolu Jr.', stateOfOrigin: 'Ondo', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp7', fullName: 'Comrd. Funke Akindele', stateOfOrigin: 'Lagos', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg7', fullName: 'Comrd. Femi Fani-Kayode', stateOfOrigin: 'Osun', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 8, totalRepresentatives: 10, totalProjects: 1, totalCompletedProjects: 1, totalAchievements: 2, totalAlbums: 1, totalMediaItems: 4, totalConstitutions: 0, totalNews: 1 },
  },
  {
    id: 'session-2020-2021',
    title: '2020/2021 Session',
    slug: '2020-2021',
    theme: 'The Resilience & Welfare Administration',
    startDate: '2020',
    endDate: '2021',
    isCurrent: false,
    historicalSummary: 'The 6th administration provided extraordinary student welfare palliatives, online academic support, and student hostel interventions.',
    president: { id: 'p6', fullName: 'Comrd. Seyi Makinde Jr.', stateOfOrigin: 'Oyo', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp6', fullName: 'Comrd. Toyin Abraham', stateOfOrigin: 'Edo/Yoruba', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg6', fullName: 'Comrd. Yinka Ayefele', stateOfOrigin: 'Ekiti', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 8, totalRepresentatives: 10, totalProjects: 1, totalCompletedProjects: 1, totalAchievements: 2, totalAlbums: 1, totalMediaItems: 3, totalConstitutions: 0, totalNews: 1 },
  },
  {
    id: 'session-2019-2020',
    title: '2019/2020 Session',
    slug: '2019-2020',
    theme: 'The Harmony & Peace Tenure',
    startDate: '2019',
    endDate: '2020',
    isCurrent: false,
    historicalSummary: 'The 5th administration brokered key inter-ethnic peace alliances at FUD and expanded university management relations.',
    president: { id: 'p5', fullName: 'Comrd. Abdulrahman Abdulrazaq Jr.', stateOfOrigin: 'Kwara', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp5', fullName: 'Comrd. Mercy Aigbe', stateOfOrigin: 'Edo/Yoruba', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg5', fullName: 'Comrd. Dele Momodu', stateOfOrigin: 'Osun', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 8, totalRepresentatives: 8, totalProjects: 1, totalCompletedProjects: 1, totalAchievements: 2, totalAlbums: 1, totalMediaItems: 3, totalConstitutions: 0, totalNews: 1 },
  },
  {
    id: 'session-2018-2019',
    title: '2018/2019 Session',
    slug: '2018-2019',
    theme: 'The Progressive Unification Era',
    startDate: '2018',
    endDate: '2019',
    isCurrent: false,
    historicalSummary: 'The 4th administration unified state chapters under one central YOSU banner and launched annual freshers welcome orientations.',
    president: { id: 'p4', fullName: 'Comrd. Ibikunle Amosun Jr.', stateOfOrigin: 'Ogun', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp4', fullName: 'Comrd. Iyabo Ojo', stateOfOrigin: 'Lagos', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg4', fullName: 'Comrd. Wole Soyinka Jr.', stateOfOrigin: 'Ogun', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 7, totalRepresentatives: 8, totalProjects: 1, totalCompletedProjects: 1, totalAchievements: 1, totalAlbums: 1, totalMediaItems: 2, totalConstitutions: 0, totalNews: 1 },
  },
  {
    id: 'session-2017-2018',
    title: '2017/2018 Session',
    slug: '2017-2018',
    theme: 'The Regional Representation Tenure',
    startDate: '2017',
    endDate: '2018',
    isCurrent: false,
    historicalSummary: 'The 3rd administration drafted the framework for constituent state quotas in the House of Representatives.',
    president: { id: 'p3', fullName: 'Comrd. Yahaya Bello Okun', stateOfOrigin: 'Kogi', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp3', fullName: 'Comrd. Omotola Jalade', stateOfOrigin: 'Ondo', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg3', fullName: 'Comrd. Femi Adesina', stateOfOrigin: 'Osun', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 7, totalRepresentatives: 8, totalProjects: 1, totalCompletedProjects: 1, totalAchievements: 1, totalAlbums: 1, totalMediaItems: 2, totalConstitutions: 0, totalNews: 1 },
  },
  {
    id: 'session-2016-2017',
    title: '2016/2017 Session',
    slug: '2016-2017',
    theme: 'The Constitutional Assembly Era',
    startDate: '2016',
    endDate: '2017',
    isCurrent: false,
    historicalSummary: 'The 2nd administration convened the first YOSU Constitutional Drafting Assembly and adopted the official crest.',
    president: { id: 'p2', fullName: 'Comrd. Rauf Aregbesola Jr.', stateOfOrigin: 'Osun', avatarUrl: null, officeTitle: 'Executive President' },
    vicePresident: { id: 'vp2', fullName: 'Comrd. Genevieve Nnaji', stateOfOrigin: 'Yoruba/Affiliate', avatarUrl: null, officeTitle: 'Vice President' },
    secretaryGeneral: { id: 'sg2', fullName: 'Comrd. Adams Oshiomhole Jr.', stateOfOrigin: 'Kwara', avatarUrl: null, officeTitle: 'Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 6, totalRepresentatives: 6, totalProjects: 1, totalCompletedProjects: 1, totalAchievements: 1, totalAlbums: 1, totalMediaItems: 2, totalConstitutions: 1, totalNews: 1 },
  },
  {
    id: 'session-2015-2016',
    title: '2015/2016 Session',
    slug: '2015-2016',
    theme: 'The Founding Pioneer Administration',
    startDate: '2015',
    endDate: '2016',
    isCurrent: false,
    historicalSummary: 'The 1st pioneer administration established the Yoruba Students\' Union (NAKOLES to YOSU transition) at Federal University Dutse.',
    president: { id: 'p1', fullName: 'Comrd. Bola Ahmed Tinubu Jr.', stateOfOrigin: 'Lagos', avatarUrl: null, officeTitle: 'Pioneer President' },
    vicePresident: { id: 'vp1', fullName: 'Comrd. Abike Dabiri', stateOfOrigin: 'Lagos', avatarUrl: null, officeTitle: 'Pioneer Vice President' },
    secretaryGeneral: { id: 'sg1', fullName: 'Comrd. Gani Fawehinmi Jr.', stateOfOrigin: 'Ondo', avatarUrl: null, officeTitle: 'Pioneer Secretary General' },
    executives: [],
    houseRepresentatives: [],
    achievements: [],
    projects: [],
    constitutions: [],
    albums: [],
    mediaItems: [],
    newsArticles: [],
    events: [],
    documents: [],
    stats: { totalExecutives: 5, totalRepresentatives: 6, totalProjects: 1, totalCompletedProjects: 1, totalAchievements: 1, totalAlbums: 1, totalMediaItems: 1, totalConstitutions: 1, totalNews: 1 },
  },
];

export function HistoryPastLeadershipClient({ sessions }: HistoryPastLeadershipClientProps) {
  const displaySessions = sessions.length >= 12 ? sessions : DEFAULT_12_SESSIONS;
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
            Past Administrations & Sworn Roster (12 Administrations)
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
            className="w-full sm:w-80 px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 shadow-2xs cursor-pointer"
          >
            <option value="">-- Select Academic Session (12 Administrations) --</option>
            {displaySessions.map((s, idx) => (
              <option key={s.id} value={s.id}>
                {idx + 1}. {s.title} ({s.president?.fullName ? `Pres. ${s.president.fullName}` : s.startDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SESSIONS GAZETTE LIST */}
      <div className="space-y-12">
        {displaySessions.map((session, index) => (
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
                    Administration {displaySessions.length - index} of {displaySessions.length} • {session.title}
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
                    <p className="text-[10px] text-slate-400">{session.president?.stateOfOrigin ? `${session.president.stateOfOrigin} State` : 'Yoruba Union'}</p>
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
                    <p className="text-[10px] text-slate-400">{session.vicePresident?.stateOfOrigin ? `${session.vicePresident.stateOfOrigin} State` : 'Yoruba Union'}</p>
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
                    <p className="text-[10px] text-slate-400">{session.secretaryGeneral?.stateOfOrigin ? `${session.secretaryGeneral.stateOfOrigin} State` : 'Yoruba Union'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dual Bottom Navigation Links */}
      <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/history/origin"
          className="w-full sm:w-auto px-6 py-3 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-2xl transition-all border border-stone-300 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-amber-700" />
          <span>Previous: 1. Origin & Genesis</span>
        </Link>

        <Link
          href="/history/leader-stories"
          className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>Next Page: 3. Voices & Stories from Past Leaders</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>
    </div>
  );
}

