import React from 'react';
import { db } from '@/lib/db';
import { Flag } from 'lucide-react';

export const revalidate = 0;

export default async function AdminFeatureFlagsPage() {
  const flags = await db.featureFlag.findMany({ orderBy: { updatedAt: 'desc' } });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <h2 className="font-serif font-bold text-xl text-slate-900">System Feature Flags & Toggles</h2>
        <p className="text-xs text-slate-500">Dynamically activate or deactivate platform modules without code deployments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flags.map((f) => (
          <div key={f.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900">{f.name}</span>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${f.isEnabled ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200 text-slate-700'}`}>
                {f.isEnabled ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
            <p className="text-xs text-slate-600">{f.description}</p>
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
              {f.key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
