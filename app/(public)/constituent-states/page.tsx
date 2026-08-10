import React from 'react';
import { db } from '@/lib/db';
import { Building2, ShieldCheck, MapPin } from 'lucide-react';

export const revalidate = 60;

export default async function ConstituentStatesPage() {
  const states = [
    { name: 'Kwara State', capital: 'Ilorin', tagline: 'State of Harmony', reps: ['Hon. Sodiq Ishaku Abubakr', 'Hon. Abdullahi Nuhu Ibrahim'] },
    { name: 'Kogi State (Okun)', capital: 'Lokoja / Kabba', tagline: 'Confluence of Excellence', reps: ['Hon. Abdulrauf Jamiu', 'Hon. Ayomide Taiwo Oluwabusayo'] },
    { name: 'Oyo State', capital: 'Ibadan', tagline: 'Pace Setter State', reps: ['Hon. Yusuf Ayanyosola Tairu', 'Hon. Moshood Bunyamin'] },
    { name: 'Osun State', capital: 'Osogbo', tagline: 'State of the Living Spring', reps: ['Hon. Alabi Oyeniyi (Clerk)', 'Hon. Sultan Olawale Akinkunmi'] },
    { name: 'Ondo State', capital: 'Akure', tagline: 'Sunshine State', reps: ['Hon. Bello Roheemah', 'Hon. Okunrotifa Opeyemi Deborah'] },
    { name: 'Ogun State', capital: 'Abeokuta', tagline: 'Gateway State', reps: ['Hon. Ahmed Faizah', 'Hon. Showole A\'Samad'] },
    { name: 'Lagos State', capital: 'Ikeja', tagline: 'Centre of Excellence', reps: ['Hon. Abdulazeez Mulikah'] },
    { name: 'Ekiti State', capital: 'Ado-Ekiti', tagline: 'Fountain of Knowledge', reps: ['Rt. Hon. Ibrahim Sobur Bamidele (Speaker)', 'Hon. Daniel Adeyemi'] },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 font-sans">
      {/* Header Banner (TASK 5 - COMPACT MOBILE HEADER CARD) */}
      <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 sm:space-y-4 relative z-10">
          <span className="bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            CONSTITUTIONAL DELEGATIONS
          </span>
          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-white">The 8 Constituent Yoruba States</h1>
          <p className="text-stone-200 text-xs sm:text-sm font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
            In accordance with the YOSU Constitution, every constituent state is entitled to equal representation in the House of Representatives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {states.map((st) => (
          <div key={st.name} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">2 Seats</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">{st.name}</h3>
              <p className="text-xs text-slate-500">{st.tagline}</p>
            </div>
            <div className="pt-3 border-t border-stone-100 text-xs text-slate-700 space-y-1">
              <span className="font-bold block text-[10px] text-amber-700 uppercase">2025/2026 Delegates:</span>
              {st.reps.map((r) => (
                <div key={r} className="text-slate-800 font-medium">
                  • {r}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
