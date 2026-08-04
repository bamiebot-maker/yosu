import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { BookOpen, ShieldCheck, CheckCircle2, History, Award, Calendar, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const revalidate = 60;

export default async function HistoryPage() {
  const sessions = await db.administrationSession.findMany({
    include: {
      achievements: { orderBy: { displayOrder: 'asc' } },
      appointments: {
        where: { status: 'ACTIVE' },
        include: { person: true, office: true },
        orderBy: { displayOrder: 'asc' },
      },
    },
    orderBy: { startDate: 'desc' },
  });

  const timelineMilestones = [
    {
      year: '2025/2026',
      badge: 'HISTORIC FOUNDING & NAME APPROVAL',
      title: 'FUD Approval of Name Change from NAKOLES to YOSU',
      description:
        'The Federal University Dutse Students\' Affairs Division officially granted institutional approval for the change of name from NAKOLES (National Association of Kwara, Kogi, Oyo, Osun, Ondo, Ogun, Lagos, and Ekiti State Students) to the Yoruba Students\' Union (YOSU). Executed under President Asiwaju Abdulsalam Oluwagbenga.',
      category: 'INSTITUTIONAL FOUNDING',
    },
    {
      year: '2026',
      badge: 'CONSTITUTIONAL HARMONIZATION',
      title: 'Drafting of the 2026 Unification Constitution',
      description:
        'Comprehensive legislative review led by Speaker Rt. Hon. Ibrahim Sobur Bamidele and Clerk Hon. Alabi Oyeniyi. Codified the 8 Yoruba Constituent States representation framework and established independent CRC.',
      category: 'LEGISLATION',
    },
    {
      year: 'July 10, 2026',
      badge: 'UNANIMOUS LEGISLATIVE RATIFICATION',
      title: 'House of Representatives Ratification',
      description:
        'Motion for adoption moved by the Honourable Representative from Osun State, seconded by Ondo State, and unanimously passed by all state delegates in assembly at Federal University Dutse.',
      category: 'RATIFICATION',
    },
    {
      year: '2026/2027',
      badge: 'THE PROGRESS ERA',
      title: 'Inauguration of the Comdr Sobur-Led Administration',
      description:
        'Official swearing-in of Cmrd. Ibrahim Sobur Bamidele as Executive President alongside Vice President Latifat Usman Gidado, Executive Officers, and Traditional Title Holders.',
      category: 'ADMINISTRATION',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      {/* Header Banner */}
      <ScrollReveal animation="fade-up">
        <div className="emerald-gradient-bg text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-emerald-800">
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-wider inline-flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL HISTORICAL GAZETTE & TIMELINE</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              Institutional Evolution & Heritage
            </h1>
            <p className="text-stone-200 text-sm sm:text-base font-light leading-relaxed">
              The historical journey of the Yoruba Students' Union (YOSU), Federal University Dutse Chapter — from NAKOLES unification to the ratified 2026 Progress Era.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Main Timeline Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Database Timeline */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8">
            <div className="border-b border-stone-100 pb-4">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">CHRONOLOGICAL MILESTONES</span>
              <h2 className="text-2xl font-serif font-bold text-emerald-950">Major Union Milestones</h2>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-800/30">
              {timelineMilestones.map((m, idx) => (
                <ScrollReveal key={m.title} animation="fade-up" delayMs={idx * 80}>
                  <div className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-emerald-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-md group-hover:scale-125 transition-transform">
                      <Sparkles className="w-3 h-3" />
                    </div>

                    <div className="bg-stone-50 hover:bg-stone-100/80 p-5 sm:p-6 rounded-2xl border border-stone-200 hover:border-amber-400/50 transition-all space-y-2 hover-lift">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="bg-emerald-950 text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-emerald-800">
                          {m.badge}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          {m.year}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-snug">
                        {m.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                        {m.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Database Administrations & Achievements */}
        <div className="lg:col-span-4 space-y-6">
          <ScrollReveal animation="fade-up" delayMs={150}>
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">DATABASE SESSIONS</span>
                <h3 className="font-serif font-bold text-lg text-white">Administration Sessions</h3>
              </div>

              <div className="space-y-4">
                {sessions.map((sess) => (
                  <div key={sess.id} className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif font-bold text-sm text-white">{sess.title}</h4>
                      {sess.isCurrent ? (
                        <span className="bg-emerald-950 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-emerald-800">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="bg-slate-700 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                          ARCHIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-300 font-semibold">{sess.theme || 'Administration'}</p>

                    {sess.achievements.length > 0 && (
                      <div className="pt-2 border-t border-slate-700 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Achievements ({sess.achievements.length})</span>
                        <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-4">
                          {sess.achievements.map((a) => (
                            <li key={a.id}>{a.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
