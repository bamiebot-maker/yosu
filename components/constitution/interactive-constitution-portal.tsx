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
  ArrowUp,
  History,
  Scale,
  Award,
  BarChart3,
  X,
  Home,
  ChevronRight,
  Filter,
  ListFilter,
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
  const [activeArticleId, setActiveArticleId] = useState<string>(
    selectedVersion.articles[0]?.id || ''
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'archive' | 'compare' | 'amendments' | 'analytics'>('text');
  
  // Compare Version State
  const [compareVersionId, setCompareVersionId] = useState<string>(
    allVersions.find((v) => v.id !== selectedVersion.id)?.id || selectedVersion.id
  );

  const [localDownloadsCount, setLocalDownloadsCount] = useState(selectedVersion.downloadsCount);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Group Articles into 7 Official Chapters for the Dropdown Select
  const chapterGroups = useMemo(() => {
    const arts = selectedVersion.articles;
    return [
      {
        label: 'Chapter I: General Supremacy, Membership & Objectives',
        articles: arts.filter((a) => a.articleNumber >= 1 && a.articleNumber <= 3),
      },
      {
        label: 'Chapter II: Organs & Executive Council Powers',
        articles: arts.filter((a) => a.articleNumber >= 4 && a.articleNumber <= 6),
      },
      {
        label: 'Chapter III: Legislative Arm — House of Representatives',
        articles: arts.filter((a) => a.articleNumber === 7),
      },
      {
        label: 'Chapter IV: Independent Constitutional Committees (CRC & NSC)',
        articles: arts.filter((a) => a.articleNumber >= 8 && a.articleNumber <= 9),
      },
      {
        label: 'Chapter V: Finance Regulations & Meeting Quorums',
        articles: arts.filter((a) => a.articleNumber >= 10 && a.articleNumber <= 11),
      },
      {
        label: 'Chapter VI: Leadership Rotation, Patrons & Discipline',
        articles: arts.filter((a) => a.articleNumber >= 12 && a.articleNumber <= 14),
      },
      {
        label: 'Chapter VII: Constitutional Amendment, Vacancies & Interpretation',
        articles: arts.filter((a) => a.articleNumber >= 15 && a.articleNumber <= 17),
      },
    ].filter((g) => g.articles.length > 0);
  }, [selectedVersion.articles]);

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

  // Track Scroll Progress
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

  // Keyboard Shortcuts (Ctrl+F)
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

  const scrollToArticle = (artId: string) => {
    if (!artId) return;
    setActiveArticleId(artId);
    const el = document.getElementById(`article-${artId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  return (
    <div className="space-y-8 font-sans min-h-screen pb-16">
      {/* STICKY TOP READING PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-stone-200/60 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-emerald-600 to-amber-400 transition-all duration-150"
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

      {/* CONSTITUTION METADATA HERO BANNER (TASK 5 - COMPACT MOBILE HEADER CARD) */}
      <header className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-xl relative overflow-hidden border border-slate-800 font-sans">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {selectedVersion.versionName}
            </span>
            {selectedVersion.isCurrent ? (
              <span className="bg-emerald-900/90 text-emerald-300 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-600/50 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-400" />
                ACTIVE SUPREME LAW
              </span>
            ) : (
              <span className="bg-slate-800 text-slate-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border border-slate-700">
                ARCHIVED GAZETTE
              </span>
            )}
            <span className="text-[10px] sm:text-xs text-amber-300 font-semibold bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
              {selectedVersion.edition || '1st Harmonized Edition'}
            </span>
          </div>

          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-snug">
            The Unification Constitution of YOSU
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
            Federal University Dutse Chapter. Ratified by the House of Representatives on Friday, 10 July 2026 and assented by President Asiwaju Abdulsalam Abdulgafar Oluwagbenga on Saturday, 11 July 2026.
          </p>

          {/* Metadata Cards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">EFFECTIVE DATE</span>
              <span className="text-xs font-bold text-amber-300 truncate block">{selectedVersion.effectiveDate}</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">ASSENTED BY</span>
              <span className="text-xs font-bold text-white truncate block">{selectedVersion.assentedBy || 'President'}</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">SPEAKER CERTIFICATE</span>
              <span className="text-xs font-bold text-white truncate block">{selectedVersion.speakerCertBy || 'Speaker'}</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">READING TIME</span>
              <span className="text-xs font-bold text-emerald-400 truncate block">~{estimatedReadingTime} mins read</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href={selectedVersion.pdfUrl || '/downloads/YOSU_Unification_Constitution_2026.pdf'}
              download
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Gazette ({localDownloadsCount})</span>
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONSTITUTION NAVIGATION TABS */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-sm flex flex-wrap items-center gap-2" role="tablist">
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
                  : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
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
          {/* SEARCH & DROPDOWN FILTER TOOLBAR */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
                  ENTERPRISE SEARCH & INDEXING
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  Interactive Legal Provisions
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors text-slate-700 border border-stone-200 flex items-center gap-1 text-xs font-bold"
                  title="Toggle Fullscreen Reading"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">Fullscreen</span>
                </button>
              </div>
            </div>

            {/* CONTROL ROW: SEARCH INPUT + DROPDOWN INDEX SELECTOR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search Input (8 cols) */}
              <div className="md:col-span-7 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search provisions (e.g. Article 14, Section 2, President, Quorum, Finance...)"
                  className="w-full pl-12 pr-24 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                />
                {searchLower && (
                  <div className="absolute right-3 top-2.5 flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                      {matchCount} Matches
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* DROPDOWN CHAPTER/ARTICLE SELECTOR FILTER (5 cols) */}
              <div className="md:col-span-5 relative">
                <div className="relative">
                  <ListFilter className="w-4 h-4 text-emerald-800 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={activeArticleId}
                    onChange={(e) => scrollToArticle(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 bg-stone-50 hover:bg-stone-100 text-slate-900 border border-stone-300 rounded-2xl text-xs font-serif font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>-- Select Chapter / Article to View --</option>
                    {chapterGroups.map((grp) => (
                      <optgroup key={grp.label} label={grp.label}>
                        {grp.articles.map((art) => (
                          <option key={art.id} value={art.id}>
                            Article {art.articleNumber}: {art.title} ({art.sections.length} Secs)
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* MAIN ARTICLES CONTENT STREAM (FULL WIDTH CLEAN LAYOUT) */}
          <main className="space-y-6 max-w-5xl mx-auto">
            {filteredArticles.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-4 shadow-sm">
                <Shield className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-slate-900">No Matching Constitutional Provisions</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-light">
                  We couldn&apos;t find any articles or sections matching &quot;{search}&quot;. Try searching for broader terms like &quot;President&quot;, &quot;Finance&quot;, &quot;Discipline&quot;, or &quot;Article 14&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer"
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
                    className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
                  >
                    {/* Article Header Bar */}
                    <div
                      onClick={() => toggleArticle(art.id)}
                      className="bg-stone-50/90 p-5 border-b border-stone-200 flex items-center justify-between cursor-pointer select-none hover:bg-stone-100 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-9 h-9 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800 shadow-sm">
                          {art.articleNumber}
                        </span>
                        <div>
                          <h3 className="font-serif font-bold text-base text-slate-900">
                            Article {art.articleNumber}: {highlightText(art.title)}
                          </h3>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {art.sections.length} Codified Sub-Sections
                          </span>
                        </div>
                      </div>

                      <button type="button" className="text-slate-400 hover:text-slate-700 p-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Article Body & Sections */}
                    {isExpanded && (
                      <div className="p-6 space-y-4">
                        {art.overview && (
                          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 leading-relaxed font-light">
                            <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-700 mb-1">
                              ARTICLE OVERVIEW
                            </span>
                            {highlightText(art.overview)}
                          </div>
                        )}

                        <div className="space-y-4 pt-1">
                          {art.sections.map((sec) => (
                            <div
                              key={sec.id}
                              className="p-4 sm:p-5 rounded-2xl border bg-stone-50/70 border-stone-200 space-y-2"
                            >
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-emerald-950">
                                Section {sec.sectionNumber}: {highlightText(sec.title)}
                              </h4>
                              <div className="text-sm text-slate-800 font-light whitespace-pre-line leading-relaxed">
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
      )}

      {/* TAB 2: VERSION ARCHIVE */}
      {activeTab === 'archive' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              CONSTITUTIONAL VERSION ARCHIVE
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Historical Ratified Editions</h2>
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
                    ? 'border-2 border-emerald-700 bg-emerald-50/20 shadow-md'
                    : 'border-stone-200 bg-stone-50/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                    {ver.versionName}
                  </span>
                  {ver.isCurrent ? (
                    <span className="bg-emerald-950 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase border border-emerald-800">
                      CURRENT RATIFIED LAW
                    </span>
                  ) : (
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      SUPERSEDED HISTORICAL
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">{ver.versionName}</h3>
                  <p className="text-xs text-slate-500">
                    Edition: {ver.edition || '1st Harmonized'} • Effective Date: {ver.effectiveDate}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-slate-600">
                  <span>Contains {ver.articles.length} Enacted Articles</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVersionId(ver.id);
                      setActiveTab('text');
                    }}
                    className="bg-slate-900 text-amber-300 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              LEGAL CLAUSE COMPARISON TOOL
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Side-by-Side Version Diff</h2>
            <p className="text-xs text-slate-500">
              Compare constitutional provisions between two ratified versions.
            </p>
          </div>

          {/* Version Selector Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1 text-slate-700">Base Version (Left)</label>
              <select
                value={selectedVersion.id}
                onChange={(e) => setActiveVersionId(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
              >
                {allVersions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.versionName} ({v.isCurrent ? 'Current' : 'Archived'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold block mb-1 text-slate-700">Compared Version (Right)</label>
              <select
                value={compareVersionId}
                onChange={(e) => setCompareVersionId(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
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
            <div className="space-y-4 border-r border-stone-200 pr-0 lg:pr-6">
              <h3 className="font-serif font-bold text-base text-amber-700">
                {selectedVersion.versionName} ({selectedVersion.articles.length} Articles)
              </h3>
              {selectedVersion.articles.map((art) => (
                <div key={art.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <h4 className="font-serif font-bold text-xs text-slate-900">Article {art.articleNumber}: {art.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{art.overview || 'Standard Enacted Provisions'}</p>
                </div>
              ))}
            </div>

            {/* Version B */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-base text-emerald-800">
                {allVersions.find((v) => v.id === compareVersionId)?.versionName}
              </h3>
              {(allVersions.find((v) => v.id === compareVersionId)?.articles || []).map((art) => (
                <div key={art.id} className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-2">
                  <h4 className="font-serif font-bold text-xs text-slate-900">Article {art.articleNumber}: {art.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{art.overview || 'Standard Enacted Provisions'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AMENDMENTS MODULE */}
      {activeTab === 'amendments' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              LEGISLATIVE AMENDMENTS HISTORY
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Ratified Amendments</h2>
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
                <div key={am.id} className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase border border-amber-300">
                      PROPOSED BY: {am.proposedBy}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Ratified: {am.dateRatified || 'Completed'}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900">{am.amendmentSummary}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-light whitespace-pre-line">{am.fullText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: CONSTITUTION ANALYTICS DASHBOARD */}
      {activeTab === 'analytics' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              DATABASE ANALYTICS & METRICS
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Constitution Platform Analytics</h2>
            <p className="text-xs text-slate-500">
              Real-time metrics query directly from Neon PostgreSQL.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-amber-600">{selectedVersion.articles.length}</span>
              <span className="text-xs text-slate-500 block font-medium">Enacted Articles</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-emerald-700">{stats.totalSections}</span>
              <span className="text-xs text-slate-500 block font-medium">Sub-Sections</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-blue-700">{stats.totalAmendments}</span>
              <span className="text-xs text-slate-500 block font-medium">Amendments</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-purple-700">{allVersions.length}</span>
              <span className="text-xs text-slate-500 block font-medium">Versions</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-teal-700">{selectedVersion.viewsCount}</span>
              <span className="text-xs text-slate-500 block font-medium">Page Views</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
              <span className="text-2xl font-extrabold font-serif text-rose-700">{localDownloadsCount}</span>
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
