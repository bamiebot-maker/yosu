import React from 'react';
import { db } from '@/lib/db';
import { Award, Crown, Sparkles, Shield } from 'lucide-react';

export const revalidate = 60;

export default async function CulturePage() {
  const titles = [
    { title: 'Oba', description: 'Royal Monarchial figure and traditional custodian of Yoruba culture within the student body.' },
    { title: 'Bashorun', description: 'Prime Minister and Chief Senior Cultural Ambassador.' },
    { title: 'Bobagunwa', description: 'Royal adviser on heritage affairs and traditional protocol.' },
    { title: 'Afobaje', description: 'Head of kingmakers and ceremonial installations.' },
    { title: 'Otun & Osi', description: 'Senior royal lieutenants supporting traditional governance.' },
    { title: 'Iyalode', description: 'Supreme leader of female students and cultural matriarch.' },
    { title: 'Olori I & Olori II', description: 'Queen presiders over cultural ceremonies.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 font-sans">
      {/* Header Banner (TASK 5 - COMPACT MOBILE HEADER CARD) */}
      <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 sm:space-y-4 relative z-10">
          <span className="bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            HERITAGE & TRADITION
          </span>
          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-white">Yoruba Culture & Traditional Titles</h1>
          <p className="text-stone-200 text-xs sm:text-sm font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
            Pursuant to the YOSU Constitution, traditional titles are purely ceremonial and honorary in nature.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {titles.map((t) => (
          <div key={t.title} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900">{t.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
