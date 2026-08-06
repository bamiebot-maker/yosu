import React from 'react';
import { db } from '@/lib/db';
import { BookOpen, Download, Shield, CheckCircle2 } from 'lucide-react';
import { InteractiveConstitutionViewer } from '@/components/constitution/interactive-constitution-viewer';

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
  }).catch(() => null);

  const articles = currentVersion?.articles || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-64 h-64 text-amber-300" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Supreme Governing Document</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Unification Constitution (2026)
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
            As amended and ratified by the House of Representatives on Friday, 10 July 2026 and assented by President Asiwaju Abdulsalam Abdulgafar Oluwagbenga on Saturday, 11 July 2026.
          </p>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <a
              href={currentVersion?.pdfMedia?.url || '/downloads/YOSU_Unification_Constitution_2026.pdf'}
              download
              className="px-6 py-3 bg-[#E5A91A] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Gazette</span>
            </a>
            <div className="text-xs text-amber-300 flex items-center gap-1.5 font-medium bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Effective Date: July 11, 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Signatories & Ratification Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm text-xs text-slate-700">
        <div className="space-y-2 border-l-4 border-emerald-900 pl-4">
          <span className="font-bold text-emerald-950 uppercase tracking-wider block text-[10px]">PRESIDENTIAL ASSENT</span>
          <p className="font-serif text-base font-bold text-slate-900">
            Asiwaju Abdulsalam Abdulgafar Oluwagbenga
          </p>
          <p className="text-slate-500">President, Yoruba Students&apos; Union (YOSU), Federal University Dutse Chapter</p>
          <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Assented: 11 July 2026
          </span>
        </div>

        <div className="space-y-2 border-l-4 border-[#E5A91A] pl-4">
          <span className="font-bold text-amber-700 uppercase tracking-wider block text-[10px]">SPEAKER&apos;S CERTIFICATE</span>
          <p className="font-serif text-base font-bold text-slate-900">
            Rt. Hon. Ibrahim Sobur Bamidele
          </p>
          <p className="text-slate-500">Speaker, House of Representatives (2025/2026 Session)</p>
          <span className="inline-block text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
            Certified & Transmitted: 11 July 2026
          </span>
        </div>
      </div>

      {/* Interactive Constitution Viewer Component */}
      <InteractiveConstitutionViewer
        articles={articles}
        pdfUrl={currentVersion?.pdfMedia?.url || '/downloads/YOSU_Unification_Constitution_2026.pdf'}
      />
    </div>
  );
}
