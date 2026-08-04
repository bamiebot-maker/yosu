'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export interface GalleryPhotoItem {
  id: string;
  url: string;
  altText: string;
  caption?: string | null;
  albumTitle?: string;
}

interface GalleryGridProps {
  photos: GalleryPhotoItem[];
}

export function GalleryGrid({ photos }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const prevPhoto = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
  };

  const nextPhoto = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % photos.length);
  };

  return (
    <div className="space-y-6">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {photos.map((photo, idx) => (
          <div
            key={photo.id + idx}
            onClick={() => openLightbox(idx)}
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border border-stone-200 shadow-sm hover:shadow-2xl hover:border-amber-400/80 transition-all duration-300 cursor-pointer"
          >
            <Image
              src={photo.url}
              alt={photo.altText}
              fill
              className="object-cover group-hover:scale-108 transition-transform duration-500"
            />
            {/* Gradient Overlay & Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="absolute bottom-0 inset-x-0 p-4 space-y-1 text-white z-10">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                YOSU Photo Archive
              </span>
              <p className="text-xs font-semibold line-clamp-2 leading-snug">
                {photo.caption || photo.altText}
              </p>
            </div>

            {/* Hover Expand Icon */}
            <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-950/80 border border-slate-700 text-amber-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-50 p-3 bg-slate-900/80 hover:bg-rose-900 text-white rounded-full transition-colors border border-slate-700"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-slate-900/80 hover:bg-emerald-900 text-white rounded-full transition-colors border border-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-slate-900/80 hover:bg-emerald-900 text-white rounded-full transition-colors border border-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Full Lightbox Image */}
          <div className="relative max-w-5xl w-full max-h-[85vh] h-full flex flex-col items-center justify-center p-2">
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-amber-400/30">
              <Image
                src={photos[selectedIndex].url}
                alt={photos[selectedIndex].altText}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center space-y-1">
              <p className="text-sm font-semibold text-white">
                {photos[selectedIndex].caption || photos[selectedIndex].altText}
              </p>
              <span className="text-xs text-amber-400 font-medium">
                Photo {selectedIndex + 1} of {photos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
