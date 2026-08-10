'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface HeroSlideImage {
  url: string;
  alt: string;
  badgeText?: string;
}

interface Props {
  images: HeroSlideImage[];
  autoSlideIntervalMs?: number;
}

export function HeroInteractiveCardSlider({ images, autoSlideIntervalMs = 4500 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoSlideIntervalMs);

    return () => clearInterval(timer);
  }, [images, autoSlideIntervalMs]);

  if (!images || images.length === 0) return null;

  const activeImage = images[currentIndex];
  const totalSlides = images.length;
  const currentFormatted = String(currentIndex + 1).padStart(2, '0');
  const totalFormatted = String(totalSlides).padStart(2, '0');

  return (
    <div className="space-y-4 w-full font-sans">
      {/* Curved Image Frame (TASK 2 - EXACT MATCH FOR ATTACHMENT 2) */}
      <div className="relative w-full h-[260px] sm:h-[380px] lg:h-[440px] rounded-t-3xl rounded-br-3xl rounded-bl-sm overflow-hidden border border-[#D4A311]/30 shadow-xl bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={activeImage.url}
              alt={activeImage.alt}
              fill
              priority={currentIndex === 0}
              className="object-cover object-top"
            />
            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/10" />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Gold Badge (Bottom Left Inside Image) */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="bg-[#D4A311] text-[#0D2818] text-[10px] sm:text-xs font-extrabold px-3.5 py-1.5 rounded-lg shadow-lg uppercase tracking-wider border border-amber-300">
            {activeImage.badgeText || 'YORUBA STUDENTS\' UNION'}
          </div>
        </div>
      </div>

      {/* Slide Counter & Animated Progress Bar (Matching Attachment 2) */}
      <div className="flex items-center gap-4 pt-1">
        <div className="flex items-center gap-1.5 font-serif font-bold text-sm sm:text-base text-slate-800 tracking-wider">
          <span className="text-[#0D2818] font-extrabold">{currentFormatted}</span>
          <span className="text-slate-400 font-light">/</span>
          <span className="text-slate-400 font-normal">{totalFormatted}</span>
        </div>

        {/* Animated Progress Bar Line */}
        <div className="flex-1 max-w-[140px] sm:max-w-[200px] h-1 bg-stone-300/80 rounded-full overflow-hidden relative">
          <motion.div
            key={currentIndex}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: autoSlideIntervalMs / 1000, ease: 'linear' }}
            className="h-full bg-[#D4A311] rounded-full"
          />
        </div>

        {/* Quick Dots / Slide Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-[#0D2818]' : 'w-2 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
