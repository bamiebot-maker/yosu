'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroBackgroundSliderProps {
  images: {
    url: string;
    alt: string;
  }[];
  intervalMs?: number;
}

export function HeroBackgroundSlider({ images, intervalMs = 5000 }: HeroBackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="absolute inset-0 z-0 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Background Image Carousel Track */}
      {images.map((img, idx) => (
        <div
          key={img.url + idx}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100 pointer-events-none'
          }`}
        >
          <Image
            src={img.url}
            alt={img.alt}
            fill
            priority={idx === 0}
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Left-Heavy Dark Gradient Overlay Ensuring High Visibility for Left Text while Right Photo Remains Vibrant */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/30 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 z-10" />

      {/* Slide Indicators Dots Bottom Left */}
      <div className="absolute bottom-6 left-6 sm:left-12 z-20 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3.5 py-2 rounded-full border border-amber-400/30 shadow-lg">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-8 bg-amber-400 shadow-md' : 'w-2.5 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to background slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
