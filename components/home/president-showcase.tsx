'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WelcomeMessageModal } from '@/components/home/welcome-message-modal';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

interface PresidentShowcaseProps {
  heroPresidentName: string;
  heroOfficeTitle: string;
  heroStateOfOrigin: string;
  heroSessionTitle: string;
  heroPortraitUrl: string;
  heroWelcomeSummary: string;
  heroFullMessage: string;
}

export function PresidentShowcase({
  heroPresidentName,
  heroOfficeTitle,
  heroStateOfOrigin,
  heroSessionTitle,
  heroPortraitUrl,
  heroWelcomeSummary,
  heroFullMessage,
}: PresidentShowcaseProps) {
  const displayImage = heroPortraitUrl || '/images/gallery/sobur-certificate-presentation.jpg';

  return (
    <section className="w-full bg-[#080E1A] border-b-2 border-emerald-800/50 text-white overflow-hidden shadow-2xl py-2 font-sans">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[560px] lg:min-h-[660px]">
            {/* Left Column: President Picture with One-Time Right-to-Left Slide-In Animation */}
          <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[480px] lg:min-h-[660px] bg-emerald-950 overflow-hidden flex items-center justify-center">
            {/* Green Accent Edge Bar */}
            <div className="absolute top-0 left-0 bottom-0 w-2.5 sm:w-3.5 bg-[#00A86B] z-30 shadow-2xl" />

            {/* Scroll Reveal Container: Slides in smoothly from Right to Left once on scroll */}
            <ScrollReveal animation="fade-left" delayMs={150} durationMs={900} className="w-full h-full relative">
              <Image
                src={displayImage}
                alt={heroPresidentName}
                fill
                className="object-cover object-top filter brightness-105 contrast-105"
                priority
              />
              {/* Subtle vignette gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/30 via-transparent to-[#0B132B]/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080E1A] via-transparent to-transparent lg:hidden" />
            </ScrollReveal>
          </div>

          {/* Right Column: Executive Text & Buttons */}
          <div className="lg:col-span-6 p-5 sm:p-10 lg:p-16 bg-[#0B132B] flex flex-col justify-center space-y-4 sm:space-y-6 z-20 border-l border-emerald-900/40 font-sans">
            <ScrollReveal animation="fade-up" delayMs={200} durationMs={800}>
              <div className="space-y-3 sm:space-y-5">
                {/* Green Pill Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-[#00A86B] text-[#00A86B] text-[10px] sm:text-xs font-extrabold tracking-wider uppercase shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
                  <span>EXECUTIVE PRESIDENT</span>
                </div>

                {/* Giant Bold Name Header */}
                <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-snug drop-shadow-md">
                  {heroPresidentName}
                </h2>

                {/* Subtitle */}
                <p className="text-[11px] sm:text-xs font-extrabold text-slate-300 uppercase tracking-wider font-mono text-emerald-400">
                  YORUBA STUDENTS&apos; UNION • FUD ({heroSessionTitle})
                </p>

                {/* Address Quote */}
                <p className="text-xs sm:text-base text-slate-200 font-light leading-relaxed italic border-l-3 border-[#00A86B] pl-3.5 py-1.5 bg-emerald-950/30 rounded-r-xl">
                  &quot;{heroWelcomeSummary}&quot;
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2">
                  <WelcomeMessageModal
                    presidentName={heroPresidentName}
                    officeTitle={heroOfficeTitle}
                    stateOfOrigin={heroStateOfOrigin}
                    sessionTitle={heroSessionTitle}
                    portraitUrl={heroPortraitUrl}
                    welcomeSummary={heroWelcomeSummary}
                    fullMessage={heroFullMessage}
                    buttonText="READ PRESIDENTIAL ADDRESS →"
                    buttonClassName="px-4 py-2.5 sm:px-6 sm:py-3.5 bg-[#00A86B] hover:bg-[#00905c] text-white font-extrabold text-[11px] sm:text-xs rounded-full shadow-lg transition-all flex items-center gap-1.5 border border-emerald-400/30 cursor-pointer"
                  />

                  <Link
                    href="/leadership"
                    className="px-4 py-2.5 sm:px-6 sm:py-3.5 bg-slate-900 hover:bg-slate-850 text-emerald-300 font-extrabold text-[11px] sm:text-xs rounded-full border border-emerald-700/80 shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <span>MEET THE COUNCIL →</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
