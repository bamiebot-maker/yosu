import React from 'react';
import { db } from '@/lib/db';
import { Download, FileText, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DownloadsPage() {
  const downloads = await db.downloadResource.findMany({
    where: { isPublic: true },
    include: { fileMedia: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 font-sans">
      {/* Header Banner (TASK 5 - COMPACT MOBILE HEADER CARD) */}
      <div className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-2.5 sm:space-y-4 relative z-10">
          <span className="bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-amber-400" />
            OFFICIAL GAZETTES & DOCUMENTS
          </span>
          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-white">YOSU Downloads & Gazette Portal</h1>
          <p className="text-stone-200 text-xs sm:text-sm font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
            Access official constitution PDF documents, executive gazettes, membership registration forms, and reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {downloads.map((dl) => (
          <div key={dl.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-amber-100 text-amber-900 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded">
                {dl.category}
              </span>
              <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug">{dl.title}</h3>
              {dl.description && <p className="text-xs text-slate-600">{dl.description}</p>}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">{dl.downloadsCount} Downloads</span>
              <a
                href={dl.fileMedia.url}
                download
                className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
