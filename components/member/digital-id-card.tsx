'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Download, Printer, RefreshCw, CheckCircle2, Award, QrCode, Sparkles, Building2, User, BookOpen, MapPin, Hash } from 'lucide-react';
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

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Action Header / Controls */}
      <div className="no-print bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Verified Digital Pass
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            title="Flip Card View"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>{isFlipped ? 'Show Front' : 'Show Back'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-amber-400 text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* ID CARD CONTAINER (Targeted by @media print) */}
      <div className="id-card-print-container perspective-1000 flex justify-center">
        <div
          className={`relative w-full max-w-[480px] min-h-[300px] sm:min-h-[310px] rounded-3xl transition-transform duration-700 transform-style-3d shadow-2xl overflow-hidden ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================= FRONT OF CARD ================= */}
          <div className="w-full min-h-[300px] sm:min-h-[310px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 border-2 border-amber-400/40 p-5 text-white flex flex-col justify-between relative shadow-2xl">
            {/* Background Decorative Crest / Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#E5A91A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header: Union Brand & Seal */}
            <div className="relative z-10 flex items-center justify-between border-b border-amber-400/20 pb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 bg-white p-1 rounded-xl shadow-md flex-shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="YOSU Crest"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-sm sm:text-base font-bold text-amber-300 tracking-tight leading-tight">
                    Yoruba Students' Union (YOSU)
                  </h3>
                  <p className="text-[10px] text-stone-300 font-sans tracking-wide">
                    Federal University Dutse Chapter • Digital Pass
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1 bg-emerald-900/80 border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-inner">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span>{membership.status}</span>
              </div>
            </div>

            {/* Main Content Body */}
            <div className="relative z-10 grid grid-cols-12 gap-4 py-3 items-center">
              {/* Passport Photo Frame */}
              <div className="col-span-4 sm:col-span-4 flex flex-col items-center">
                <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-slate-900">
                  {profile.passportUrl ? (
                    <Image
                      src={profile.passportUrl}
                      alt={profile.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-950 text-amber-400">
                      <User className="w-12 h-12 opacity-80" />
                      <span className="text-[9px] font-bold mt-1 text-stone-300">YOSU PASSPORT</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    {membership.academicLevel}
                  </span>
                </div>
              </div>

              {/* Member Details */}
              <div className="col-span-8 sm:col-span-8 space-y-2">
                <div>
                  <span className="text-[9px] text-amber-400 uppercase tracking-wider font-semibold block">
                    Full Name
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-white leading-tight truncate">
                    {profile.fullName}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wider block">Reg No</span>
                    <span className="font-mono text-[11px] font-bold text-amber-300">
                      {membership.registrationNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wider block">Matric No</span>
                    <span className="font-mono text-[11px] font-bold text-white">
                      {profile.matricNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wider block">Department</span>
                    <span className="font-sans text-[11px] font-semibold text-stone-200 truncate block">
                      {profile.department}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] text-stone-400 uppercase tracking-wider block">State of Origin</span>
                    <span className="font-sans text-[11px] font-semibold text-stone-200 truncate block">
                      {profile.stateOfOrigin} State
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Row: QR Code & Session */}
            <div className="relative z-10 pt-2 border-t border-amber-400/20 flex items-center justify-between">
              <div>
                <span className="text-[9px] text-stone-400 uppercase tracking-wider block">
                  Academic Session
                </span>
                <span className="text-xs font-bold text-amber-300">
                  {membership.academicSession}
                </span>
              </div>

              {/* Dynamic QR Code Render */}
              <div
                className="w-10 h-10 bg-white p-0.5 rounded-lg border border-amber-400 shadow-md flex items-center justify-center overflow-hidden"
                dangerouslySetInnerHTML={{ __html: qrSvgString }}
                title="Scan to Verify Member Authenticity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Instructions Note */}
      <div className="no-print bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <p className="font-bold">Official Digital Identification</p>
          <p className="text-amber-900 leading-relaxed">
            This digital membership pass is dynamically issued by the Executive Council of Yoruba Students' Union (YOSU), Federal University Dutse Chapter. Present this card for congress voting, union events, and official verification.
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
