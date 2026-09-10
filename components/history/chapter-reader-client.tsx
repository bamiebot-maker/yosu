'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  Sparkles,
  Layers,
  FileText,
  Building2,
  CheckCircle2,
  List,
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

interface HistoryChapter {
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

interface ChapterReaderClientProps {
  chapters: HistoryChapter[];
}

const DEFAULT_ORIGIN_CHAPTER: HistoryChapter = {
  id: 'chapter-0-origin',
  title: 'Founding Genesis & Omoluabi Mandate',
  slug: 'founding-genesis',
  startDate: new Date('2013-09-01'),
  endDate: new Date('2015-08-31'),
  isCurrent: false,
  theme: 'The Genesis of Yoruba Solidarity at Federal University Dutse',
  presidentName: 'Pioneer Founding Council (2013)',
  presidentPhotoUrl: '/images/yosu-logo.png',
  presidentBio: 'Established as a socio-cultural beacon for Yoruba students at Federal University Dutse, Jigawa State. Birthed out of a collective mandate to foster unity, academic excellence, and Omoluabi integrity in Northern Nigeria.',
  motto: 'Unity, Wisdom, Culture & Academic Excellence',
  displayOrder: 0,
  historicalNarrative: `The Yoruba Students' Union (YOSU), Federal University Dutse Chapter, was established during the formative years of FUD in Dutse, Jigawa State. 

Faced with the unique experience of studying in Northern Nigeria, pioneer students from the 8 constituent Yoruba states (Ekiti, Kwara, Oyo, Osun, Ondo, Ogun, Lagos, and Kogi Okun Land) recognized the vital need for a unified socio-cultural and academic body.

Through collective resilience, YOSU was harmonized under the Omoluabi ethos—a philosophy prioritizing high moral standards, mutual support, academic mentorship, and cultural preservation while honoring the host community of Jigawa State.`,
  achievements: [
    {
      id: 'a1',
      title: 'Formal Harmonization & Constitution Drafting',
      description: 'Drafted the 1st Unification Constitution establishing executive and legislative arms.',
      category: 'GOVERNANCE',
    },
    {
      id: 'a2',
      title: 'Constituent State Representation',
      description: 'Established 8 State Secretariats for Ekiti, Kwara, Oyo, Osun, Ondo, Ogun, Lagos & Kogi.',
      category: 'STRUCTURE',
    },
    {
      id: 'a3',
      title: 'Fresher Orientation & Welfare Network',
      description: 'Launched the pioneer mentorship network for incoming undergraduate Yoruba students in Dutse.',
      category: 'WELFARE',
    },
  ],
};

export function ChapterReaderClient({ chapters: rawChapters }: ChapterReaderClientProps) {
  const allChapters = [
    DEFAULT_ORIGIN_CHAPTER,
    ...rawChapters.filter((c) => c.id !== DEFAULT_ORIGIN_CHAPTER.id),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showToc, setShowToc] = useState(false);

  const currentChapter = allChapters[currentIndex] || DEFAULT_ORIGIN_CHAPTER;
  const totalChapters = allChapters.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalChapters) * 100);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalChapters - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalChapters]);

  const formatDateRange = (start: string | Date, end?: string | Date | null) => {
    const sYear = new Date(start).getFullYear();
    const eYear = end ? new Date(end).getFullYear() : 'Present';
    return `${sYear} – ${eYear}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans">
      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">Historical Gazette (Textbook View)</span>
        </div>

        {/* TOC TOGGLE BUTTON */}
        <button
          onClick={() => setShowToc(!showToc)}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-semibold rounded-xl border border-stone-300 flex items-center gap-1.5 transition-colors"
        >
          <List className="w-3.5 h-3.5 text-emerald-800" />
          <span>Chapters Index ({totalChapters})</span>
        </button>
      </nav>

      {/* QUICK TABLE OF CONTENTS DROPDOWN / DRAWER */}
      {showToc && (
        <div className="bg-stone-900 text-white p-5 rounded-3xl shadow-xl border border-amber-500/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="font-serif font-bold text-amber-300 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              YOSU History Chapters Index
            </h3>
            <button
              onClick={() => setShowToc(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allChapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowToc(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-3 rounded-2xl text-left border text-xs transition-all ${
                  idx === currentIndex
                    ? 'bg-emerald-900 border-amber-400 text-amber-200 font-bold shadow-md'
                    : 'bg-stone-800/80 border-stone-700 hover:bg-stone-800 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-amber-400 font-mono font-bold uppercase">
                  Chapter {idx + 1}
                </div>
                <div className="font-serif font-semibold text-sm line-clamp-1 mt-0.5">
                  {ch.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  <span>{formatDateRange(ch.startDate, ch.endDate)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TEXTBOOK READER HEADER BAR & PROGRESS */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="bg-emerald-900/80 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              CHAPTER {currentIndex + 1} OF {totalChapters}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-black text-amber-100 mt-2 tracking-tight">
              {currentChapter.title}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-light mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Tenure Era: {formatDateRange(currentChapter.startDate, currentChapter.endDate)}</span>
              {currentChapter.isCurrent && (
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-400/50">
                  Current Session
                </span>
              )}
            </p>
          </div>

          {/* NEXT / PREV BUTTONS IN TOP BAR */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-stone-900 text-slate-500 border-stone-800'
                  : 'bg-emerald-950 hover:bg-emerald-900 text-white border-emerald-700 shadow-md'
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalChapters - 1}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all border ${
                currentIndex === totalChapters - 1
                  ? 'opacity-40 cursor-not-allowed bg-stone-900 text-slate-500 border-stone-800'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300 shadow-md'
              }`}
            >
              <span>Next Era</span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 via-amber-400 to-amber-300 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* MAGAZINE / TEXTBOOK PAGE CONTAINER */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-10">
        {/* PRESIDENT & THEME BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-stone-200 pb-8">
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-56 sm:w-56 sm:h-64 rounded-3xl overflow-hidden border-4 border-emerald-900 shadow-2xl bg-stone-100">
              <Image
                src={currentChapter.presidentPhotoUrl || '/images/yosu-logo.png'}
                alt={currentChapter.presidentName || 'Past President'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-center text-white">
                <p className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
                  Executive President
                </p>
                <p className="font-serif text-xs font-bold line-clamp-1">
                  {currentChapter.presidentName || 'Presiding Executive'}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              TENURE THEME & MOTTO
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              &ldquo;{currentChapter.theme || currentChapter.motto || 'Omoluabi Integrity & Progress'}&rdquo;
            </h2>

            {currentChapter.presidentBio && (
              <p className="text-slate-600 text-sm leading-relaxed font-light bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <strong>Presidential Profile:</strong> {currentChapter.presidentBio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Constituent Yoruba Representation
              </span>
              <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                <Building2 className="w-4 h-4 text-amber-700" />
                Federal University Dutse
              </span>
            </div>
          </div>
        </div>

        {/* HISTORICAL NARRATIVE TEXTBOOK EDITORIAL */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-2">
            <FileText className="w-5 h-5 text-emerald-800" />
            Historical Narrative & Era Records
          </h3>
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line bg-stone-50/50 p-6 rounded-3xl border border-stone-200">
            {currentChapter.historicalNarrative ||
              'Detailed historical narrative for this administration is currently being transcribed from executive gazette archives.'}
          </div>
        </div>

        {/* KEY ACHIEVEMENTS & MILESTONES */}
        {currentChapter.achievements && currentChapter.achievements.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-700" />
              Key Achievements & Milestones of the Era
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentChapter.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="bg-emerald-950 text-white p-5 rounded-2xl border border-emerald-900 shadow-md space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-400 text-slate-950 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded">
                      {ach.category || 'MILESTONE'}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="font-serif font-bold text-amber-300 text-sm leading-snug">
                    {ach.title}
                  </h4>
                  <p className="text-slate-300 text-xs font-light leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXECUTIVE ROSTER FOR THIS CHAPTER */}
        {currentChapter.appointments && currentChapter.appointments.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-800" />
              Executive Council Roster ({currentChapter.appointments.length} Officers)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentChapter.appointments.map((app) => (
                <div
                  key={app.id}
                  className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex items-center gap-3"
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

        {/* BOTTOM PAGINATION CONTROLS */}
        <div className="pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all border ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-stone-100 text-slate-400 border-stone-200'
                : 'bg-stone-100 hover:bg-stone-200 text-slate-900 border-stone-300 shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4 text-emerald-800" />
            <span>Previous Chapter</span>
          </button>

          <div className="text-xs text-slate-500 font-medium text-center">
            Use Left (<kbd className="px-1.5 py-0.5 bg-stone-100 rounded border">←</kbd>) and Right (
            <kbd className="px-1.5 py-0.5 bg-stone-100 rounded border">→</kbd>) arrow keys to flip chapters
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === totalChapters - 1}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all border ${
              currentIndex === totalChapters - 1
                ? 'opacity-40 cursor-not-allowed bg-stone-100 text-slate-400 border-stone-200'
                : 'bg-slate-950 hover:bg-slate-900 text-amber-300 border-slate-900 shadow-md'
            }`}
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
