'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  History,
  Sparkles,
  Clock,
  FolderOpen,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Copy,
  Quote,
  ArrowRight,
  Home,
  Award,
  FileText,
  Layers,
  Crown,
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category?: string | null;
}

interface Appointment {
  id: string;
  person: {
    fullName: string;
    stateOfOrigin: string;
    department?: string | null;
  };
  office: {
    title: string;
  };
}

export interface SessionData {
  id: string;
  title: string;
  slug: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  isCurrent: boolean;
  theme?: string | null;
  presidentName?: string | null;
  presidentPhotoUrl?: string | null;
  presidentBio?: string | null;
  historicalNarrative?: string | null;
  motto?: string | null;
  displayOrder: number;
  achievements?: Achievement[];
  appointments?: Appointment[];
}

interface UnifiedHistoryArchiveClientProps {
  sessions: SessionData[];
  initialTab?: string;
}

// Built-in authentic foundation eras if DB has few sessions
const DEFAULT_FOUNDATION_SESSIONS: SessionData[] = [
  {
    id: 'foundation-set-1',
    title: '2013/2015 Foundation Era',
    slug: '2013-2015',
    startDate: new Date('2013-09-01'),
    endDate: new Date('2015-08-31'),
    isCurrent: false,
    theme: 'The Genesis of Yoruba Student Solidarity at Federal University Dutse',
    presidentName: 'Cmrd. Adebayo Lagbaja (First Tenure)',
    presidentPhotoUrl: '/images/yosu-logo.png',
    presidentBio: 'Pioneer founding president of YOSU FUD. Spearheaded the initial mobilization of Yoruba undergraduates across all 8 constituent states.',
    motto: 'Unity, Cultural Dignity & Academic Integrity',
    displayOrder: 1,
    historicalNarrative: `In the pioneer years of Federal University Dutse (FUD), students from the South-Western Nigerian states recognized the critical need for cultural preservation and communal welfare in Jigawa State. Under the leadership of Cmrd. Adebayo Lagbaja, pioneer executive meetings were convened to draft the foundational roadmap that birthed the Yoruba Students' Union (YOSU).`,
    achievements: [
      { id: 'ach1', title: 'Union Inauguration', description: 'Harmonized 8 state student caucuses into a unified socio-cultural union.', category: 'GOVERNANCE' },
      { id: 'ach2', title: 'Pioneer Freshers Support', description: 'Established hostel accommodation guides and transportation assistance for incoming Yoruba students.', category: 'WELFARE' },
      { id: 'ach3', title: 'First Yoruba Cultural Day', description: 'Staged the landmark inaugural Yoruba cultural night in Dutse.', category: 'CULTURE' }
    ],
    appointments: [
      { id: 'app1', person: { fullName: 'Cmrd. Adebayo Lagbaja', stateOfOrigin: 'Oyo', department: 'Economics' }, office: { title: 'Executive President' } },
      { id: 'app2', person: { fullName: 'Folashade Adeleke', stateOfOrigin: 'Osun', department: 'English' }, office: { title: 'Vice President' } },
      { id: 'app3', person: { fullName: 'Kehinde Balogun', stateOfOrigin: 'Ogun', department: 'Computer Science' }, office: { title: 'Secretary General' } }
    ]
  },
  {
    id: 'foundation-set-2',
    title: '2015/2017 Institutional Era',
    slug: '2015-2017',
    startDate: new Date('2015-09-01'),
    endDate: new Date('2017-08-31'),
    isCurrent: false,
    theme: 'Structural Institutionalization & Constitutional Harmony',
    presidentName: 'Cmrd. Babatunde Tamedo (Second Set)',
    presidentPhotoUrl: '/images/yosu-logo.png',
    presidentBio: 'Champion of constitutional harmonization and legislative representation for the 8 Yoruba states.',
    motto: 'Justice, Omoluabi Ethos & Student Welfare',
    displayOrder: 2,
    historicalNarrative: `The second administration consolidated executive structures and drafted the first comprehensive Unification Constitution, instituting the bicameral principle that granted representation to Ekiti, Kwara, Oyo, Osun, Ondo, Ogun, Lagos, and Kogi in the House of Representatives.`,
    achievements: [
      { id: 'ach4', title: 'Unification Constitution Drafting', description: 'Codified executive roles and legislative standing committees.', category: 'LEGISLATION' },
      { id: 'ach5', title: 'Library Book Donations', description: 'Established the YOSU peer tutorial library reserve at FUD campus.', category: 'ACADEMIC' }
    ],
    appointments: [
      { id: 'app4', person: { fullName: 'Cmrd. Babatunde Tamedo', stateOfOrigin: 'Kwara', department: 'Business Admin' }, office: { title: 'Executive President' } },
      { id: 'app5', person: { fullName: 'Zainab Olanrewaju', stateOfOrigin: 'Ekiti', department: 'Biochemistry' }, office: { title: 'Vice President' } }
    ]
  },
  {
    id: 'foundation-set-3',
    title: '2017/2019 Expansion Era',
    slug: '2017-2019',
    startDate: new Date('2017-09-01'),
    endDate: new Date('2019-08-31'),
    isCurrent: false,
    theme: 'Expansion, Bursary Welfare & Community Integration',
    presidentName: 'Cmrd. Olanrewaju Ade (3rd Set)',
    presidentPhotoUrl: '/images/yosu-logo.png',
    presidentBio: 'Visionary student unionist who broadened external bursary partnerships and cultural diplomacy in Jigawa State.',
    motto: 'Empowerment through Culture and Intellect',
    displayOrder: 3,
    historicalNarrative: `During the 3rd set administration, YOSU deepened ties with traditional Yoruba rulers across Nigeria, attracting cultural patronage, undergraduate scholarships, and community emergency relief funds for stranded members.`,
    achievements: [
      { id: 'ach6', title: 'Emergency Student Bursary', description: 'Disbursed emergency relief funds to underprivileged students.', category: 'WELFARE' },
      { id: 'ach7', title: 'North-Central Yoruba Summit', description: 'Represented FUD at the inter-university Yoruba student conclave.', category: 'EXTERNAL' }
    ],
    appointments: [
      { id: 'app6', person: { fullName: 'Cmrd. Olanrewaju Ade', stateOfOrigin: 'Ondo', department: 'Political Science' }, office: { title: 'Executive President' } }
    ]
  }
];

