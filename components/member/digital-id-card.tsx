'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Printer, RefreshCw, CheckCircle2, QrCode, Sparkles, User, FileText, Lock } from 'lucide-react';
import { generateQRCodeSVG } from '@/lib/qr';
import { UnifiedMemberData } from '@/lib/membership';

interface DigitalIdCardProps {
  memberData: UnifiedMemberData;
}

export function DigitalIdCard({ memberData }: DigitalIdCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { profile, membership } = memberData;

  // Generate dynamic QR code inline SVG
  const qrSvgString = generateQRCodeSVG(
    `https://yosu-fud.org/verify-member?id=${encodeURIComponent(membership.registrationNumber)}&matric=${encodeURIComponent(profile.matricNumber)}`
  );

  const handlePrint = () => {
    window.print();
  };

  // Format State of Origin cleanly to avoid "State State"
  const cleanStateOfOrigin = profile.stateOfOrigin
    ? `${profile.stateOfOrigin.replace(/\s*state$/i, '')} State`
    : 'Yoruba State';

  return (
    <div className="w-full max-w-lg mx-auto space-y-5 font-sans">
      {/* Action Header / Controls */}
      <div className="no-print bg-white p-3.5 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Verified Digital Member Pass
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-stone-300"
            title="Flip Card to View Back Disclaimer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>{isFlipped ? 'Front View' : 'Back View (Disclaimer)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-amber-400 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer border border-emerald-800"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* ID CARD CONTAINER (Targeted by @media print) */}
      <div className="id-card-print-container flex justify-center">
        <div className="relative w-full max-w-[450px] min-h-[260px] rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
          
          {/* ================= FRONT OF CARD ================= */}
          {!isFlipped ? (
            <div className="w-full min-h-[260px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 border-2 border-amber-400/40 p-4 text-white flex flex-col justify-between relative shadow-2xl rounded-3xl">
              {/* Background Decorative Crest / Pattern Overlay */}
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#E5A91A_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Header: Union Brand & Seal */}
              <div className="relative z-10 flex items-center justify-between border-b border-amber-400/20 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 bg-white p-0.5 rounded-xl shadow-md flex-shrink-0">
                    <Image
                      src="/images/logo.png"
                      alt="YOSU Crest"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-amber-300 tracking-tight leading-tight">
                      Yoruba Students' Union (YOSU)
                    </h3>
                    <p className="text-[9px] text-stone-300 font-sans tracking-wide">
                      Federal University Dutse Chapter • Digital Pass
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-1 bg-emerald-900/90 border border-emerald-500/60 text-emerald-300 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase shadow-inner">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
                  <span>{membership.status}</span>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="relative z-10 grid grid-cols-12 gap-3 py-2 items-center">
                {/* Passport Photo Frame (No level badge under photo) */}
                <div className="col-span-4 flex flex-col items-center justify-center">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-amber-400 shadow-lg bg-slate-900">
                    {profile.passportUrl ? (
                      <Image
                        src={profile.passportUrl}
                        alt={profile.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-950 text-amber-400 p-1">
                        <User className="w-10 h-10 opacity-80" />
                        <span className="text-[8px] font-bold mt-1 text-stone-300 uppercase">MEMBER</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Member Details */}
                <div className="col-span-8 space-y-1.5">
                  <div>
                    <span className="text-[8px] text-amber-400 uppercase tracking-wider font-semibold block">
                      FULL NAME
                    </span>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-white leading-tight truncate">
                      {profile.fullName}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[8px] text-stone-400 uppercase tracking-wider block">REG NO</span>
                      <span className="font-mono text-[10px] font-bold text-amber-300 truncate block">
                        {membership.registrationNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-[8px] text-stone-400 uppercase tracking-wider block">MATRIC NO</span>
                      <span className="font-mono text-[10px] font-bold text-white truncate block">
                        {profile.matricNumber}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[8px] text-stone-400 uppercase tracking-wider block">DEPARTMENT</span>
                      <span className="font-sans text-[10px] font-semibold text-stone-200 truncate block">
                        {profile.department}
                      </span>
                    </div>

                    <div>
                      <span className="text-[8px] text-stone-400 uppercase tracking-wider block">STATE OF ORIGIN</span>
                      <span className="font-sans text-[10px] font-semibold text-stone-200 truncate block">
                        {cleanStateOfOrigin}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Row: Session & Dynamic QR */}
              <div className="relative z-10 pt-2 border-t border-amber-400/20 flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-stone-400 uppercase tracking-wider block">
                    ACADEMIC SESSION
                  </span>
                  <span className="text-[11px] font-bold text-amber-300">
                    {membership.academicSession}
                  </span>
                </div>

                {/* Dynamic QR Code Render */}
                <div
                  className="w-9 h-9 bg-white p-0.5 rounded-lg border border-amber-400 shadow-md flex items-center justify-center overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: qrSvgString }}
                  title="Scan to Verify Member Authenticity"
                />
              </div>
            </div>
          ) : (
            /* ================= BACK OF CARD (DISCLAIMER & VERIFICATION) ================= */
            <div className="w-full min-h-[260px] bg-slate-950 border-2 border-amber-400/50 p-4 text-white flex flex-col justify-between relative shadow-2xl rounded-3xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                    CONSTITUTIONAL DISCLAIMER &amp; NOTICE
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">YOSU/FUD/DOC-2026</span>
              </div>

              {/* Disclaimer Body */}
              <div className="space-y-2 text-[10px] text-slate-300 font-light leading-relaxed my-auto py-1">
                <p className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                  <strong className="text-amber-300 font-semibold block mb-0.5">TERMS OF ISSUANCE &amp; PROPERTY NOTICE:</strong>
                  This digital identification pass is the official property of the Yoruba Students&apos; Union (YOSU), Federal University Dutse Chapter. It is issued strictly for student member identification, congress voting, and union activities.
                </p>

                <p className="text-slate-400 text-[9.5px]">
                  <strong>NON-TRANSFERABLE:</strong> This pass is strictly non-transferable. Any unauthorized reproduction, alteration, or fraudulent use will be subject to constitutional disciplinary proceedings.
                </p>
              </div>

              {/* Secretariat Return Info & Signatures */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2 text-[9px]">
                <div>
                  <span className="text-[8px] text-slate-400 block font-semibold uppercase">Return Address</span>
                  <span className="text-slate-300 block font-medium leading-tight">
                    YOSU Secretariat, Student Affairs Division, FUD Campus, Jigawa State.
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[8px] text-amber-400 block font-extrabold uppercase">APPROVED BY</span>
                  <span className="text-stone-300 font-serif italic text-[10px] block">Secretariat Council</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Instructions Note */}
      <div className="no-print bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-0.5">
          <p className="font-bold">Official Member Identification</p>
          <p className="text-amber-900 leading-relaxed text-[11px]">
            This digital membership pass is dynamically issued by the Executive Secretariat of YOSU FUD. Click <strong>"Back View (Disclaimer)"</strong> above to inspect official constitutional notices and return policy.
          </p>
        </div>
      </div>

      {/* Global CSS for Print isolation */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .id-card-print-container,
          .id-card-print-container * {
            visibility: visible;
          }
          .id-card-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
