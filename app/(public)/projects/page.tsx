import React from 'react';
import { db } from '@/lib/db';
import { FolderKanban, CheckCircle2, Clock, ShieldCheck, DollarSign } from 'lucide-react';

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    include: { milestones: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 font-sans">
      {/* Header Banner (TASK 5 - COMPACT MOBILE HEADER CARD) */}
      <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 sm:space-y-4 relative z-10">
          <span className="bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider inline-flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5 text-amber-400" />
            PUBLIC TRANSPARENCY DASHBOARD
          </span>
          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-white">YOSU Developmental Projects</h1>
          <p className="text-stone-200 text-xs sm:text-sm font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
            Tracking execution milestones, progress percentages, and budget utilization across all executive projects.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="bg-emerald-900 text-amber-300 font-bold text-[10px] uppercase px-2.5 py-1 rounded">
                  {proj.status}
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 mt-2">{proj.title}</h2>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 font-semibold block">Overall Progress</span>
                <span className="text-2xl font-extrabold text-amber-600">{proj.progressPercentage}%</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{proj.description}</p>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-stone-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-800 to-amber-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${proj.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Milestones List */}
            {proj.milestones.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-sm text-slate-900">Project Execution Milestones</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {proj.milestones.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                        m.isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-stone-50 border-stone-200 text-slate-600'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${m.isCompleted ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span className="font-semibold">{m.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
