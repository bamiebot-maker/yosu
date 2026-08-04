import React from 'react';
import { db } from '@/lib/db';
import { BookOpen, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminConstitutionPage() {
  const version = await db.constitutionVersion.findFirst({
    where: { isCurrent: true },
    include: { articles: { orderBy: { articleNumber: 'asc' } } },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <h2 className="font-serif font-bold text-xl text-slate-900">Interactive Constitution Editor</h2>
        <p className="text-xs text-slate-500">Managing current version: <strong>{version?.versionName}</strong></p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900">Active Articles ({version?.articles.length})</h3>
        <div className="space-y-2 text-xs">
          {version?.articles.map((art) => (
            <div key={art.id} className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-emerald-950">Article {art.articleNumber}: </span>
                <span className="text-slate-800">{art.title}</span>
              </div>
              <span className="text-amber-700 font-bold">Editable</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