export function UnifiedHistoryArchiveClient({ sessions: dbSessions, initialTab = 'origin' }: UnifiedHistoryArchiveClientProps) {
  // Merge DB sessions with foundation default sessions if needed
  const combinedSessions: SessionData[] = [...DEFAULT_FOUNDATION_SESSIONS];
  dbSessions.forEach((dbS) => {
    const existingIndex = combinedSessions.findIndex(
      (s) => s.slug === dbS.slug || s.title.toLowerCase() === dbS.title.toLowerCase()
    );
    if (existingIndex >= 0) {
      combinedSessions[existingIndex] = { ...combinedSessions[existingIndex], ...dbS };
    } else {
      combinedSessions.push(dbS);
    }
  });

  // Sort chronological ascending (oldest first to newest last)
  combinedSessions.sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedEraIndex, setSelectedEraIndex] = useState<number>(0);
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);

  const currentEra = combinedSessions[selectedEraIndex] || combinedSessions[0];

  const handleCopyQuote = (quoteText: string) => {
    navigator.clipboard.writeText(quoteText);
    setCopiedQuote(quoteText);
    setTimeout(() => setCopiedQuote(null), 2500);
  };

  const handleNextEra = () => {
    if (selectedEraIndex < combinedSessions.length - 1) {
      setSelectedEraIndex((prev) => prev + 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handlePrevEra = () => {
    if (selectedEraIndex > 0) {
      setSelectedEraIndex((prev) => prev - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const tabs = [
    { id: 'origin', label: '1. Origin & Genesis', icon: BookOpen },
    { id: 'past-admin', label: '2. Past Administrations', icon: History },
    { id: 'voices', label: '3. Voices from Past Leaders', icon: Sparkles },
    { id: 'chronological', label: '4. Chronological Timeline', icon: Clock },
    { id: 'gallery', label: '5. Heritage Gallery & Docs', icon: FolderOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Historical Archive (Magazine & Textbook)</span>
      </nav>

      {/* EDITORIAL BANNER */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-900 space-y-4 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <span className="bg-emerald-900 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            YOSU HISTORICAL GAZETTE & MEMOIRS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-amber-100 tracking-tight leading-tight">
            The Historical Journey of YOSU FUD
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
            From the pioneering foundation of NAKOLES and the 2013 genesis, to the constitutional unification and the modern digital era in Northern Nigeria.
          </p>
        </div>
      </div>

      {/* 5 CHAPTER TABS (AS IN USER SKETCH) */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap gap-1.5 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 150, behavior: 'smooth' });
              }}
              className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-emerald-950 text-amber-300 shadow-md border border-emerald-800'
                  : 'text-slate-700 hover:bg-stone-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* CHAPTER 1: ORIGIN & GENESIS                              */}
      {/* ======================================================== */}
      {activeTab === 'origin' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-6 sm:p-10 space-y-8">
            <div className="border-b border-stone-200 pb-6 space-y-2">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                CHAPTER 1 • FOUNDATIONAL GENESIS
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                What Brought About YOSU: Founding Genesis & The Omoluabi Mandate
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-light">
                The historical origins of the Yoruba Students&apos; Union (YOSU) at Federal University Dutse, Jigawa State.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-8 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  Established during the formative era of Federal University Dutse, the Yoruba Students&apos; Union (YOSU) emerged out of an urgent communal necessity. Studying hundreds of miles away from Western Nigeria in the heart of Jigawa State, pioneer Yoruba undergraduates experienced the profound necessity for a unified cultural sanctuary, academic support sanctuary, and collective brotherhood.
                </p>
                <p>
                  Originally founded under indigenous caucuses, visionary leaders harmonized disparate state student bodies into one sovereign union anchored upon the sacred <strong>Omoluabi Ethos</strong>—character, wisdom, civic accountability, and high academic performance.
                </p>
                <p>
                  Today, YOSU FUD serves as an unshakeable institutional bridge uniting students from all 8 Yoruba constituent states: <strong>Ekiti, Kwara, Oyo, Osun, Ondo, Ogun, Lagos, and Kogi (Okun Land)</strong>.
                </p>
              </div>

              <div className="md:col-span-4 space-y-4">
                <div className="bg-emerald-950 text-white p-6 rounded-3xl border border-emerald-900 space-y-3 shadow-md">
                  <h3 className="font-serif font-bold text-amber-300 text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    4 Pillars of Omoluabi
                  </h3>
                  <ul className="text-xs text-slate-200 space-y-2 list-disc list-inside font-light">
                    <li><strong>Cultural Preservation:</strong> Heritage, language, and royal court titles.</li>
                    <li><strong>Academic Excellence:</strong> Tutorial reserves, mentorship, and book drives.</li>
                    <li><strong>Constituent Unity:</strong> Brotherhood across all 8 constituent states.</li>
                    <li><strong>Leadership Integrity:</strong> Absolute stewardship and civic responsibility.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* BOTTOM TRANSITION BUTTON (AS IN SKETCH: NEXT -> PAST ADMIN) */}
            <div className="pt-6 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => {
                  setActiveTab('past-admin');
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg transition-all"
              >
                <span>Next Chapter: 2. Past Administrations</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHAPTER 2: PAST ADMINISTRATIONS (LIST & CHAPTER DETAIL)   */}
      {/* ======================================================== */}
      {activeTab === 'past-admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
          {/* LEFT: ERA DIRECTORY LIST (AS IN SKETCH) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                ADMINISTRATION DIRECTORY
              </span>
              <h3 className="font-serif font-bold text-slate-900 text-lg">
                Era Directory ({combinedSessions.length} Sets)
              </h3>
              <p className="text-xs text-slate-500 font-light">
                Select an administration set to flip to its chapter:
              </p>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {combinedSessions.map((session, idx) => {
                const isSelected = idx === selectedEraIndex;
                return (
                  <button
                    key={session.id}
                    onClick={() => {
                      setSelectedEraIndex(idx);
                      window.scrollTo({ top: 200, behavior: 'smooth' });
                    }}
                    className={`w-full p-3.5 rounded-2xl text-left border text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950 border-amber-400 text-white shadow-md'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase block font-mono ${isSelected ? 'text-amber-300' : 'text-emerald-800'}`}>
                        Set {session.displayOrder || idx + 1} • {session.title}
                      </span>
                      <div className="font-serif font-bold text-sm line-clamp-1 mt-0.5">
                        {session.presidentName || 'Executive Administration'}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {session.theme || 'Tenure Administration'}
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: CHAPTER DETAIL LAYOUT (AS DRAWN IN SKETCH) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10 space-y-8">
            {/* Top Navigation Controls */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-300">
                SET {currentEra.displayOrder || selectedEraIndex + 1} OF {combinedSessions.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevEra}
                  disabled={selectedEraIndex === 0}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-800 text-xs font-bold rounded-xl border border-stone-300 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Previous Era</span>
                </button>

                <button
                  onClick={handleNextEra}
                  disabled={selectedEraIndex === combinedSessions.length - 1}
                  className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-30 disabled:cursor-not-allowed text-amber-300 text-xs font-extrabold rounded-xl border border-slate-900 flex items-center gap-1 shadow-sm"
                >
                  <span>Next Era</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* PRESIDENT PICTURE & THEME/PROFILE (AS IN SKETCH) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-stone-50 p-6 rounded-3xl border border-stone-200">
              <div className="sm:col-span-4 flex justify-center">
                <div className="relative w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-4 border-emerald-950 shadow-xl bg-stone-200">
                  <Image
                    src={currentEra.presidentPhotoUrl || '/images/yosu-logo.png'}
                    alt={currentEra.presidentName || 'President Portrait'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-center text-white">
                    <span className="text-[9px] text-amber-300 font-extrabold uppercase">Executive President</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-8 space-y-3">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-0.5 rounded-full border border-amber-300 inline-block">
                  TENURE THEME & PROFILE
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  {currentEra.presidentName || 'Presiding Officer'}
                </h3>
                <p className="text-xs font-semibold text-emerald-900 italic">
                  &ldquo;{currentEra.theme || currentEra.motto || 'Preserving Yoruba Heritage & Student Dignity'}&rdquo;
                </p>
                {currentEra.presidentBio && (
                  <p className="text-xs text-slate-600 font-light leading-relaxed">
                    {currentEra.presidentBio}
                  </p>
                )}
              </div>
            </div>

            {/* HISTORICAL RECORD & SHAREABLE STORY (AS IN SKETCH) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h4 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-800" />
                  Historical Record & Memoir
                </h4>

                <button
                  onClick={() =>
                    handleCopyQuote(
                      `"${currentEra.theme || 'Omoluabi Integrity'}" — ${currentEra.presidentName || 'Past President'}, YOSU FUD.`
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
                {currentEra.historicalNarrative ||
                  'Historical documentation for this tenure is maintained under executive gazette archives.'}
              </div>
            </div>

            {/* KEY ACHIEVEMENTS GRID (AS IN SKETCH) */}
            {currentEra.achievements && currentEra.achievements.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  Key Achievements & Milestones
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentEra.achievements.map((ach) => (
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
                      <h5 className="font-serif font-bold text-amber-300 text-xs">{ach.title}</h5>
                      <p className="text-slate-300 text-[11px] font-light leading-relaxed">{ach.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LIST OF EXECUTIVES & PRINCIPAL OFFICERS (AS IN SKETCH) */}
            {currentEra.appointments && currentEra.appointments.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2 border-b border-stone-200 pb-2">
                  <Users className="w-4 h-4 text-emerald-800" />
                  Executive Council & Principal Officers
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentEra.appointments.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3 text-xs"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-xs shadow">
                        {app.person.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{app.person.fullName}</div>
                        <div className="text-[11px] text-emerald-800 font-semibold">{app.office.title}</div>
                        <div className="text-[10px] text-slate-500">
                          {app.person.stateOfOrigin} State • {app.person.department || 'FUD'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHAPTER 3: VOICES FROM PAST LEADERS (AS IN USER SKETCH)  */}
      {/* ======================================================== */}
      {activeTab === 'voices' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-6 sm:p-10 space-y-6">
            <div className="border-b border-stone-200 pb-4 space-y-1">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                MAGAZINE EDITORIAL
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">
                Voices of the Past Leaders: Presidential Advice & Shareable Memoirs
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-light">
                Words of wisdom, advice, and inspiring memoirs passed down by past presidents of the Yoruba Students&apos; Union.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {combinedSessions.map((session, idx) => (
                <div
                  key={session.id}
                  className="bg-slate-950 text-white rounded-3xl p-6 border border-emerald-900/60 shadow-lg space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-900 text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-400/30">
                        Set {session.displayOrder || idx + 1} Leader
                      </span>
                      <Quote className="w-5 h-5 text-amber-400" />
                    </div>

                    <h3 className="font-serif text-lg font-bold text-amber-100">
                      {session.presidentName || `Administration Executive`}
                    </h3>

                    <p className="text-slate-300 text-xs sm:text-sm font-light italic leading-relaxed bg-stone-900/80 p-4 rounded-2xl border border-stone-800">
                      &ldquo;{session.presidentBio || session.theme || 'Uphold the Omoluabi identity wherever you go. Academic excellence and cultural honor must go hand in hand at Federal University Dutse.'}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{session.title}</span>
                    <button
                      onClick={() =>
                        handleCopyQuote(
                          `"${session.presidentBio || session.theme}" — ${session.presidentName}, YOSU FUD`
                        )
                      }
                      className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 rounded-xl border border-emerald-800 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Advice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHAPTER 4: CHRONOLOGICAL TIMELINE TREE (BOTTOM TO TOP - EXACT USER SKETCH) */}
      {/* ========================================================================= */}
      {activeTab === 'chronological' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-6 sm:p-10 space-y-6">
            <div className="border-b border-stone-200 pb-4 space-y-1">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                GRAPHICAL GENEALOGY TREE
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">
                Chronological Timeline Tree (Bottom to Top)
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-light">
                A vertical branch tree growing upwards from the foundation tenure up to the current administration. Click any node to read its full era chapter!
              </p>
            </div>

            {/* THE GRAPHICAL TREE CONTAINER (BOTTOM TO TOP ORDER) */}
            <div className="relative pl-6 sm:pl-10 py-6">
              {/* Vertical Trunk Line */}
              <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-1.5 bg-gradient-to-t from-stone-400 via-emerald-700 to-amber-400 rounded-full" />

              {/* Reverse session order so 1st tenure is at the BOTTOM, current is at the TOP */}
              <div className="flex flex-col-reverse space-y-reverse space-y-8 relative">
                {combinedSessions.map((session, index) => {
                  const isCurrent = session.isCurrent || index === combinedSessions.length - 1;
                  return (
                    <div key={session.id} className="relative flex items-center gap-6 group">
                      {/* Branch Node Point on Trunk */}
                      <div
                        className={`w-6 h-6 rounded-full border-4 shrink-0 -ml-[11px] z-10 transition-transform group-hover:scale-125 ${
                          isCurrent
                            ? 'bg-amber-400 border-emerald-950 shadow-lg'
                            : 'bg-emerald-900 border-white shadow'
                        }`}
                      />

                      {/* Horizontal Branch Arm extending to the Right */}
                      <div className="w-6 sm:w-12 h-0.5 bg-stone-300 shrink-0 group-hover:bg-amber-400 transition-colors" />

                      {/* Branch Node Card */}
                      <div
                        onClick={() => {
                          setSelectedEraIndex(index);
                          setActiveTab('past-admin');
                          window.scrollTo({ top: 200, behavior: 'smooth' });
                        }}
                        className={`flex-1 p-5 rounded-3xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                          isCurrent
                            ? 'bg-slate-950 text-white border-amber-400 ring-2 ring-amber-400/30'
                            : 'bg-stone-50 hover:bg-stone-100/90 text-slate-900 border-stone-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-200/40 pb-2">
                          <span
                            className={`font-mono text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              isCurrent
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-emerald-950 text-amber-300'
                            }`}
                          >
                            Set {session.displayOrder || index + 1}
                            {index === 0 ? ' (First Tenure)' : index === 1 ? ' (Second Set)' : index === 2 ? ' (3rd Set)' : ''}
                          </span>

                          <span className="text-xs font-bold flex items-center gap-1 font-mono text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            {new Date(session.startDate).getFullYear()} –{' '}
                            {session.endDate ? new Date(session.endDate).getFullYear() : 'Present'}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1">
                          <h4 className="font-serif text-lg font-extrabold flex items-center gap-2">
                            <span>{session.presidentName || session.title}</span>
                            {isCurrent && (
                              <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-400/40">
                                Active Set
                              </span>
                            )}
                          </h4>
                          <p className={`text-xs line-clamp-1 ${isCurrent ? 'text-slate-300' : 'text-slate-600'}`}>
                            {session.theme || 'Tenure Administration'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHAPTER 5: HERITAGE GALLERY & DOCUMENTS                  */}
      {/* ======================================================== */}
      {activeTab === 'gallery' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-lg p-6 sm:p-10 space-y-6">
            <div className="border-b border-stone-200 pb-4 space-y-1">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                ARCHIVAL COLLECTION
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">
                Heritage Gallery & Historic Documents
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-light">
                Archival photo albums and historic records celebrating Yoruba culture at Federal University Dutse.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-stone-50 rounded-3xl border border-stone-200 overflow-hidden shadow-sm space-y-3 p-4">
                <div className="relative h-48 rounded-2xl overflow-hidden bg-stone-200">
                  <Image src="/images/yosu-logo.png" alt="YOSU Archive" fill className="object-contain p-4" />
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-sm">Pioneer Unification Assembly (2013)</h4>
                <p className="text-xs text-slate-500 font-light">Historical harmonization session at FUD Main Campus.</p>
              </div>

              <div className="bg-stone-50 rounded-3xl border border-stone-200 overflow-hidden shadow-sm space-y-3 p-4">
                <div className="relative h-48 rounded-2xl overflow-hidden bg-stone-200">
                  <Image src="/images/yosu-logo.png" alt="YOSU Archive" fill className="object-contain p-4" />
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-sm">First Unification Constitution Edition</h4>
                <p className="text-xs text-slate-500 font-light">Supreme legal charter assented by pioneer executive council.</p>
              </div>

              <div className="bg-stone-50 rounded-3xl border border-stone-200 overflow-hidden shadow-sm space-y-3 p-4">
                <div className="relative h-48 rounded-2xl overflow-hidden bg-stone-200">
                  <Image src="/images/yosu-logo.png" alt="YOSU Archive" fill className="object-contain p-4" />
                </div>
                <h4 className="font-serif font-bold text-slate-900 text-sm">Yoruba Cultural Week Celebrations</h4>
                <p className="text-xs text-slate-500 font-light">Traditional royal courts, Olori pageantry, and cultural dance.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
