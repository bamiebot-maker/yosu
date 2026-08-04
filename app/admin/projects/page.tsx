import React from 'react';
import { db } from '@/lib/db';
import { FolderKanban, Plus } from 'lucide-react';

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-xl text-slate-900">Projects Transparency Tracker</h2>
          <p className="text-xs text-slate-500">Manage development projects, budget utilization, and milestones</p>
        </div>
        <button className="px-4 py-2 bg-emerald-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>New Project</span>
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">{p.status}</span>
              <h3 className="font-serif font-bold text-base text-slate-900 mt-1">{p.title}</h3>
              <span className="text-xs text-slate-500">Progress: {p.progressPercentage}%</span>
            </div>
            <button className="text-xs font-bold text-emerald-900 hover:underline">Edit Milestones</button>
          </div>
        ))}
      </div>
    </div>
  );
}
