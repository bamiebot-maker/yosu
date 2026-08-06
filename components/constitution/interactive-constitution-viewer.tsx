'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, FileText, CheckCircle2, Shield } from 'lucide-react';

interface Section {
  id: string;
  sectionNumber: string | number;
  title: string;
  content: string;
}

interface Article {
  id: string;
  articleNumber: number;
  title: string;
  content?: string | null;
  overview?: string | null;
  sections: Section[];
}

interface InteractiveConstitutionViewerProps {
  articles: Article[];
  pdfUrl?: string | null;
}

export function InteractiveConstitutionViewer({ articles, pdfUrl }: InteractiveConstitutionViewerProps) {
  const [search, setSearch] = useState('');
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group Articles into Chapters (e.g. Chapter I, Chapter II...)
  const chapters = [
    { title: 'Chapter I: General Supremacy & Membership', articleRange: [1, 5] },
    { title: 'Chapter II: Executive Power & Administration', articleRange: [6, 12] },
    { title: 'Chapter III: House of Representatives & Legislation', articleRange: [13, 18] },
    { title: 'Chapter IV: Finance, Audit & Transparency', articleRange: [19, 24] },
    { title: 'Chapter V: Discipline, Elections & Ratification', articleRange: [25, 30] },
  ];

  // Track Reading Scroll Progress & Active Chapter
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setReadingProgress(currentProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter & Search Logic with Result Count
  const searchLower = search.trim().toLowerCase();

  const isMatchingArticle = (art: Article) => {
    if (!searchLower) return true;
    const artText = `article ${art.articleNumber} ${art.title} ${art.content || ''}`.toLowerCase();
    if (artText.includes(searchLower)) return true;
    return art.sections.some((sec) =>
      `section ${sec.sectionNumber} ${sec.title} ${sec.content}`.toLowerCase().includes(searchLower)
    );
  };

  const filteredArticles = articles.filter(isMatchingArticle);

  // Calculate total matching items
  const matchCount = searchLower ? filteredArticles.length : 0;

  // Auto-expand all articles when searching
  useEffect(() => {
    if (searchLower) {
      const allExpanded: Record<string, boolean> = {};
      articles.forEach((art) => {
        allExpanded[art.id] = true;
      });
      setExpandedArticles(allExpanded);
    }
  }, [searchLower, articles]);

  const toggleArticle = (id: string) => {
    setExpandedArticles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToChapter = (index: number) => {
    setActiveChapterIndex(index);
    const range = chapters[index].articleRange;
    const targetArticle = articles.find((a) => a.articleNumber >= range[0]);
    if (targetArticle) {
      const el = document.getElementById(`article-${targetArticle.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Helper to highlight matching text
  const highlightText = (text: string) => {
    if (!searchLower) return text;
    const parts = text.split(new RegExp(`(${searchLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchLower ? (
            <mark key={i} className="bg-amber-300 text-slate-950 font-bold px-1 rounded">
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
    <div className="space-y-8 font-sans" ref={containerRef}>
      {/* Sticky Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-stone-200">
        <div
          className="h-1 bg-gradient-to-r from-amber-500 to-emerald-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Search Header Bar & Counter */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              ENTERPRISE LEGAL SEARCH & INDEXING
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Interactive Supreme Constitution Viewer
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
              Reading Progress: <strong className="text-emerald-950">{readingProgress}%</strong>
            </span>
            {pdfUrl && (
              <a
                href={pdfUrl}
                download
                className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow"
              >
                Download PDF Gazette
              </a>
            )}
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Chapter, Article (e.g. Article 14), Section, Roman numerals, Speaker, President, Discipline..."
            className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
          />
          {searchLower && (
            <span className="absolute right-4 top-3.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              {matchCount} {matchCount === 1 ? 'Result' : 'Results'} Found
            </span>
          )}
        </div>
      </div>

      {/* Main Layout: Sticky Sidebar & Main Articles Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Chapter Navigation Sidebar (TASK 8) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <h3 className="font-serif font-bold text-sm text-slate-900">Chapters & Sections Index</h3>
          </div>

          <div className="space-y-2">
            {chapters.map((ch, idx) => (
              <button
                key={ch.title}
                onClick={() => scrollToChapter(idx)}
                className={`w-full text-left p-3 rounded-2xl text-xs font-bold transition-all border ${
                  activeChapterIndex === idx
                    ? 'bg-emerald-950 text-white border-emerald-900 shadow-md'
                    : 'bg-stone-50 hover:bg-stone-100 text-slate-800 border-stone-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{ch.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    activeChapterIndex === idx ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-stone-200 text-slate-600'
                  }`}>
                    Art {ch.articleRange[0]}-{ch.articleRange[1]}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Articles Content Stream */}
        <div className="lg:col-span-8 space-y-6">
          {filteredArticles.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3">
              <Shield className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-slate-900">No Matching Constitutional Provisions Found</h3>
              <p className="text-xs text-slate-500">
                Try searching for broader keywords such as &quot;President&quot;, &quot;Finance&quot;, &quot;Election&quot;, or &quot;Chapter III&quot;.
              </p>
            </div>
          ) : (
            filteredArticles.map((art) => {
              const isExpanded = expandedArticles[art.id] ?? true;
              return (
                <div
                  key={art.id}
                  id={`article-${art.id}`}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Article Title Bar */}
                  <div
                    onClick={() => toggleArticle(art.id)}
                    className="bg-stone-50/80 p-5 border-b border-stone-200 flex items-center justify-between cursor-pointer select-none hover:bg-stone-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800">
                        {art.articleNumber}
                      </span>
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900">
                          Article {art.articleNumber}: {highlightText(art.title)}
                        </h3>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {art.sections.length} Sub-Sections Enacted
                        </span>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-slate-700 p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Article Preamble & Sections */}
                  {isExpanded && (
                    <div className="p-6 space-y-4">
                      {art.content && (
                        <p className="text-xs sm:text-sm text-slate-700 italic border-l-3 border-amber-400 pl-4 py-1 leading-relaxed bg-amber-50/50 rounded-r-xl">
                          {highlightText(art.content)}
                        </p>
                      )}

                      <div className="space-y-4 pt-2">
                        {art.sections.map((sec) => (
                          <div
                            key={sec.id}
                            className="p-4 bg-stone-50/50 rounded-2xl border border-stone-200/80 space-y-1.5"
                          >
                            <h4 className="font-serif font-bold text-xs sm:text-sm text-emerald-950">
                              Section {sec.sectionNumber}: {highlightText(sec.title)}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-light">
                              {highlightText(sec.content)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
