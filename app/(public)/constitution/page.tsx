import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { BookOpen, Download, FileText, CheckCircle2, Shield, Search, ArrowLeft } from 'lucide-react';

export const revalidate = 60;

export default async function ConstitutionPage() {
  const currentVersion = await db.constitutionVersion.findFirst({
    where: { isCurrent: true },
    include: {
      articles: {
        include: { sections: { orderBy: { displayOrder: 'asc' } } },
        orderBy: { articleNumber: 'asc' },
      },
      pdfMedia: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="emerald-gradient-bg text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-64 h-64 text-amber-300" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Supreme Governing Document</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
            The Unification Constitution (2026)
          </h1>

          <p className="text-stone-200 text-sm sm:text-base leading-relaxed font-light">
            As amended and ratified by the House of Representatives on Friday, 10 July 2026 and assented by President Asiwaju Abdulsalam Abdulgafar Oluwagbenga on Saturday, 11 July 2026.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <a
              href={currentVersion?.pdfMedia?.url || '/downloads/YOSU_Unification_Constitution_2026.pdf'}
              download
              className="px-5 py-2.5 bg-[#E5A91A] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Gazette</span>
            </a>
            <div className="text-xs text-amber-200 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Effective Date: July 11, 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Signatories & Ratification Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-xs text-slate-700">
        <div className="space-y-2 border-l-4 border-emerald-900 pl-4">
          <span className="font-bold text-emerald-950 uppercase tracking-wider block text-[10px]">PRESIDENTIAL ASSENT</span>
          <p className="font-serif text-sm font-bold text-slate-900">
            Asiwaju Abdulsalam Abdulgafar Oluwagbenga
          </p>
          <p className="text-slate-500">President, Yoruba Students' Union (YOSU), Federal University Dutse Chapter</p>
          <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Assented: 11 July 2026
          </span>
        </div>

        <div className="space-y-2 border-l-4 border-[#E5A91A] pl-4">
          <span className="font-bold text-amber-700 uppercase tracking-wider block text-[10px]">SPEAKER'S CERTIFICATE</span>
          <p className="font-serif text-sm font-bold text-slate-900">
            Rt. Hon. Ibrahim Sobur Bamidele
          </p>
          <p className="text-slate-500">Speaker, House of Representatives (2025/2026 Session)</p>
          <span className="inline-block text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
            Certified & Transmitted: 11 July 2026
          </span>
        </div>
      </div>

      {/* Articles & Sections Accordion */}
      <div className="space-y-8">
        <div className="border-b border-stone-200 pb-3 flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">STRUCTURED CLAUSES</span>
            <h2 className="text-2xl font-serif font-bold text-emerald-950">Table of Articles & Provisions</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {currentVersion?.articles.length || 0} Articles Parsed
          </span>
        </div>

        <div className="space-y-6">
          {currentVersion?.articles.map((art) => (
            <div key={art.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="bg-stone-50 border-b border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900 text-white px-2 py-0.5 rounded">
                    ARTICLE {art.articleNumber}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-slate-900 mt-1">
                    {art.title}
                  </h3>
                </div>
                {art.overview && (
                  <p className="text-xs text-slate-500 max-w-md italic">{art.overview}</p>
                )}
              </div>

              <div className="p-4 sm:p-6 space-y-4 divide-y divide-stone-100">
                {art.sections.map((sec) => (
                  <div key={sec.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {sec.sectionNumber}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-slate-900">{sec.title}</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-2 border-l-2 border-amber-300">
                      {sec.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
