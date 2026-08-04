'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Globe,
} from 'lucide-react';

export interface ExecutiveOfficerItem {
  id: string;
  fullName: string;
  title: string;
  stateOfOrigin: string;
  department?: string | null;
  level?: string | null;
  bio?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
}

interface ExecutiveCarouselProps {
  officers: ExecutiveOfficerItem[];
  sessionTitle: string;
}

export function ExecutiveCarousel({ officers, sessionTitle }: ExecutiveCarouselProps) {
  const [selectedOfficer, setSelectedOfficer] = useState<ExecutiveOfficerItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
            LEADERSHIP COUNCIL
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950">
            Executive Officers ({sessionTitle})
          </h2>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 bg-stone-100 hover:bg-emerald-900 hover:text-white rounded-xl transition-all border border-stone-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous Executive Officer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 bg-stone-100 hover:bg-emerald-900 hover:text-white rounded-xl transition-all border border-stone-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next Executive Officer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Slider Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none max-w-full"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {officers.map((officer) => (
          <div
            key={officer.id}
            onClick={() => setSelectedOfficer(officer)}
            className="snap-start shrink-0 w-[280px] sm:w-[320px] bg-slate-950 rounded-3xl border border-slate-800 shadow-lg hover:shadow-2xl hover:border-amber-400/80 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between relative"
          >
            {/* Full Card Image Background */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-gradient-to-t from-slate-950 via-emerald-950/70 to-slate-900">
              {officer.avatarUrl ? (
                <Image
                  src={officer.avatarUrl}
                  alt={officer.fullName}
                  fill
                  className="object-cover object-top group-hover:scale-108 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900 text-white p-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E5A91A_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="w-24 h-24 rounded-2xl bg-emerald-900/90 border border-amber-400/40 text-amber-300 font-serif font-bold text-4xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    {officer.fullName.charAt(0)}
                  </div>
                  <span className="text-[10px] font-semibold text-amber-300/80 uppercase tracking-widest mt-3">
                    YOSU Executive
                  </span>
                </div>
              )}

              {/* State Badge Top Right */}
              <div className="absolute top-3.5 right-3.5 z-10">
                <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md tracking-wider">
                  {officer.stateOfOrigin} State
                </span>
              </div>

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Bottom Card Identity Info */}
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5 z-10">
                <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider block">
                  {officer.title}
                </span>
                <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {officer.fullName}
                </h3>
                {officer.department && (
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 font-light">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{officer.department}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Card Footer Tap Action */}
            <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:bg-emerald-950 transition-colors">
              <span className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Tap for Full Profile</span>
              </span>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* EXECUTIVE PROFILE POP-UP MODAL */}
      {selectedOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedOfficer(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-slate-950/80 hover:bg-rose-900 text-white rounded-full transition-colors border border-slate-700 focus:outline-none"
              aria-label="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Banner & Avatar Header */}
            <div className="relative h-48 bg-gradient-to-br from-emerald-950 via-slate-950 to-emerald-900 p-6 flex items-end">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E5A91A_1px,transparent_1px)] [background-size:20px_20px]" />
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 bg-emerald-950 shadow-xl">
                  {selectedOfficer.avatarUrl ? (
                    <Image
                      src={selectedOfficer.avatarUrl}
                      alt={selectedOfficer.fullName}
                      fill
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif font-bold text-2xl text-amber-300">
                      {selectedOfficer.fullName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                    {selectedOfficer.title}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                    {selectedOfficer.fullName}
                  </h3>
                  <p className="text-xs text-amber-300 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedOfficer.stateOfOrigin} State Indigene</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body Info */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Academic Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Academic Department</span>
                  <span className="font-semibold text-white">{selectedOfficer.department || 'Federal University Dutse'}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Academic Level</span>
                  <span className="font-semibold text-amber-300">{selectedOfficer.level || 'Bona Fide Scholar'}</span>
                </div>
              </div>

              {/* Officer Bio / Brief Intro */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Official Executive Profile
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-xl border border-slate-800 italic">
                  "{selectedOfficer.bio || 'Serving in the official 2026/2027 Comdr Sobur-Led Administration of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter.'}"
                </p>
              </div>

              {/* Social Media & Contact Addresses */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Connect & Social Channels
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  {selectedOfficer.email && (
                    <a
                      href={`mailto:${selectedOfficer.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-emerald-900 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedOfficer.email}</span>
                    </a>
                  )}

                  {selectedOfficer.phoneNumber && (
                    <a
                      href={`tel:${selectedOfficer.phoneNumber}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-emerald-900 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedOfficer.phoneNumber}</span>
                    </a>
                  )}

                  {selectedOfficer.twitterUrl && (
                    <a
                      href={selectedOfficer.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-amber-400 hover:text-slate-950 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors"
                      aria-label="X Twitter Profile"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>X Profile</span>
                    </a>
                  )}

                  {selectedOfficer.linkedinUrl && (
                    <a
                      href={selectedOfficer.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-amber-400 hover:text-slate-950 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-right">
              <button
                onClick={() => setSelectedOfficer(null)}
                className="px-4 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
