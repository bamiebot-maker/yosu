'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Building2, User, ArrowRight } from 'lucide-react';

export interface RepresentativeItem {
  id: string;
  fullName: string;
  positionTitle: string;
  stateOfOrigin: string;
  photoUrl?: string | null;
  displayOrder?: number;
}

interface RepresentativeCarouselProps {
  representatives: RepresentativeItem[];
  sessionTitle?: string;
}

export function RepresentativeCarousel({
  representatives,
  sessionTitle = '2026/2027 Session',
}: RepresentativeCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
            LEGISLATIVE LEGISLATURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-emerald-950">
            House of Representatives ({sessionTitle})
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Bicameral assembly delegates representing all 8 Yoruba constituent states.
          </p>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 bg-stone-100 hover:bg-emerald-900 hover:text-white rounded-xl transition-all border border-stone-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous Representative"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 bg-stone-100 hover:bg-emerald-900 hover:text-white rounded-xl transition-all border border-stone-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next Representative"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Representative Cards Carousel */}
      {representatives.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-xs text-slate-500">
          No active session representatives enrolled.
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-3 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {representatives.map((rep) => (
            <div
              key={rep.id}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="p-6 space-y-4">
                {/* Photo or Avatar Placeholder */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                  {rep.photoUrl ? (
                    <Image
                      src={rep.photoUrl}
                      alt={rep.fullName}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-950 text-amber-400 flex items-center justify-center font-bold text-4xl">
                      {rep.fullName.charAt(0)}
                    </div>
                  )}

                  {/* State Pill Badge */}
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-400/40 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-400" />
                    <span>{rep.stateOfOrigin}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider block">
                    {rep.positionTitle}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-slate-900 leading-snug group-hover:text-emerald-900 transition-colors">
                    {rep.fullName}
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">State Assembly Representative</span>
                <Link
                  href="/leadership#house-of-reps"
                  className="text-xs font-bold text-emerald-950 hover:text-amber-600 flex items-center gap-1"
                >
                  <span>Roster</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
