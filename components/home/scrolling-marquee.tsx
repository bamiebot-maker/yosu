'use client';

import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export function ScrollingMarquee({ text }: { text?: string }) {
  const items = [
    { code: 'NAKSS (KWARA)', name: 'National Association of Kwara State Students' },
    { code: 'FOSSU (OYO)', name: 'Federation of Oyo State Students Union' },
    { code: 'NAOSS (OSUN)', name: 'National Association of Osun State Students' },
    { code: 'FESSU (EKITI)', name: 'Federation of Ekiti State Students Union' },
    { code: 'NAOSS (ONDO)', name: 'National Association of Ondo State Students' },
    { code: 'NAOSS (OGUN)', name: 'National Association of Ogun State Students' },
    { code: 'NULASS (LAGOS)', name: 'National Union of Lagos State Students' },
    { code: 'OKUN STUDENTS (KOGI)', name: 'Okun Development Association Students Wing' },
  ];

  // Duplicate items array 3 times for seamless infinite loop
  const marqueeList = [...items, ...items, ...items];

  return (
    <div className="w-full bg-emerald-950 text-white border-y-2 border-amber-400/40 py-3 overflow-hidden relative shadow-lg z-20">
      <div className="flex items-center gap-2 absolute left-0 top-0 bottom-0 px-4 bg-emerald-950 border-r border-amber-400/30 z-20 shadow-xl shrink-0">
        <span className="bg-[#E5A91A] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-slate-950" />
          FEDERATED BODIES
        </span>
      </div>

      <div className="flex w-full pl-36 sm:pl-44 overflow-hidden select-none">
        <div className="flex shrink-0 animate-marquee items-center gap-6 whitespace-nowrap">
          {marqueeList.map((item, idx) => (
            <div
              key={idx + item.code}
              className="inline-flex items-center gap-2.5 bg-slate-900/90 border border-emerald-700/80 hover:border-amber-400 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-sm transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-mono text-white font-extrabold">{item.code}</span>
              <span className="text-[10px] text-slate-300 font-medium hidden sm:inline">• {item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
