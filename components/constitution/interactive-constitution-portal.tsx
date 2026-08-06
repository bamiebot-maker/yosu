'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  CheckCircle2,
  Shield,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Coffee,
  Type,
  ArrowUp,
  History,
  Layers,
  Sparkles,
  BarChart3,
  Scale,
  Calendar,
  UserCheck,
  Check,
  X,
  SlidersHorizontal,
  Home,
  ChevronRight,
  Info,
  ShieldCheck,
  Award,
  AlertCircle,
  Eye,
} from 'lucide-react';

export interface SerializedSection {
  id: string;
  sectionNumber: string;
  title: string;
  content: string;
  displayOrder: number;
}

export interface SerializedArticle {
  id: string;
  articleNumber: number;
  title: string;
  slug: string;
  overview?: string | null;
  sections: SerializedSection[];
}

export interface SerializedAmendment {
  id: string;
  proposedBy: string;
  dateProposed: string;
  dateRatified?: string | null;
  amendmentSummary: string;
  fullText: string;
}

export interface SerializedVersion {
  id: string;
  versionName: string;
  edition?: string | null;
  effectiveDate: string;
  adoptionDate?: string | null;
  ratificationDate?: string | null;
  isCurrent: boolean;
  assentedBy?: string | null;
  speakerCertBy?: string | null;
  pdfUrl?: string | null;
  viewsCount: number;
  downloadsCount: number;
  sessionTitle?: string;
  articles: SerializedArticle[];
  amendments: SerializedAmendment[];
}

export interface ConstitutionPortalProps {
  currentVersion: SerializedVersion;
  allVersions: SerializedVersion[];
  stats: {
    totalChapters: number;
    totalArticles: number;
    totalSections: number;
    totalAmendments: number;
    totalViews: number;
    totalDownloads: number;
  };
}

