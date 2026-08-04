import React from 'react';
import Image from 'next/image';
import { db } from '@/lib/db';
import { Shield, Target, Eye, BookOpen, Award, Building2 } from 'lucide-react';

export const revalidate = 60;

export default async function AboutPage() {
  const currentSession = await db.administrationSession.findFirst({ where: { isCurrent: true } });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="emerald-gradient-bg text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded border border-amber-400/30 uppercase tracking-wider">
            INSTITUTIONAL OVERVIEW
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            About Yoruba Students' Union (YOSU)
          </h1>
          <p className="text-stone-200 text-sm sm:text-base leading-relaxed font-light">
            The recognized umbrella body representing the collective interests, welfare, and cultural heritage of all bona fide Yoruba students at the Federal University Dutse, Jigawa State.
          </p>
        </div>
      </div>

      {/* Vision & Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-emerald-950">Our Vision</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            To build a unified, progressive, and resilient student union that empowers Yoruba scholars through academic excellence, responsible leadership, cultural pride, and unwavering integrity within Federal University Dutse and beyond.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-emerald-950">Our Mission</h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            To safeguard the welfare of all members, promote intellectual and academic growth, celebrate Yoruba cultural traditions, and foster harmonious coexistence with University authorities and host communities.
          </p>
        </div>
      </div>

      {/* Motto & Core Values */}
      <div className="bg-stone-900 text-white rounded-2xl p-8 sm:p-10 space-y-6">
        <div className="border-b border-stone-800 pb-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">OFFICIAL MOTTO</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white italic">
            "Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ"
          </h2>
          <p className="text-xs text-stone-300 mt-1">Signifying unity, love, cooperation, and collective progress among members.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-sm text-amber-300">1. Unity & Inclusiveness</h3>
            <p className="text-stone-300">Ensuring equal representation across all 8 constituent Yoruba states without discrimination.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-sm text-amber-300">2. Academic Excellence</h3>
            <p className="text-stone-300">Promoting intellectual development, mentorship, research, and scholarship opportunities.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-sm text-amber-300">3. Cultural Integrity</h3>
            <p className="text-stone-300">Preserving, celebrating, and passing on rich Yoruba customs, language, and heritage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
