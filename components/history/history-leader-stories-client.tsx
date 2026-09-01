'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, Sparkles, Share2, MessageCircle, Globe, Copy, CheckCircle2, X, ArrowRight, BookOpen, Quote } from 'lucide-react';

interface LeaderStory {
  id: string;
  title: string;
  author: string;
  officeTitle: string;
  sessionTitle: string;
  avatarUrl: string;
  excerpt: string;
  fullText: string;
  publishedDate: string;
}

const LEADER_STORIES: LeaderStory[] = [
  {
    id: 'story-1',
    title: 'The Sovereign Union Mandate & Student Welfare',
    author: 'Cmrd. Ibrahim Sobur Bamidele',
    officeTitle: 'Executive President (2026/2027)',
    sessionTitle: '2026/2027 Academic Session',
    avatarUrl: '/images/leadership/president-sobur.jpg',
    excerpt: 'Leadership is not about holding office; it is about standing firm for student welfare, transparent governance, and preserving the sacred Omoluabi heritage.',
    fullText: `Leadership is not about holding office; it is about standing firm for student welfare, transparent governance, and preserving the sacred Omoluabi heritage across all 8 constituent states at Federal University Dutse.

During our administration, we confronted pivotal challenges head-on:
1. We launched the Digital Identity Card System to eliminate member verification bottlenecks.
2. We secured dedicated academic bursary allocations and tutorial support programs for struggling students.
3. We organized the largest Yoruba Cultural Heritage Day in FUD history, showcasing royal court procession traditions to the entire university community.

To every Yoruba student studying in Northern Nigeria: remember that your character, your integrity, and your commitment to excellence define the true spirit of Omoluabi. Never compromise your values for temporary gain.`,
    publishedDate: 'August 2026',
  },
  {
    id: 'story-2',
    title: 'Building Legislative Sovereignty & State Unity',
    author: 'Rt. Hon. Alabi Oyeniyi',
    officeTitle: 'Speaker of the House (2026/2027)',
    sessionTitle: '2026/2027 Academic Session',
    avatarUrl: '/images/leadership/speaker-alabi.jpg',
    excerpt: 'The House of Representatives serves as the legislative shield of every Yoruba student studying in Northern Nigeria.',
    fullText: `The House of Representatives serves as the legislative shield of every Yoruba student studying in Northern Nigeria. We ensured that every state delegation—from Ekiti to Kogi—had an equal voice in ratifying laws and approving union budgets.

When we assumed office as Principal Officers of the House:
- We instituted bi-weekly plenary sessions to review member petitions and welfare complaints.
- We codified the revised Standing Orders to guarantee constitutional order during parliamentary debates.
- We fostered an unbreakable legislative bond between delegates representing Ekiti, Kwara, Oyo, Osun, Ondo, Ogun, Lagos, and Kogi (Okun Land).

Democracy thrives when every voice is heard and every constituent state delegate fulfills their sworn oath of service with honor.`,
    publishedDate: 'July 2026',
  },
  {
    id: 'story-3',
    title: 'Preserving Cultural Majesty in Northern Nigeria',
    author: 'His Royal Majesty OBA Fouad Adegoke Adedotun',
    officeTitle: 'OBA of YOSU FUD',
    sessionTitle: 'Royal Court Custodian',
    avatarUrl: '/images/leadership/oba-procession.jpg',
    excerpt: 'Our culture is our dignity. As traditional custodians, we uphold Yoruba royal court traditions with pride.',
    fullText: `Our culture is our dignity. As traditional custodians of YOSU FUD, we uphold Yoruba royal court traditions with pride, ensuring our royal court procession and Olori court shine brilliantly at every university convention.

Wherever we find ourselves across the globe, our traditional attire, our greetings, our respect for elders, and our rich royal lineage must remain unblemished. 

The Royal Court of YOSU FUD stands as a permanent institution of cultural pride, advisory wisdom, and conflict resolution for all Yoruba sons and daughters at Federal University Dutse. May wisdom and peace continue to reign in our union!`,
    publishedDate: 'June 2026',
  },
];

