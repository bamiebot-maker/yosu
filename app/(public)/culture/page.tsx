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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="emerald-gradient-bg text-white rounded-2xl p-8 sm:p-12 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded border border-amber-400/30 uppercase tracking-wider">
            HERITAGE & TRADITION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Yoruba Culture & Traditional Titles</h1>
          <p className="text-stone-200 text-sm sm:text-base font-light">
            Pursuant to Article 13 Section 4 & 5 of the YOSU Constitution, traditional titles are purely ceremonial and honorary in nature.
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