export function InteractiveConstitutionPortal({
  currentVersion,
  allVersions,
  stats,
}: ConstitutionPortalProps) {
  // State Management
  const [activeVersionId, setActiveVersionId] = useState<string>(currentVersion.id);
  const selectedVersion =
    allVersions.find((v) => v.id === activeVersionId) || currentVersion;

  const [search, setSearch] = useState('');
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'sepia'>('light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'archive' | 'compare' | 'amendments' | 'analytics'>('text');
  
  // Compare Version Modal State
  const [compareVersionId, setCompareVersionId] = useState<string>(
    allVersions.find((v) => v.id !== selectedVersion.id)?.id || selectedVersion.id
  );

  const [localDownloadsCount, setLocalDownloadsCount] = useState(selectedVersion.downloadsCount);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Group Articles into 7 Official Chapters
  const chapters = useMemo(() => {
    return [
      {
        id: 'ch-1',
        title: 'Chapter I: General Supremacy, Membership & Objectives',
        description: 'Name, Supremacy, Autonomy, Membership Rights & Aim',
        articleNumbers: [1, 2, 3],
      },
      {
        id: 'ch-2',
        title: 'Chapter II: Organs & Executive Council Powers',
        description: 'Primary Organs, EXCO Composition & Officer Portfolios',
        articleNumbers: [4, 5, 6],
      },
      {
        id: 'ch-3',
        title: 'Chapter III: Legislative Arm — House of Representatives',
        description: 'State Delegations, Speaker Certificate & Powers',
        articleNumbers: [7],
      },
      {
        id: 'ch-4',
        title: 'Chapter IV: Independent Constitutional Committees (CRC & NSC)',
        description: 'Compliance Committee & Electoral Screening',
        articleNumbers: [8, 9],
      },
      {
        id: 'ch-5',
        title: 'Chapter V: Finance Regulations & Meeting Quorums',
        description: 'Banking, Annual Budgets, Misconduct & Congress',
        articleNumbers: [10, 11],
      },
      {
        id: 'ch-6',
        title: 'Chapter VI: Leadership Rotation, Patrons & Discipline',
        description: 'State Rotation Principle, Royal Court & Sanctions',
        articleNumbers: [12, 13, 14],
      },
      {
        id: 'ch-7',
        title: 'Chapter VII: Constitutional Amendment, Vacancies & Interpretation',
        description: 'Amendment Ratification, Succession & Schedules',
        articleNumbers: [15, 16, 17],
      },
    ];
  }, []);

  // Calculate Reading Time Dynamically
  const estimatedReadingTime = useMemo(() => {
    let totalWords = 0;
    selectedVersion.articles.forEach((art) => {
      totalWords += (art.title || '').split(/\s+/).length;
      totalWords += (art.overview || '').split(/\s+/).length;
      art.sections.forEach((sec) => {
        totalWords += (sec.title || '').split(/\s+/).length;
        totalWords += (sec.content || '').split(/\s+/).length;
      });
    });
    return Math.max(1, Math.ceil(totalWords / 200));
  }, [selectedVersion]);

  // Track Reading Scroll Progress & Active Chapter ScrollSpy
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setReadingProgress(progress);
        setShowScrollTop(window.scrollY > 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Keyboard Shortcuts (Ctrl+F / '/' to search, Esc to reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Record View Event on Mount
  useEffect(() => {
    fetch('/api/constitution/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'view', versionId: selectedVersion.id }),
    }).catch(() => {});
  }, [selectedVersion.id]);

  // Track Download Click
  const handleDownloadPdf = () => {
    setLocalDownloadsCount((prev) => prev + 1);
    fetch('/api/constitution/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'download', versionId: selectedVersion.id }),
    }).catch(() => {});
  };

  // Toggle Fullscreen Mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Search Engine & Filtering Logic
  const searchLower = search.trim().toLowerCase();

  const isMatchingArticle = (art: SerializedArticle) => {
    if (!searchLower) return true;

    // Convert Roman numerals & keywords for robust matching
    const searchTerms = searchLower.split(/\s+/);
    const artText = `article ${art.articleNumber} ${art.title} ${art.overview || ''}`.toLowerCase();

    const sectionsText = art.sections
      .map((s) => `section ${s.sectionNumber} ${s.title} ${s.content}`)
      .join(' ')
      .toLowerCase();

    const fullText = `${artText} ${sectionsText}`;
    return searchTerms.every((term) => fullText.includes(term));
  };

  const filteredArticles = useMemo(() => {
    return selectedVersion.articles.filter(isMatchingArticle);
  }, [selectedVersion.articles, searchLower]);

  // Calculate total matching items
  const matchCount = searchLower ? filteredArticles.length : 0;

  // Auto-expand all articles when searching
  useEffect(() => {
    if (searchLower) {
      const allExpanded: Record<string, boolean> = {};
      selectedVersion.articles.forEach((art) => {
        allExpanded[art.id] = true;
      });
      setExpandedArticles(allExpanded);
    }
  }, [searchLower, selectedVersion.articles]);

  const toggleArticle = (id: string) => {
    setExpandedArticles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToChapter = (index: number) => {
    setActiveChapterIndex(index);
    const targetArtNum = chapters[index].articleNumbers[0];
    const targetArticle = selectedVersion.articles.find((a) => a.articleNumber === targetArtNum);
    if (targetArticle) {
      const el = document.getElementById(`article-${targetArticle.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Text Highlighting Helper
  const highlightText = (text: string) => {
    if (!searchLower) return text;
    const parts = text.split(new RegExp(`(${searchLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchLower ? (
            <mark key={i} className="bg-amber-300 text-slate-950 font-bold px-1 rounded font-mono">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Dynamic Theme Classes
  const themeClasses = {
    light: 'bg-white text-slate-900 border-slate-200',
    dark: 'bg-slate-950 text-slate-100 border-slate-800',
    sepia: 'bg-[#FBF0D9] text-[#4A3B2C] border-[#E2D5B8]',
  }[themeMode];

  const cardThemeClasses = {
    light: 'bg-white text-slate-900 border-slate-200 shadow-sm',
    dark: 'bg-slate-900 text-slate-100 border-slate-800 shadow-md',
    sepia: 'bg-[#F4E4C1] text-[#3D2E1E] border-[#D9C49A]',
  }[themeMode];

  const fontClasses = {
    sm: 'text-xs leading-relaxed',
    base: 'text-sm leading-relaxed',
    lg: 'text-base leading-relaxed',
    xl: 'text-lg leading-relaxed',
  }[fontSize];

  return (
    <div className={`space-y-8 font-sans min-h-screen transition-colors duration-200 ${themeMode === 'dark' ? 'bg-slate-950 text-white' : ''}`}>
      {/* 1. STICKY TOP READING PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-200/50 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-400 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* BREADCRUMBS */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500 px-1 pt-2">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Supreme Unification Constitution</span>
      </nav>

      {/* 2. CONSTITUTION METADATA HERO BANNER */}
      <header className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {selectedVersion.versionName}
            </span>
            {selectedVersion.isCurrent ? (
              <span className="bg-emerald-900/90 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-600/50 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                ACTIVE SUPREME LAW
              </span>
            ) : (
              <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase border border-slate-700">
                ARCHIVED GAZETTE
              </span>
            )}
            <span className="text-xs text-amber-300 font-semibold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {selectedVersion.edition || '1st Harmonized Edition'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Unification Constitution of YOSU
          </h1>

          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            Federal University Dutse Chapter. Ratified by the House of Representatives on Friday, 10 July 2026 and assented by President Asiwaju Abdulsalam Abdulgafar Oluwagbenga on Saturday, 11 July 2026.
          </p>

          {/* Metadata Cards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">EFFECTIVE DATE</span>
              <span className="text-xs font-bold text-amber-300">{selectedVersion.effectiveDate}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">ASSENTED BY</span>
              <span className="text-xs font-bold text-white truncate block">{selectedVersion.assentedBy || 'President'}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">SPEAKER CERTIFICATE</span>
              <span className="text-xs font-bold text-white truncate block">{selectedVersion.speakerCertBy || 'Speaker'}</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">READING TIME</span>
              <span className="text-xs font-bold text-emerald-400">~{estimatedReadingTime} mins read</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={selectedVersion.pdfUrl || '/downloads/YOSU_Unification_Constitution_2026.pdf'}
              download
              onClick={handleDownloadPdf}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Gazette ({localDownloadsCount})</span>
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Constitution</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. CONSTITUTION NAVIGATION TABS */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-wrap items-center gap-2" role="tablist">
        {[
          { id: 'text', label: 'Interactive Reader', icon: BookOpen },
          { id: 'archive', label: `Version Archive (${allVersions.length})`, icon: History },
          { id: 'compare', label: 'Version Comparison', icon: Scale },
          { id: 'amendments', label: `Amendments (${selectedVersion.amendments.length})`, icon: Award },
          { id: 'analytics', label: 'Constitution Analytics', icon: BarChart3 },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-amber-300 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TABS CONTENT STREAM */}
      {activeTab === 'text' && (
        <div className="space-y-6">
          {/* SEARCH BAR & READING CONTROLS TOOLBAR */}
          <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${cardThemeClasses}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
                  ENTERPRISE SEARCH & CUSTOMIZATION ENGINE
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold">
                  Interactive Legal Provisions Search
                </h2>
              </div>

              {/* Reading Experience Customization Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Theme Selector */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setThemeMode('light')}
                    className={`p-1.5 rounded-lg transition-all ${themeMode === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    title="Classic Light Theme"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('sepia')}
                    className={`p-1.5 rounded-lg transition-all ${themeMode === 'sepia' ? 'bg-[#F4E4C1] text-[#3D2E1E] shadow-sm' : 'text-slate-500'}`}
                    title="Sepia Archive Theme"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode('dark')}
                    className={`p-1.5 rounded-lg transition-all ${themeMode === 'dark' ? 'bg-slate-950 text-amber-400 shadow-sm' : 'text-slate-500'}`}
                    title="Dark Obsidian Theme"
                  >
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Font Size Selector */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`px-2 py-1 rounded-lg font-bold uppercase transition-all ${
                        fontSize === sz ? 'bg-slate-900 text-amber-400 dark:bg-amber-400 dark:text-slate-950 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  title="Toggle Fullscreen Reading"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Instant Search Input */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Article (e.g. Article 14), Section, Chapter, Roman numerals (I-XVII), President, Discipline, Finance..."
                className="w-full pl-12 pr-28 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
              />
              {searchLower && (
                <div className="absolute right-3 top-2.5 flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/60 dark:text-amber-300 px-2.5 py-1 rounded-xl border border-amber-300 dark:border-amber-700">
                    {matchCount} {matchCount === 1 ? 'Match' : 'Matches'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MAIN LAYOUT: STICKY CHAPTER SIDEBAR & ARTICLES STREAM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sticky Sidebar Navigation */}
            <aside className={`lg:col-span-4 lg:sticky lg:top-24 p-5 rounded-3xl border shadow-sm space-y-4 ${cardThemeClasses}`}>
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif font-bold text-sm">Chapters & Articles Index</h3>
              </div>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {chapters.map((ch, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => scrollToChapter(idx)}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-amber-300 border-slate-800 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="line-clamp-1">{ch.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-light line-clamp-1">
                        {ch.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Main Articles Stream */}
            <main className="lg:col-span-8 space-y-6">
              {filteredArticles.length === 0 ? (
                <div className={`p-12 rounded-3xl border text-center space-y-4 ${cardThemeClasses}`}>
                  <Shield className="w-12 h-12 text-slate-400 mx-auto" />
                  <h3 className="font-serif font-bold text-lg">No Matching Constitutional Provisions</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto font-light">
                    We couldn&apos;t find any articles or sections matching &quot;{search}&quot;. Try searching for broader terms like &quot;President&quot;, &quot;Finance&quot;, &quot;Discipline&quot;, or &quot;Chapter III&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow"
                  >
                    Clear Search Query
                  </button>
                </div>
              ) : (
                filteredArticles.map((art) => {
                  const isExpanded = expandedArticles[art.id] ?? true;
                  return (
                    <article
                      key={art.id}
                      id={`article-${art.id}`}
                      className={`rounded-3xl border shadow-sm overflow-hidden transition-all ${cardThemeClasses}`}
                    >
                      {/* Article Header */}
                      <div
                        onClick={() => toggleArticle(art.id)}
                        className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-9 h-9 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-800 shadow-sm">
                            {art.articleNumber}
                          </span>
                          <div>
                            <h3 className="font-serif font-bold text-base">
                              Article {art.articleNumber}: {highlightText(art.title)}
                            </h3>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {art.sections.length} Codified Sub-Sections
                            </span>
                          </div>
                        </div>

                        <button type="button" className="text-slate-400 p-1">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Article Body */}
                      {isExpanded && (
                        <div className="p-6 space-y-4">
                          {art.overview && (
                            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-light">
                              <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-600 mb-1">
                                CHAPTER OVERVIEW
                              </span>
                              {highlightText(art.overview)}
                            </div>
                          )}

                          <div className="space-y-4 pt-1">
                            {art.sections.map((sec) => (
                              <div
                                key={sec.id}
                                className={`p-4 sm:p-5 rounded-2xl border ${
                                  themeMode === 'dark'
                                    ? 'bg-slate-800/50 border-slate-800'
                                    : themeMode === 'sepia'
                                    ? 'bg-[#F9EBD0] border-[#E5D7B7]'
                                    : 'bg-slate-50 border-slate-200'
                                } space-y-2`}
                              >
                                <h4 className="font-serif font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">
                                  Section {sec.sectionNumber}: {highlightText(sec.title)}
                                </h4>
                                <div className={`${fontClasses} font-light whitespace-pre-line`}>
                                  {highlightText(sec.content)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </main>
          </div>
        </div>
      )}

      {/* TAB 2: VERSION ARCHIVE */}
      {activeTab === 'archive' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${cardThemeClasses}`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              CONSTITUTIONAL VERSION ARCHIVE
            </span>
            <h2 className="font-serif text-2xl font-bold">Historical Ratified Editions</h2>
            <p className="text-xs text-slate-500">
              Browse every ratified constitution version published in the YOSU enterprise repository.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allVersions.map((ver) => (
              <div
                key={ver.id}
                className={`p-6 rounded-2xl border space-y-4 transition-all ${
                  ver.id === selectedVersion.id
                    ? 'border-2 border-emerald-500 bg-emerald-500/10 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                    {ver.versionName}
                  </span>
                  {ver.isCurrent ? (
                    <span className="bg-emerald-900 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase border border-emerald-700">
                      CURRENT RATIFIED LAW
                    </span>
                  ) : (
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      SUPERSEDED HISTORICAL
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg">{ver.versionName}</h3>
                  <p className="text-xs text-slate-500">
                    Edition: {ver.edition || '1st Harmonized'} • Effective Date: {ver.effectiveDate}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span>Contains {ver.articles.length} Enacted Articles</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVersionId(ver.id);
                      setActiveTab('text');
                    }}
                    className="bg-slate-900 text-amber-300 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Read Online
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VERSION COMPARISON TOOL */}
      {activeTab === 'compare' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${cardThemeClasses}`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              LEGAL CLAUSE COMPARISON TOOL
            </span>
            <h2 className="font-serif text-2xl font-bold">Side-by-Side Version Diff</h2>
            <p className="text-xs text-slate-500">
              Compare constitutional provisions between two ratified versions.
            </p>
          </div>

          {/* Version Selector Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">Base Version (Left)</label>
              <select
                value={selectedVersion.id}
                onChange={(e) => setActiveVersionId(e.target.value)}
                className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
              >
                {allVersions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.versionName} ({v.isCurrent ? 'Current' : 'Archived'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">Compared Version (Right)</label>
              <select
                value={compareVersionId}
                onChange={(e) => setCompareVersionId(e.target.value)}
                className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
              >
                {allVersions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.versionName} ({v.isCurrent ? 'Current' : 'Archived'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* Version A */}
            <div className="space-y-4 border-r border-slate-200 dark:border-slate-800 pr-0 lg:pr-6">
              <h3 className="font-serif font-bold text-base text-amber-500">
                {selectedVersion.versionName} ({selectedVersion.articles.length} Articles)
              </h3>
              {selectedVersion.articles.map((art) => (
                <div key={art.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="font-serif font-bold text-xs">Article {art.articleNumber}: {art.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{art.overview || 'Standard Enacted Provisions'}</p>
                </div>
              ))}
            </div>

            {/* Version B */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-base text-emerald-500">
                {allVersions.find((v) => v.id === compareVersionId)?.versionName}
              </h3>
              {(allVersions.find((v) => v.id === compareVersionId)?.articles || []).map((art) => (
                <div key={art.id} className="p-4 bg-emerald-50/20 dark:bg-emerald-950/20 rounded-xl border border-emerald-500/30 space-y-2">
                  <h4 className="font-serif font-bold text-xs">Article {art.articleNumber}: {art.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">{art.overview || 'Standard Enacted Provisions'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AMENDMENTS MODULE */}
      {activeTab === 'amendments' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${cardThemeClasses}`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              LEGISLATIVE AMENDMENTS HISTORY
            </span>
            <h2 className="font-serif text-2xl font-bold">Ratified Amendments</h2>
            <p className="text-xs text-slate-500">
              Chronological log of constitutional amendments passed by the House of Representatives and ratified by Congress.
            </p>
          </div>

          {selectedVersion.amendments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No formal amendments registered for this version.
            </div>
          ) : (
            <div className="space-y-4">
              {selectedVersion.amendments.map((am) => (
                <div key={am.id} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                      PROPOSED BY: {am.proposedBy}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Ratified: {am.dateRatified || 'Completed'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base">{am.amendmentSummary}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-light whitespace-pre-line">{am.fullText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: CONSTITUTION ANALYTICS DASHBOARD */}
      {activeTab === 'analytics' && (
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 ${cardThemeClasses}`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              DATABASE ANALYTICS & METRICS
            </span>
            <h2 className="font-serif text-2xl font-bold">Constitution Platform Analytics</h2>
            <p className="text-xs text-slate-500">
              Real-time metrics query directly from Neon PostgreSQL.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-amber-500">{stats.totalChapters}</span>
              <span className="text-xs text-slate-500 block font-medium">Chapters</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-emerald-500">{stats.totalArticles}</span>
              <span className="text-xs text-slate-500 block font-medium">Articles</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-blue-500">{stats.totalSections}</span>
              <span className="text-xs text-slate-500 block font-medium">Sections</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-purple-500">{stats.totalAmendments}</span>
              <span className="text-xs text-slate-500 block font-medium">Amendments</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-teal-500">{selectedVersion.viewsCount}</span>
              <span className="text-xs text-slate-500 block font-medium">Page Views</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-rose-500">{localDownloadsCount}</span>
              <span className="text-xs text-slate-500 block font-medium">PDF Downloads</span>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SCROLL-TO-TOP BUTTON */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-xl border border-slate-700 hover:scale-110 transition-all cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
