import React from 'react';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  await requireRole(['SUPER_ADMIN']);

  const settings = await db.siteSetting.findMany({ orderBy: { group: 'asc' } });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <h2 className="font-serif font-bold text-xl text-slate-900">Site Settings & Branding Configurations</h2>
        <p className="text-xs text-slate-500">Configure global metadata, motto, hero copy, contact details, and SEO defaults (Super Admin Exclusive)</p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {settings.map((s) => (
            <div key={s.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-700">{s.group} — {s.label}</span>
              <p className="font-semibold text-slate-900">{s.value}</p>
              <span className="text-[10px] text-slate-400 font-mono">{s.key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