export function HistoryLeaderStoriesClient() {
  const [activeModalStory, setActiveModalStory] = useState<LeaderStory | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const handleShare = (story: LeaderStory) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `YOSU Leader Story: ${story.title}`,
        text: `"${story.title}" by ${story.author} (${story.officeTitle})\n\nRead full story on YOSU FUD History Portal:`,
        url,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`"${story.title}" by ${story.author} - ${url}`);
      setCopyToast('Story link copied to clipboard!');
      setTimeout(() => setCopyToast(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-sans">
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 text-amber-300 border border-amber-400/50 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

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
        <span className="font-semibold text-slate-900">3. Voices & Stories from Past Leaders</span>
      </nav>

      {/* EDITORIAL HEADER (NO DARK HERO BANNER) */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <span className="bg-emerald-950 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          HISTORICAL SUBPAGE 3 OF 5
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mt-2">
          Voices & Stories from Past Leaders
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-light max-w-3xl leading-relaxed">
          Reflections, inaugural speeches, and victory memoirs from past YOSU Presidents, Speakers, and Union Stalwarts.
        </p>
      </div>

      {/* EDITORIAL NEWS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEADER_STORIES.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 flex flex-col justify-between space-y-5 hover:shadow-lg transition-all border-t-4 border-t-emerald-900 group"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-amber-400 bg-slate-950 shrink-0">
                  {story.avatarUrl ? (
                    <Image src={story.avatarUrl} alt={story.author} fill className="object-cover" />
                  ) : (
                    <Quote className="w-5 h-5 text-amber-400 m-auto mt-3" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">{story.author}</h3>
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">{story.officeTitle}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-lg text-slate-900 leading-snug group-hover:text-emerald-900 transition-colors">
                  &ldquo;{story.title}&rdquo;
                </h4>
                <p className="text-xs text-slate-600 font-light leading-relaxed line-clamp-4">
                  {story.excerpt}
                </p>
              </div>
            </div>

            {/* Read Full Story Button & Share Bar */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveModalStory(story)}
                className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-amber-300 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>

              <button
                type="button"
                onClick={() => handleShare(story)}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Share Story"
              >
                <Share2 className="w-4 h-4 text-amber-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULL STORY READING MODAL */}
      {activeModalStory && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto"
          onClick={() => setActiveModalStory(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xl my-8 p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-amber-400 bg-slate-950 shrink-0">
                  {activeModalStory.avatarUrl ? (
                    <Image src={activeModalStory.avatarUrl} alt={activeModalStory.author} fill className="object-cover" />
                  ) : (
                    <Quote className="w-6 h-6 text-amber-400 m-auto mt-3.5" />
                  )}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">{activeModalStory.author}</h3>
                  <span className="text-xs font-extrabold text-emerald-800 uppercase block">{activeModalStory.officeTitle}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{activeModalStory.sessionTitle} • Published {activeModalStory.publishedDate}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalStory(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Title & Full Text */}
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-2xl text-slate-900 leading-snug">
                &ldquo;{activeModalStory.title}&rdquo;
              </h2>

              <div className="prose prose-slate max-w-none text-sm text-slate-700 font-light leading-relaxed whitespace-pre-line bg-stone-50 p-6 rounded-2xl border border-stone-200">
                {activeModalStory.fullText}
              </div>
            </div>

            {/* Share Footer */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-amber-600" /> Share this historical memoir:
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(activeModalStory)}
                  className="px-4 py-2 bg-emerald-950 text-amber-300 text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`"${activeModalStory.title}" - ${activeModalStory.author} (${activeModalStory.officeTitle})\n\nRead full memoir on YOSU FUD History Portal!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Page Link */}
      <div className="pt-6 border-t border-stone-200 flex justify-end">
        <Link
          href="/history/timeline"
          className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-extrabold rounded-2xl transition-all shadow-md flex items-center gap-2"
        >
          <span>Next Page: 4. Chronological Timeline</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </Link>
      </div>
    </div>
  );
}
