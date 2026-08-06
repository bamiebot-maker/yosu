'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Crown, X, BookOpen } from 'lucide-react';

interface WelcomeMessageModalProps {
  presidentName: string;
  officeTitle: string;
  stateOfOrigin: string;
  sessionTitle: string;
  portraitUrl: string | null;
  welcomeSummary: string;
  fullMessage: string;
  buttonClassName?: string;
  buttonText?: string;
}

export function WelcomeMessageModal({
  presidentName,
  officeTitle,
  stateOfOrigin,
  sessionTitle,
  portraitUrl,
  welcomeSummary,
  fullMessage,
  buttonClassName,
  buttonText = 'Read Presidential Address',
}: WelcomeMessageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultBtnClass =
    'px-5 py-3 bg-[#E5A91A] hover:bg-[#d49b14] text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-xl transition-all hover:scale-105 flex items-center gap-2';

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn text-left font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative overflow-hidden max-h-[90vh] flex flex-col justify-between z-[100000]">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 border-b border-stone-100 pb-4">
          {portraitUrl ? (
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md bg-slate-950">
              <Image
                src={portraitUrl}
                alt={presidentName}
                fill
                className="object-cover object-top"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center font-bold text-xl shrink-0 border border-amber-400/50">
              <Crown className="w-8 h-8" />
            </div>
          )}

          <div>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded uppercase tracking-wider block w-max mb-1">
              OFFICIAL PRESIDENTIAL ADDRESS
            </span>
            <h3 className="font-serif font-bold text-xl text-slate-900 leading-snug">
              {presidentName}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {officeTitle} • {stateOfOrigin} ({sessionTitle})
            </p>
          </div>
        </div>

        <div className="overflow-y-auto space-y-4 pr-2 text-slate-800 text-sm leading-relaxed font-light whitespace-pre-line flex-1">
          <p className="font-serif italic text-base text-emerald-950 font-medium border-l-4 border-amber-400 pl-4 py-1 bg-amber-50/40 rounded-r-xl">
            &quot;{welcomeSummary}&quot;
          </p>
          <div className="text-slate-900 font-normal space-y-3 pt-2">{fullMessage}</div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500">
            Ratified & Issued by the Office of the President
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            Close Speech
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClassName || defaultBtnClass}
      >
        <BookOpen className="w-4 h-4" />
        <span>{buttonText}</span>
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
