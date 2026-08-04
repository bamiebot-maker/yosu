import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import {
  BookOpen,
  Users,
  Building2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Crown,
  GraduationCap,
} from 'lucide-react';
import { ExecutiveCarousel, ExecutiveOfficerItem } from '@/components/home/executive-carousel';
import { HeroBackgroundSlider } from '@/components/home/hero-background-slider';
import { ScrollingMarquee } from '@/components/home/scrolling-marquee';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  // Database Queries
  const currentSession = await db.administrationSession.findFirst({
    where: { isCurrent: true },
  });

  const allAppointments = await db.officeAppointment.findMany({
    where: { status: 'ACTIVE' },
    include: {
      person: { include: { avatarMedia: true } },
      office: true,
    },
    orderBy: { displayOrder: 'asc' },
  });

  const presidentAppt = allAppointments.find(
    (a) => a.office.title.toLowerCase().includes('president') && !a.office.title.toLowerCase().includes('vice')
  );

  const carouselOfficers: ExecutiveOfficerItem[] = allAppointments.map((a) => ({
    id: a.id,
    fullName: a.person.fullName,
    title: a.office.title,
    stateOfOrigin: a.person.stateOfOrigin,
    department: a.person.department,
    level: a.person.level,
    bio: a.person.bio,
    email: a.person.email,
    phoneNumber: a.person.phoneNumber,
    avatarUrl: a.person.avatarMedia?.url,
    twitterUrl: a.person.twitterUrl,
    linkedinUrl: a.person.linkedinUrl,
    instagramUrl: a.person.instagramUrl,
  }));

  const featuredNews = await db.newsArticle.findFirst({
    where: { status: 'PUBLISHED', isFeatured: true },
    include: { category: true, featuredMedia: true },
  });

  const activeProjects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
    take: 2,
  });

  const heroBackgroundImages = [
    {
      url: '/images/gallery/inauguration-handover.jpg',
      alt: 'Official Swearing-in & Certificate Presentation of the 2026/2027 Comdr Sobur-Led Administration',
    },
    {
      url: '/images/gallery/sobur-certificate-presentation.jpg',
      alt: 'President Cmrd. Ibrahim Sobur Bamidele Receiving Certificate of Office',
    },
    {
      url: '/images/gallery/inauguration-stage-group.jpg',
      alt: 'Executive Officers Assembly on Auditorium Stage',
    },
    {
      url: '/images/gallery/outdoor-executive-delegation.jpg',
      alt: 'Outdoor Executive Delegation Portrait on FUD Campus Grounds',
    },
    {
      url: '/images/leadership/oba-fouad.jpg',
      alt: 'Royal Court: OBA Fouad Adegoke Adedotun & Oloris Seated in Dignity',
    },
  ];

  const constituentStates = [
    { name: 'Kwara State', tagline: 'State of Harmony' },
    { name: 'Kogi State (Okun)', tagline: 'Confluence of Excellence' },
    { name: 'Oyo State', tagline: 'Pace Setter State' },
    { name: 'Osun State', tagline: 'State of the Living Spring' },
    { name: 'Ondo State', tagline: 'Sunshine State' },
    { name: 'Ogun State', tagline: 'Gateway State' },
    { name: 'Lagos State', tagline: 'Centre of Excellence' },
    { name: 'Ekiti State', tagline: 'Fountain of Knowledge' },
  ];

  const dignitaries = [
    {
      title: 'Vice Chancellor, FUD',
      name: 'Prof. Abdulkarim Sabo Mohammed',
      role: 'Chief Institutional Patron',
      badge: 'FUD Administration',
    },
    {
      title: 'Dean of Student Affairs',
      name: 'Dr. Kabiru Aliyu',
      role: 'Staff Adviser & Staff Mentor',
      badge: 'Student Affairs',
    },
    {
      title: 'Grand Royal Patron',
      name: 'His Imperial Majesty, The Ooni of Ife',
      role: 'Ojaja II — Cultural Custodian',
      badge: 'Royal Advisory',
    },
    {
      title: 'Grand Royal Pillar',
      name: 'His Imperial Majesty, The Alaafin of Oyo',
      role: 'Traditional Pillar of Oòduà',
      badge: 'Royal Advisory',
    },
  ];

  return (
    <div className="w-full max-w-full overflow-x-hidden font-sans pb-20">
      {/* 1. HERO SECTION WITH LEFT-ALIGNED CONTENT & HIGH-VISIBILITY BACKGROUND SLIDER */}
      <section className="relative min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-96px)] w-full max-w-full overflow-hidden flex items-center justify-start py-20 px-4 sm:px-6 lg:px-12">
        <HeroBackgroundSlider images={heroBackgroundImages} />

        <div className="max-w-7xl mx-auto w-full relative z-20">
          <ScrollReveal animation="fade-up" durationMs={900}>
            <div className="max-w-2xl text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-950/90 border border-amber-400/50 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg animate-glow-pulse">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{currentSession?.title ? `${currentSession.title} — Progress Era` : '2026/2027 Progress Era Session'}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] text-left drop-shadow-md">
                Preserving Heritage, <br />
                <span className="gold-gradient-text font-black">Advancing Excellence</span>
              </h1>

              <p className="text-slate-100 text-sm sm:text-lg max-w-xl font-normal leading-relaxed text-left drop-shadow-md">
                The official digital portal for all Yoruba students at Federal University Dutse. Fostering unified leadership, academic integrity, and cultural dignity.
              </p>

              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start gap-4 pt-2">
                <Link
                  href="/constitution"
                  className="w-full sm:w-auto px-8 py-4 bg-[#E5A91A] hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-2xl transition-all flex items-center justify-center gap-2 min-h-[48px] hover:scale-105"
                >
                  <BookOpen className="w-4.5 h-4.5" />
                  <span>Read 2026 Constitution</span>
                </Link>
                <Link
                  href="/leadership"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 min-h-[48px] backdrop-blur-md hover:scale-105 shadow-xl"
                >
                  <Users className="w-4.5 h-4.5 text-amber-400" />
                  <span>Executive Roster</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. INFINITE SCROLLING MARQUEE BANNER IMMEDIATELY AFTER HERO */}
      <div className="w-full">
        <ScrollingMarquee />
      </div>

      {/* 3. EXECUTIVE PRESIDENTIAL SHOWCASE SECTION (SCROLL ANIMATED) */}
      <ScrollReveal animation="fade-up" durationMs={800}>
        <section className="w-full max-w-full overflow-hidden bg-[#070D18] text-white border-b border-emerald-900/60 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] w-full">
            
            {/* LEFT SIDE: FULL-HEIGHT EDGE-TO-EDGE PORTRAIT WITH GLOWING EMERALD SLIT EDGE */}
            <div className="lg:col-span-6 relative h-96 sm:h-[480px] lg:h-full overflow-hidden bg-slate-950">
              {presidentAppt?.person.avatarMedia?.url ? (
                <Image
                  src={presidentAppt.person.avatarMedia.url}
                  alt={presidentAppt.person.fullName}
                  fill
                  priority
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-5xl">
                  {presidentAppt?.person.fullName.charAt(0) || 'P'}
                </div>
              )}
              
              {/* Subtle Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />

              {/* Glowing Neon Emerald Skewed Slit Divider (Visible on Desktop) */}
              <div className="absolute top-0 bottom-0 -right-4 w-10 bg-emerald-500 transform -skew-x-6 shadow-[0_0_25px_#10B981] hidden lg:block z-20 pointer-events-none" />
            </div>

            {/* RIGHT SIDE: DARK SLATE/EMERALD CONTENT PANEL */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 bg-[#0B132B] relative z-10 text-left">
              {/* Emerald Pill Badge */}
              <div>
                <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-500/50 text-[11px] font-extrabold tracking-widest px-4 py-1.5 rounded-full uppercase inline-flex items-center gap-2 shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  PRESIDENT
                </span>
              </div>

              {/* Huge Bold Title */}
              <div className="space-y-1">
                <h2 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-[1.05]">
                  {presidentAppt?.person.fullName || 'CMRD. IBRAHIM SOBUR BAMIDELE'}
                </h2>
                <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase pt-1">
                  STUDENTS UNION GOVERNMENT • FEDERAL UNIVERSITY DUTSE
                </p>
              </div>

              {/* Quote / Motto */}
              <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-lg">
                "Leading with dedication, integrity, and an unyielding commitment to every Yoruba student's success."
              </p>

              {/* Vibrant Green Action CTA Button */}
              <div className="pt-2">
                <Link
                  href="#executive-council-section"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-full shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300"
                >
                  <span>MEET THE COUNCIL</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
                </Link>
              </div>
            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* 4. NUMBERS THAT TELL THE STORY - Glowing Impact Counter */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-xl text-center space-y-2 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">8</div>
              <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Constituent States</div>
              <p className="text-[11px] text-slate-400">Full Yoruba State Representation</p>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl text-center space-y-2 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">17</div>
              <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Executive Offices</div>
              <div className="text-[11px] text-slate-400">Active Exco Portfolio</div>
            </div>

            <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-xl text-center space-y-2 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">16</div>
              <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">House Delegates</div>
              <div className="text-[11px] text-slate-400">Legislative Representatives</div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl text-center space-y-2 hover-lift">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs font-semibold text-white uppercase tracking-wider">Constitutional Compliance</div>
              <div className="text-[11px] text-slate-400">Ratified 2026 Gazette</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. EXECUTIVE COUNCIL SHOWCASE - Interactive Slider & Pop-Up Modal Component */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section id="executive-council-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-16">
          <ExecutiveCarousel
            officers={carouselOfficers}
            sessionTitle={currentSession?.title ? `${currentSession.title} (Progress Era)` : '2026/2027 Session'}
          />
        </section>
      </ScrollReveal>

      {/* 6. PATRONS & PILLARS - Distinguished Dignitaries */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section className="bg-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 w-full max-w-full my-16">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">DISTINGUISHED DIGNITARIES</span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                Patrons & Pillars of YOSU
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Honoring the esteemed institutional mentors, university leadership, and royal fathers whose wisdom guides our union.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dignitaries.map((dig) => (
                <div
                  key={dig.name}
                  className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 rounded-2xl p-5 text-center space-y-3 hover-lift group"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950 border border-amber-400/40 p-2.5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Crown className="w-7 h-7 text-amber-400" />
                  </div>

                  <div>
                    <span className="bg-emerald-950 text-amber-300 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-800 inline-block mb-1.5">
                      {dig.badge}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {dig.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{dig.title}</p>
                    <p className="text-[11px] text-emerald-400 italic mt-0.5">{dig.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. PUBLIC GAZETTE & PROJECTS */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-16 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Latest Gazette Announcement */}
            {featuredNews && (
              <div className="lg:col-span-7 bg-gradient-to-r from-amber-50 to-stone-50 rounded-2xl border border-amber-200/80 p-6 sm:p-8 space-y-4 shadow-sm hover-lift">
                <span className="bg-amber-200/80 text-amber-900 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Ratified Press Gazette
                </span>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {featuredNews.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {featuredNews.summary}
                </p>

                <div>
                  <Link
                    href={`/news/${featuredNews.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm hover:scale-105"
                  >
                    <span>Read Full Statement</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                </div>
              </div>
            )}

            {/* Development Projects Tracker */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-4 border border-slate-800 shadow-md hover-lift">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">TRANSPARENCY TRACKER</span>
                  <h3 className="font-serif text-lg font-bold text-white">Active Projects</h3>
                </div>
                <Link
                  href="/projects"
                  className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {activeProjects.map((proj) => (
                  <div key={proj.id} className="bg-slate-800/90 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-white">{proj.title}</h4>
                      <span className="bg-emerald-950 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-emerald-800">
                        {proj.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{proj.summary || proj.description}</p>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] font-semibold">
                        <span className="text-slate-400">Completion Progress</span>
                        <span className="text-amber-400">{proj.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${proj.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 8. CONSTITUENT STATES REGIONAL REPRESENTATION */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-16">
          <div className="mb-6 space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">REGIONAL GOVERNANCE</span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-emerald-950">
              The 8 Constituent Yoruba States
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {constituentStates.map((st) => (
              <div
                key={st.name}
                className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-amber-400 transition-all space-y-1 shadow-sm hover-lift"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center mb-2">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-serif font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                  {st.name}
                </h3>
                <p className="text-[10px] text-slate-500 line-clamp-1">{st.tagline}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
