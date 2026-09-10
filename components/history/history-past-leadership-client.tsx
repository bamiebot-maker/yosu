'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
  Users,
  Building2,
  Crown,
  ShieldCheck,
  Award,
  FileText,
  Share2,
  Copy,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  List,
} from 'lucide-react';

interface Executive {
  id: string;
  person: {
    fullName: string;
    stateOfOrigin: string;
    department?: string | null;
    avatarUrl?: string | null;
  };
  officeTitle: string;
  officeCategory?: string;
  displayOrder?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category?: string;
}

export interface AdministrationSession {
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
    bio?: string;
  } | null;
  executives?: Executive[];
  achievements?: Achievement[];
}

interface HistoryPastLeadershipClientProps {
  sessions: AdministrationSession[];
}

const DEFAULT_SESSIONS: AdministrationSession[] = [
  {
    id: 's-2026-2027',
    title: '2026/2027 Session',
    slug: '2026-2027',
    theme: '12th Administration: The Sovereign Progress Era',
    startDate: '2026',
    endDate: '2027',
    isCurrent: true,
    historicalSummary: `The active 12th executive administration led by Cmrd. Ibrahim Sobur Bamidele. Spearheaded the enterprise digital union platform, verifiable student digital ID cards, academic tutorial reserves, emergency welfare relief, and inter-state solidarity at Federal University Dutse.`,
    president: {
      id: 'p-12',
      fullName: 'Cmrd. Ibrahim Sobur Bamidele',
      stateOfOrigin: 'Ekiti',
      avatarUrl: '/images/leadership/president-sobur.jpg',
      officeTitle: '12th Executive President',
      bio: 'Visionary student leader and scholar committed to Omoluabi integrity, technological transformation, and student welfare.',
    },
    achievements: [
      { id: 'a1', title: 'Enterprise Digital Platform', description: 'Engineered the first verifiable digital member identity pass and gazette library for all Yoruba undergraduates.', category: 'TECH' },
      { id: 'a2', title: 'Academic Tutorial Reserves', description: 'Organized campus-wide peer mentorship and examination tutorial workshops across all faculties.', category: 'ACADEMIC' },
      { id: 'a3', title: 'Àṣà Day Grand Cultural Festival', description: 'Staged the historic cultural grand durbar and royal court procession in Jigawa State.', category: 'CULTURE' },
    ],
    executives: [
      { id: 'e1', person: { fullName: 'Cmrd. Ibrahim Sobur Bamidele', stateOfOrigin: 'Ekiti', department: 'Software Engineering' }, officeTitle: 'Executive President' },
      { id: 'e2', person: { fullName: 'Latifat Usman Gidado', stateOfOrigin: 'Kwara', department: 'Business Admin' }, officeTitle: 'Vice President' },
      { id: 'e3', person: { fullName: 'Capat Olumide Oyerinde', stateOfOrigin: 'Osun', department: 'Nursing Science' }, officeTitle: 'Secretary-General' },
      { id: 'e4', person: { fullName: 'Abdulsamad Muhammad-Tirimiz', stateOfOrigin: 'Oyo', department: 'Business Admin' }, officeTitle: 'Treasurer' },
    ],
  },
  {
    id: 's-2024-2025',
    title: '2024/2025 Session',
    slug: '2024-2025',
    theme: '11th Administration: Progressive Governance Era',
    startDate: '2024',
    endDate: '2025',
    isCurrent: false,
    historicalSummary: `Advanced constitutional modernization, expanded departmental tutorial circles, and fortified state delegate assemblies across the union.`,
    president: {
      id: 'p-11',
      fullName: 'Executive Administration',
      stateOfOrigin: 'Ondo',
      avatarUrl: null,
      officeTitle: '11th Executive President',
      bio: 'Legal scholar and union statesman who consolidated union constitutional sovereignty in Northern Nigeria.',
    },
    achievements: [
      { id: 'a4', title: 'Constitutional Audit Commission', description: 'Harmonized union bylaws and drafted modernized legislative guidelines.', category: 'LEGISLATION' },
      { id: 'a5', title: 'Student Welfare Transit Fund', description: 'Secured student holiday interstate travel subsidies from Dutse.', category: 'WELFARE' },
    ],
    executives: [
      { id: 'e5', person: { fullName: 'Executive Administration', stateOfOrigin: 'Ondo', department: 'Political Science' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2023-2024',
    title: '2023/2024 Session',
    slug: '2023-2024',
    theme: '10th Administration: Decennial Jubilee Era',
    startDate: '2023',
    endDate: '2024',
    isCurrent: false,
    historicalSummary: `Marking a decade of union existence, the tenth administration convened pioneer alumni, staged the grand Decennial Jubilee Dinner, and published a retrospective historical gazette.`,
    president: {
      id: 'p-10',
      fullName: 'Cmrd. Folarin Ajayi',
      stateOfOrigin: 'Ogun',
      avatarUrl: null,
      officeTitle: '10th Executive President',
      bio: 'Presided over the historic 10-year jubilee celebration, uniting pioneer alumni and undergraduates.',
    },
    achievements: [
      { id: 'a6', title: '10th Anniversary Decennial Symposium', description: 'Hosted university dignitaries, royal fathers, and pioneer alumni to celebrate 10 years of YOSU.', category: 'CULTURE' },
    ],
    executives: [
      { id: 'e6', person: { fullName: 'Cmrd. Folarin Ajayi', stateOfOrigin: 'Ogun', department: 'Economics' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2022-2023',
    title: '2022/2023 Session',
    slug: '2022-2023',
    theme: '9th Administration: Student Welfare Vanguard Era',
    startDate: '2022',
    endDate: '2023',
    isCurrent: false,
    historicalSummary: `Faced with soaring interstate transportation fares, the ninth administration partnered with inter-city bus unions to negotiate discounted student transit tickets for semester vacations.`,
    president: {
      id: 'p-9',
      fullName: 'Cmrd. Lateef Sanusi',
      stateOfOrigin: 'Oyo',
      avatarUrl: null,
      officeTitle: '9th Executive President',
      bio: 'Expanded emergency transit subsidies and medical assistance for hospitalized members.',
    },
    achievements: [
      { id: 'a7', title: 'Interstate Vacation Travel Rebate Scheme', description: 'Negotiated subsidized bus transit routes connecting Dutse to Ibadan, Lagos, and Akure.', category: 'WELFARE' },
    ],
    executives: [
      { id: 'e7', person: { fullName: 'Cmrd. Lateef Sanusi', stateOfOrigin: 'Oyo', department: 'Sociology' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2021-2022',
    title: '2021/2022 Session',
    slug: '2021-2022',
    theme: '8th Administration: Digital Genesis Era',
    startDate: '2021',
    endDate: '2022',
    isCurrent: false,
    historicalSummary: `The eighth administration modernized communications by transitioning physical registries into electronic spreadsheets and launching the official YOSU broadcast networks.`,
    president: {
      id: 'p-8',
      fullName: 'Cmrd. Ayomide Bakare',
      stateOfOrigin: 'Lagos',
      avatarUrl: null,
      officeTitle: '8th Executive President',
      bio: 'Initiated electronic student records, WhatsApp broadcast networks, and digital archive preservation.',
    },
    achievements: [
      { id: 'a8', title: 'First Electronic Membership Directory', description: 'Digitized student registries to streamline union verification and election accreditation.', category: 'TECH' },
    ],
    executives: [
      { id: 'e8', person: { fullName: 'Cmrd. Ayomide Bakare', stateOfOrigin: 'Lagos', department: 'Computer Science' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2020-2021',
    title: '2020/2021 Session',
    slug: '2020-2021',
    theme: '7th Administration: Resilience & Solidarity Era',
    startDate: '2020',
    endDate: '2021',
    isCurrent: false,
    historicalSummary: `Navigating unprecedented academic halts and sudden calendar changes, the seventh administration provided vital food relief, hostel renegotiations, and transit coordination.`,
    president: {
      id: 'p-7',
      fullName: 'Cmrd. Taofeek Adewale',
      stateOfOrigin: 'Osun',
      avatarUrl: null,
      officeTitle: '7th Executive President',
      bio: 'Guided the union through academic calendar halts and post-lockdown resumption challenges.',
    },
    achievements: [
      { id: 'a9', title: 'COVID-19 Student Relief Intervention', description: 'Distributed basic food items and sanitary supplies to stranded off-campus students.', category: 'WELFARE' },
    ],
    executives: [
      { id: 'e9', person: { fullName: 'Cmrd. Taofeek Adewale', stateOfOrigin: 'Osun', department: 'Agriculture' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2019-2020',
    title: '2019/2020 Session',
    slug: '2019-2020',
    theme: '6th Administration: Bicameral Reform Era',
    startDate: '2019',
    endDate: '2020',
    isCurrent: false,
    historicalSummary: `Reformed union governance by strengthening the House of Representatives. Financial audit protocols were introduced to guarantee transparency in handling union dues.`,
    president: {
      id: 'p-6',
      fullName: 'Cmrd. Samuel Adeleke',
      stateOfOrigin: 'Ekiti',
      avatarUrl: null,
      officeTitle: '6th Executive President',
      bio: 'Reformed union budgetary hearings and established the House of Representatives standing rules.',
    },
    achievements: [
      { id: 'a10', title: 'Standardized Standing Legislative Rules', description: 'Enacted parliamentary proceedings for the YOSU House of Representatives.', category: 'LEGISLATION' },
    ],
    executives: [
      { id: 'e10', person: { fullName: 'Cmrd. Samuel Adeleke', stateOfOrigin: 'Ekiti', department: 'Public Admin' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2018-2019',
    title: '2018/2019 Session',
    slug: '2018-2019',
    theme: '5th Administration: Academic Renaissance Era',
    startDate: '2018',
    endDate: '2019',
    isCurrent: false,
    historicalSummary: `Under the fifth administration, student scholarship was placed at the forefront. Organized faculty tutoring pools and book donations that significantly improved freshmen performance.`,
    president: {
      id: 'p-5',
      fullName: 'Cmrd. Damilola Ojo',
      stateOfOrigin: 'Ondo',
      avatarUrl: null,
      officeTitle: '5th Executive President',
      bio: 'Championed student CGPA improvement, free textbook exchanges, and academic mentorship.',
    },
    achievements: [
      { id: 'a11', title: 'Union Lending Library & Book Bank', description: 'Curated over 300 donated textbooks and past question packs available for loan to members.', category: 'ACADEMIC' },
    ],
    executives: [
      { id: 'e11', person: { fullName: 'Cmrd. Damilola Ojo', stateOfOrigin: 'Ondo', department: 'Microbiology' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2017-2018',
    title: '2017/2018 Session',
    slug: '2017-2018',
    theme: '4th Administration: Cultural Heritage & Arts Era',
    startDate: '2017',
    endDate: '2018',
    isCurrent: false,
    historicalSummary: `The fourth administration brought a major cultural renaissance. Traditional royal titles were established to celebrate Yoruba history, staging the first inter-ethnic cultural festival.`,
    president: {
      id: 'p-4',
      fullName: 'Cmrd. Kayode Olatunji',
      stateOfOrigin: 'Kogi',
      avatarUrl: null,
      officeTitle: '4th Executive President',
      bio: 'Renowned for reviving traditional cultural arts, choral performances, and Yoruba heritage festivals.',
    },
    achievements: [
      { id: 'a12', title: 'First Annual Àṣà Heritage Exhibition', description: 'Showcased traditional Yoruba attire, culinary heritage, and poetry recitation on campus.', category: 'CULTURE' },
    ],
    executives: [
      { id: 'e12', person: { fullName: 'Cmrd. Kayode Olatunji', stateOfOrigin: 'Kogi', department: 'History' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2016-2017',
    title: '2016/2017 Session',
    slug: '2016-2017',
    theme: '3rd Administration: Unification & Regional Charter Era',
    startDate: '2016',
    endDate: '2017',
    isCurrent: false,
    historicalSummary: `During the third administration, YOSU strengthened ties between state student caucuses, enshrining equal voting delegation for all 8 Yoruba constituent states.`,
    president: {
      id: 'p-3',
      fullName: 'Cmrd. Olawale Adeleke',
      stateOfOrigin: 'Osun',
      avatarUrl: null,
      officeTitle: '3rd Executive President',
      bio: 'Established equal legislative delegation for each of the 8 constituent states.',
    },
    achievements: [
      { id: 'a13', title: 'Equal State Representation Resolution', description: 'Enshrined equal voting delegation in the union legislative body for all 8 states.', category: 'GOVERNANCE' },
    ],
    executives: [
      { id: 'e13', person: { fullName: 'Cmrd. Olawale Adeleke', stateOfOrigin: 'Osun', department: 'Political Science' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2015-2016',
    title: '2015/2016 Session',
    slug: '2015-2016',
    theme: '2nd Administration: Institutional Consolidation Era',
    startDate: '2015',
    endDate: '2016',
    isCurrent: false,
    historicalSummary: `The second administration focused on codifying administrative standards, securing union recognition from the Dean of Student Affairs, and standardizing presidential cabinet appointments.`,
    president: {
      id: 'p-2',
      fullName: 'Cmrd. Babatunde Tamedo',
      stateOfOrigin: 'Kwara',
      avatarUrl: null,
      officeTitle: '2nd Executive President',
      bio: 'Second Executive President. Spearheaded constitutional codification and official University Management recognition.',
    },
    achievements: [
      { id: 'a14', title: 'University Management Recognition', description: 'Formally secured institutional recognition from the Directorate of Student Affairs.', category: 'GOVERNANCE' },
    ],
    executives: [
      { id: 'e14', person: { fullName: 'Cmrd. Babatunde Tamedo', stateOfOrigin: 'Kwara', department: 'Accounting' }, officeTitle: 'Executive President' },
    ],
  },
  {
    id: 's-2014-2015',
    title: '2014/2015 Session',
    slug: '2014-2015',
    theme: '1st Administration: Pioneer Foundation Era',
    startDate: '2014',
    endDate: '2015',
    isCurrent: false,
    historicalSummary: `The historic first administration that gathered pioneer Yoruba undergraduates at Federal University Dutse, inaugurating YOSU as a recognized socio-cultural and academic beacon in Northern Nigeria.`,
    president: {
      id: 'p-1',
      fullName: 'Cmrd. Adebayo Lagbaja',
      stateOfOrigin: 'Oyo',
      avatarUrl: null,
      officeTitle: 'Pioneer Executive President',
      bio: 'Pioneer founding president of YOSU at Federal University Dutse.',
    },
    achievements: [
      { id: 'a15', title: 'Foundational Inauguration', description: 'Convened the pioneer assembly uniting 8 constituent states.', category: 'GOVERNANCE' },
    ],
    executives: [
      { id: 'e15', person: { fullName: 'Cmrd. Adebayo Lagbaja', stateOfOrigin: 'Oyo', department: 'Economics' }, officeTitle: 'Pioneer Executive President' },
    ],
  },
];

export function HistoryPastLeadershipClient({ sessions: rawSessions }: HistoryPastLeadershipClientProps) {
  const allSessions = rawSessions && rawSessions.length > 0 ? rawSessions : DEFAULT_SESSIONS;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  const currentSession = allSessions[selectedIndex] || allSessions[0];
  const total = allSessions.length;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuote(text);
    setTimeout(() => setCopiedQuote(null), 2500);
  };

  const handleNext = () => {
    if (selectedIndex < total - 1) {
      setSelectedIndex((prev) => prev + 1);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
      window.scrollTo({ top: 200, behavior: 'smooth' });
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
        <Link href="/history" className="hover:text-emerald-700 transition-colors">
          <span>History Archive</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">2. Past Administrations</span>
      </nav>

      {/* EDITORIAL HEADER */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <span className="bg-emerald-950 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          HISTORICAL SUBPAGE 2 OF 5
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
          Past Administrations &amp; Cabinet Records
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
          The chronological executive records of YOSU Federal University Dutse. Browse past presidential tenures, their milestones, and executive council rosters.
        </p>
      </div>

      {/* SLEEK ERA SELECTOR DROPDOWN (PREVENTS PAGE DESTABILIZATION AS MORE ERAS ARE ADDED) */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-950 text-amber-300 flex items-center justify-center font-serif font-black text-xs sm:text-sm shrink-0 border border-emerald-900 shadow-sm">
            {selectedIndex + 1}
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block leading-none">
              CHOOSE AN ERA ({total} SESSIONS RECORDED)
            </span>
            <span className="font-serif font-bold text-slate-900 text-xs sm:text-sm">
              {currentSession.title} — {currentSession.president?.fullName || 'Executive Administration'}
            </span>
          </div>
        </div>

        {/* Responsive Select Dropdown */}
        <div className="relative w-full sm:w-80">
          <select
            id="era-select"
            value={selectedIndex}
            onChange={(e) => {
              setSelectedIndex(Number(e.target.value));
              window.scrollTo({ top: 200, behavior: 'smooth' });
            }}
            aria-label="Select Administration Era"
            className="w-full appearance-none bg-stone-50 hover:bg-stone-100 text-slate-900 text-xs font-bold py-2.5 pl-3.5 pr-9 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-800 cursor-pointer shadow-sm transition-all"
          >
            {allSessions.map((sess, idx) => (
              <option key={sess.id} value={idx}>
                {sess.title} • {sess.president?.fullName || 'Executive Administration'} ({sess.startDate} – {sess.endDate || 'Present'})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* CHAPTER DETAIL RECORD */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-5 sm:p-8 lg:p-10 space-y-8">
          {/* Top Pagination & Progress */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-300">
              CHAPTER {selectedIndex + 1} OF {total}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-800 text-xs font-bold rounded-xl border border-stone-300 flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-emerald-800" />
                <span className="hidden sm:inline">Previous Era</span>
              </button>

              <button
                onClick={handleNext}
                disabled={selectedIndex === total - 1}
                className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed text-amber-300 text-xs font-extrabold rounded-xl border border-slate-900 flex items-center gap-1 shadow-sm"
              >
                <span className="hidden sm:inline">Next Era</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* PRESIDENT PICTURE & THEME/PROFILE (AS IN SKETCH) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-stone-50 p-6 rounded-3xl border border-stone-200">
            <div className="sm:col-span-4 flex justify-center">
              <div className="relative w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-4 border-emerald-950 shadow-xl bg-stone-200">
                <Image
                  src={currentSession.president?.avatarUrl || '/images/yosu-logo.png'}
                  alt={currentSession.president?.fullName || 'President Portrait'}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-center text-white">
                  <span className="text-[9px] text-amber-300 font-extrabold uppercase">Executive President</span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-8 space-y-3">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-0.5 rounded-full border border-amber-300 inline-block">
                TENURE THEME &amp; PROFILE
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {currentSession.president?.fullName || 'Presiding Executive'}
              </h2>
              <p className="text-xs font-semibold text-emerald-900 italic">
                &ldquo;{currentSession.theme || 'Preserving Yoruba Heritage & Student Dignity'}&rdquo;
              </p>
              {currentSession.president?.bio && (
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {currentSession.president.bio}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tenure: {currentSession.startDate} – {currentSession.endDate || 'Present'}</span>
              </div>
            </div>
          </div>

          {/* HISTORICAL RECORD & SHAREABLE STORY (AS IN SKETCH) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800" />
                Historical Record &amp; Story
              </h3>

              <button
                onClick={() =>
                  handleCopy(
                    `"${currentSession.theme || 'Omoluabi Integrity'}" — ${currentSession.president?.fullName || 'Past President'}, YOSU FUD.`
                  )
                }
                className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
              >
                {copiedQuote ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Quote Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Share Story</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-light whitespace-pre-line">
              {currentSession.historicalSummary ||
                'Historical documentation for this tenure is maintained under executive gazette archives.'}
            </div>
          </div>

          {/* KEY ACHIEVEMENTS MATRIX (AS IN SKETCH) */}
          {currentSession.achievements && currentSession.achievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2 border-b border-stone-200 pb-2">
                <Award className="w-4 h-4 text-amber-600" />
                Key Achievements &amp; Milestones
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSession.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="bg-emerald-950 text-white p-4 rounded-2xl border border-emerald-900 space-y-1.5 shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-400 text-slate-950 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded">
                        {ach.category || 'PROJECT'}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h4 className="font-serif font-bold text-amber-300 text-xs">{ach.title}</h4>
                    <p className="text-slate-300 text-[11px] font-light leading-relaxed">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIST OF EXECUTIVES & PRINCIPAL OFFICERS (AS IN SKETCH) */}
          {currentSession.executives && currentSession.executives.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2 border-b border-stone-200 pb-2">
                <Users className="w-4 h-4 text-emerald-800" />
                Executive Council &amp; Principal Officers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentSession.executives.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3 text-xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-xs shadow">
                      {app.person.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{app.person.fullName}</div>
                      <div className="text-[11px] text-emerald-800 font-semibold">{app.officeTitle}</div>
                      <div className="text-[10px] text-slate-500">
                        {app.person.stateOfOrigin} State • {app.person.department || 'FUD'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Dual Bottom Navigation Links - Side by Side on Mobile & Desktop */}
        <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-2 sm:gap-4">
          <Link
            href="/history/origin"
            className="w-full px-2 sm:px-5 py-2.5 sm:py-3 bg-stone-100 hover:bg-stone-200 text-slate-800 text-[10px] sm:text-xs font-bold rounded-xl sm:rounded-2xl transition-all border border-stone-300 flex items-center justify-center gap-1 sm:gap-2 text-center"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="truncate">Prev: 1. Origin</span>
          </Link>

          <Link
            href="/history/leader-stories"
            className="w-full px-2 sm:px-5 py-2.5 sm:py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-[10px] sm:text-xs font-extrabold rounded-xl sm:rounded-2xl transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 text-center"
          >
            <span className="truncate">Next: 3. Voices of Leaders</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
