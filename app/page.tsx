import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import {
  BookOpen,
  Users,
  Building2,
  ArrowRight,
  Crown,
  Award,
  CheckCircle2,
  Clock,
  Newspaper,
  Calendar,
  Eye,
  Heart,
  Share2,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Globe,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { ExecutiveCarousel, ExecutiveOfficerItem } from '@/components/home/executive-carousel';
import { HeroBackgroundSlider } from '@/components/home/hero-background-slider';
import { HeroInteractiveCardSlider } from '@/components/home/hero-interactive-card-slider';
import { ScrollingMarquee } from '@/components/home/scrolling-marquee';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { WelcomeMessageModal } from '@/components/home/welcome-message-modal';
import { PresidentShowcase } from '@/components/home/president-showcase';
import { RepresentativeCarousel } from '@/components/home/representative-carousel';
import { getRegistrationWindowStatus } from '@/lib/registration-window';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  const regWindow = await getRegistrationWindowStatus();

  // 1. Current Administration Session & President Appointment
  const currentSession = (await db.administrationSession.findFirst({
    where: { isCurrent: true },
  }).catch(() => null)) || (await db.administrationSession.findFirst().catch(() => null));

  const activeSessionId = currentSession?.id;

  // 2. Fetch Presidential Welcome Address (Hero & Presidential Section - Requirement 1)
  let presidentialWelcome = await db.presidentialWelcome.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => null);

  // Fallback to active President appointment if welcome record missing
  const presidentAppt = await db.officeAppointment.findFirst({
    where: {
      status: 'ACTIVE',
      ...(activeSessionId ? { sessionId: activeSessionId } : {}),
      office: { title: { contains: 'President', mode: 'insensitive' } },
    },
    include: {
      person: { include: { avatarMedia: true } },
      office: true,
    },
  }).catch(() => null);

  const heroPresidentName = presidentialWelcome?.presidentName || presidentAppt?.person.fullName || 'Cmrd. Ibrahim Sobur Bamidele';
  const heroOfficeTitle = presidentialWelcome?.officeTitle || presidentAppt?.office.title || 'Executive President';
  const heroStateOfOrigin = presidentialWelcome?.stateOfOrigin || presidentAppt?.person.stateOfOrigin || 'Ekiti State';
  const heroSessionTitle = presidentialWelcome?.sessionTitle || currentSession?.title || '2026/2027 Session';
  const heroPortraitUrl = presidentialWelcome?.portraitUrl || presidentAppt?.person.avatarMedia?.url || '/images/gallery/sobur-certificate-presentation.jpg';
  const heroWelcomeSummary =
    presidentialWelcome?.welcomeSummary ||
    "Leading with dedication, integrity, and an unyielding commitment to every Yoruba student's success.";
  const heroFullMessage =
    presidentialWelcome?.fullMessage ||
    `Greetings Great Yoruba Students of Federal University Dutse!\n\nIt is with immense humility and gratitude that I address you as the President of our esteemed union for the 2026/2027 Progress Era.\n\nOur administration stands firmly on the pillars of Unity, Integrity, Academic Superiority, and Cultural Heritage. Through our interactive digital platforms, transparency initiatives, and legislative representation across all 8 Yoruba constituent states, we are transforming student governance at FUD.\n\nI encourage every member to engage with our supreme constitution, participate in union projects, and leverage our central media library. Together, we shall elevate YOSU to unprecedented heights.\n\nLong Live YOSU! Long Live Federal University Dutse! Long Live the Federal Republic of Nigeria!`;

  // 3. Fetch Expanded About Content (Requirement 2)
  const dbAboutSections = await db.aboutContent.findMany({
    orderBy: { displayOrder: 'asc' },
  }).catch(() => []);

  // Fallback default about content if database is empty
  const defaultAboutList = [
    {
      key: 'MISSION',
      title: 'Our Mission',
      content: 'To foster unity, academic excellence, leadership development, and cultural dignity among Yoruba students at Federal University Dutse.',
    },
    {
      key: 'VISION',
      title: 'Our Vision',
      content: 'To be the gold standard of student unionism in Northern Nigeria, renowned for integrity, welfare support, and heritage preservation.',
    },
    {
      key: 'OBJECTIVES',
      title: 'Core Objectives',
      content: 'Protecting student rights, providing academic scholarships, mentoring incoming scholars, and representing Yoruba constituent interests.',
    },
    {
      key: 'CULTURE',
      title: 'Cultural Preservation & Heritage',
      content: 'Celebrating Yoruba language, traditional royalty (OBA Court), ethics (Omoluabi), and annual cultural festivals on campus grounds.',
    },
    {
      key: 'LEADERSHIP',
      title: 'Democratic Governance & Unity',
      content: 'Operating under an 8-state bicameral assembly, independent constitutional committees, and strict financial transparency.',
    },
    {
      key: 'IMPACT',
      title: 'Community Impact & Networking',
      content: 'Connecting over 500+ student alumni across top national industries, technology hubs, and federal public services.',
    },
  ];

  // 4. Executive Carousel Officers
  const allAppointments = await db.officeAppointment.findMany({
    where: {
      status: 'ACTIVE',
      ...(activeSessionId ? { sessionId: activeSessionId } : {}),
    },
    include: {
      person: { include: { avatarMedia: true } },
      office: true,
    },
    orderBy: { displayOrder: 'asc' },
  }).catch(() => []);

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

  // 5. Dynamic Newsroom Broadcast (Requirement 4)
  const [heroNews, subNewsArticles] = await Promise.all([
    db.newsArticle.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
      include: { category: true, featuredMedia: true },
    }).catch(() => null),
    db.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      skip: 1,
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: { category: true, featuredMedia: true },
    }).catch(() => []),
  ]);

  // 6. Active Session Achievements & Development Projects
  const [dynamicAchievements, dbProjects] = await Promise.all([
    db.achievement.findMany({
      where: {
        ...(activeSessionId ? { sessionId: activeSessionId } : {}),
      },
      orderBy: [{ progressPercentage: 'desc' }, { createdAt: 'desc' }],
    }).catch(() => []),
    db.project.findMany({
      orderBy: [{ progressPercentage: 'desc' }, { createdAt: 'desc' }],
    }).catch(() => []),
  ]);

  const combinedFlagshipItems = [
    ...dynamicAchievements.map((ach) => ({
      id: ach.id,
      title: ach.title,
      description: ach.description,
      progressPercentage: ach.progressPercentage,
      categoryLabel: 'SESSION ACHIEVEMENT',
    })),
    ...dbProjects.map((proj) => ({
      id: proj.id,
      title: proj.title,
      description: proj.summary || proj.description,
      progressPercentage: proj.progressPercentage,
      categoryLabel: 'UNION PROJECT',
    })),
  ];

  // 7. Active Session Representatives Grouped by Yoruba State (Requirement 6)
  const dbRepresentatives = await db.houseRepresentative.findMany({
    where: {
      ...(activeSessionId ? { sessionId: activeSessionId } : {}),
    },
    orderBy: [{ stateOfOrigin: 'asc' }, { displayOrder: 'asc' }],
  }).catch(() => []);

  type RepItem = (typeof dbRepresentatives)[number];
  const stateRepresentativesMap = dbRepresentatives.reduce<Record<string, RepItem[]>>((acc, rep) => {
    if (!acc[rep.stateOfOrigin]) acc[rep.stateOfOrigin] = [];
    acc[rep.stateOfOrigin].push(rep);
    return acc;
  }, {});

  const activeConstituentStateList = Object.keys(stateRepresentativesMap);

  // 8. Dynamic Statistics (Requirement 3 - 10 Live Prisma Queries)
  const [
    excoCount,
    repCount,
    achieveCount,
    newsCount,
    mediaCount,
    downloadCount,
    constVersionCount,
    userCount,
    projectCount,
    sessionCount,
    registeredStudentCount,
  ] = await Promise.all([
    db.officeAppointment.count({
      where: { status: 'ACTIVE', ...(activeSessionId ? { sessionId: activeSessionId } : {}) },
    }).catch(() => 0),
    db.houseRepresentative.count({
      where: { ...(activeSessionId ? { sessionId: activeSessionId } : {}) },
    }).catch(() => 0),
    db.achievement.count({
      where: { ...(activeSessionId ? { sessionId: activeSessionId } : {}) },
    }).catch(() => 0),
    db.newsArticle.count({ where: { status: 'PUBLISHED' } }).catch(() => 0),
    db.media.count().catch(() => 0),
    db.downloadResource.count({ where: { isPublic: true } }).catch(() => 0),
    db.constitutionVersion.count().catch(() => 0),
    db.user.count({ where: { isActive: true } }).catch(() => 0),
    db.project.count().catch(() => 0),
    db.administrationSession.count().catch(() => 0),
    db.studentRegistration.count().catch(() => 0),
  ]);

  // 9. Site Settings (Requirement 7 - Contact & Map CMS)
  const siteSettingsList = await db.siteSetting.findMany().catch(() => []);
  const settingsMap = siteSettingsList.reduce<Record<string, string>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  const contactAddress = settingsMap['contact_address'] || 'YOSU Secretariat, Student Affairs Building, Federal University Dutse, Jigawa State';
  const contactEmail = settingsMap['contact_email'] || 'yosufud@gmail.com';
  const contactPhone = settingsMap['contact_phone'] || '+234 812 345 6789';
  const contactWhatsapp = settingsMap['contact_whatsapp'] || '+234 812 345 6789';
  const contactMapUrl =
    settingsMap['contact_map_url'] ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.946141381395!2d9.3364443!3d11.8385833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11ae43f87b8d4f45%3A0x6b4f7e2c0e8f2e0!2sFederal%20University%20Dutse!5e0!3m2!1sen!2sng!4v1700000000000';

  const heroBackgroundImages = [
    {
      url: '/images/hero/hero-bg-1.jpg',
      alt: 'Yoruba Students Union FUD Member Delegation in Traditional Attire',
      badgeText: 'YORUBA STUDENTS\' UNION',
    },
    {
      url: '/images/gallery/inauguration-stage-group.jpg',
      alt: 'Executive Officers Assembly on Auditorium Stage',
      badgeText: 'EXECUTIVE INAUGURATION',
    },
    {
      url: '/images/leadership/oba-procession.jpg',
      alt: 'Royal Court: OBA Fouad Adegoke Adedotun & Oloris Seated in Dignity',
      badgeText: 'ROYAL CULTURAL COURT',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans antialiased text-slate-900 selection:bg-amber-200 selection:text-emerald-950 overflow-x-hidden">
      {/* 1. HERO SECTION (ATTACHMENT 2 - EXACT MATCH FOR DESIGN & MOBILE UI) */}
      <section className="relative w-full bg-[#FAF8F5] pt-6 sm:pt-10 pb-8 sm:pb-12 border-b border-stone-200/70 font-sans overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column (Matching Attachment 2) */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              {/* FUD CHAPTER Badge with gold accent line */}
              <div className="space-y-1">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#B8860B] block">
                  FUD CHAPTER
                </span>
                <div className="w-10 h-0.5 bg-[#D4A311] rounded-full" />
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0D2818] tracking-tight leading-[1.15]">
                Promoting Heritage, <br className="hidden sm:inline" />
                Unity <span className="text-[#D4A311]">&amp;</span> Academic <br />
                Excellence
              </h1>

              {/* Subtitle */}
              <p className="text-slate-700 text-xs sm:text-sm font-normal leading-relaxed max-w-lg">
                Official Enterprise Portal of Federal University Dutse Yoruba Students — Uniting 8 constituent Yoruba state delegations under one supreme constitution.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3.5 pt-1">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/member/login"
                    className="px-5 py-3 bg-[#0D2818] hover:bg-[#07180E] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2.5 border border-amber-400/40 group"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Member Portal Login</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/register"
                    className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-slate-950" />
                    <span>Student Registration</span>
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold pt-1">
                  <Link
                    href="/leadership"
                    className="text-[#0D2818] hover:text-[#B8860B] transition-colors flex items-center gap-1 font-bold"
                  >
                    <span>Executive Roster</span>
                    <ArrowRight className="w-3 h-3 text-[#D4A311]" />
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link
                    href="/constitution"
                    className="text-[#B8860B] hover:text-[#0D2818] transition-colors underline underline-offset-4 decoration-[#D4A311]/60"
                  >
                    Interactive Supreme Constitution
                  </Link>
                </div>
              </div>

              {/* Motto */}
              <p className="italic font-serif text-[#0D2818] text-xs sm:text-sm tracking-wide pt-1">
                &apos;Ìpínlẹ̀ Ọmọ Odùdú: &apos;Ìfé Sókàpò&apos;
              </p>
            </div>

            {/* Right Interactive Image Slider Card Column */}
            <div className="lg:col-span-6 w-full">
              <HeroInteractiveCardSlider images={heroBackgroundImages} autoSlideIntervalMs={4500} />
            </div>

          </div>
        </div>
      </section>

      {/* MARQUEE ANNOUNCEMENTS */}
      <ScrollingMarquee text="OFFICIAL GAZETTE: 2026/2027 Progress Era Administration Fully Inaugurated • Cmrd. Ibrahim Sobur Bamidele Sworn In as President • Supreme Constitution v2.1 Ratified • Central Media Library Online" />

      {/* 2. DEDICATED PRESIDENT SHOWCASE SECTION WITH SLIDING PICTURE ANIMATION */}
      <PresidentShowcase
        heroPresidentName={heroPresidentName}
        heroOfficeTitle={heroOfficeTitle}
        heroStateOfOrigin={heroStateOfOrigin}
        heroSessionTitle={heroSessionTitle}
        heroPortraitUrl={heroPortraitUrl}
        heroWelcomeSummary={heroWelcomeSummary}
        heroFullMessage={heroFullMessage}
      />

      {/* 3. EXPANDED ABOUT YOSU SECTION (TASK 4 - COMPACT PREMIUM MISSION & VISION CARDS) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-8 sm:my-12 space-y-6 sm:space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-[9px] font-extrabold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              INSTITUTIONAL CHARTER & HERITAGE
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900">
              About Yoruba Students&apos; Union (YOSU)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
              The supreme umbrella body uniting, representing, and empowering all bona fide Yoruba scholars at Federal University Dutse, Jigawa State.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {dbAboutSections.length > 0
              ? dbAboutSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center border border-amber-400/30">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">{sec.title}</h3>
                      {sec.subtitle && (
                        <p className="text-[11px] text-amber-700 font-semibold italic">{sec.subtitle}</p>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed font-light whitespace-pre-line">
                        {sec.content}
                      </p>
                    </div>
                  </div>
                ))
              : defaultAboutList.map((item) => (
                  <div
                    key={item.key}
                    className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center border border-amber-400/30">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      {item.content}
                    </p>
                  </div>
                ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 4. 100% DYNAMIC HOMEPAGE STATISTICS (TASK 3 - COMPACT SWIPEABLE RESPONSIVE METRICS) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-8 sm:my-12 space-y-4">
          <div className="flex justify-between items-end border-b border-stone-200 pb-2">
            <div>
              <span className="text-[9px] font-extrabold text-amber-700 uppercase tracking-widest block">
                LIVE DATABASE TELEMETRY
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">Institutional Metrics</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-medium sm:hidden">Swipe ← →</span>
          </div>

          {/* Swipeable Metrics Row on Mobile, Grid on Tablet/Desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 pb-2 scrollbar-none sm:grid sm:grid-cols-5 lg:grid-cols-10">
            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Yoruba States</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">8 States</div>
              <div className="text-[8px] text-slate-400 font-medium">Representation</div>
            </div>

            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Active Excos</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{excoCount} Officers</div>
              <div className="text-[8px] text-slate-400 font-medium">Cabinet</div>
            </div>

            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">House Delegates</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">{repCount} Reps</div>
              <div className="text-[8px] text-slate-400 font-medium">Assembly</div>
            </div>

            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Achievements</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{achieveCount} Goals</div>
              <div className="text-[8px] text-slate-400 font-medium">Progress Era</div>
            </div>

            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Projects</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">{projectCount} Projects</div>
              <div className="text-[8px] text-slate-400 font-medium">Tracker</div>
            </div>

            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">News Gazettes</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{newsCount} Articles</div>
              <div className="text-[8px] text-slate-400 font-medium">Press</div>
            </div>

            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Media Assets</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">{mediaCount} Media</div>
              <div className="text-[8px] text-slate-400 font-medium">CDN Gallery</div>
            </div>

            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Downloads</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{downloadCount} PDFs</div>
              <div className="text-[8px] text-slate-400 font-medium">Resources</div>
            </div>

            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow border-t-2 border-t-emerald-800">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Members</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">{registeredStudentCount}</div>
              <div className="text-[8px] text-emerald-800 font-bold">Registered</div>
            </div>

            <div className="shrink-0 snap-start min-w-[130px] sm:min-w-0 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-stone-200 shadow-sm text-center space-y-0.5 hover:shadow-md transition-shadow">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">Sessions</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{sessionCount}</div>
              <div className="text-[8px] text-slate-400 font-medium">Timeline</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 5. MODERN NEWSROOM BROADCAST (REQUIREMENT 4) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-12 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center border border-amber-500/30">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block">OFFICIAL PRESS BROADCAST</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">National YOSU Newsroom</h2>
              </div>
            </div>

            <Link
              href="/news"
              className="text-xs font-bold text-emerald-950 hover:text-amber-600 flex items-center gap-1.5 transition-colors"
            >
              <span>View Newsroom Archive</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 7 Columns: Hero Feature Article */}
            {heroNews ? (
              <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
                <div>
                  {heroNews.featuredMedia?.url && (
                    <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                      <Image
                        src={heroNews.featuredMedia.url}
                        alt={heroNews.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                      <div className="absolute top-4 left-4 bg-emerald-950 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/50 shadow-md">
                        {heroNews.category.name}
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{heroNews.publishedAt ? new Date(heroNews.publishedAt).toLocaleDateString() : 'Recent'}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-emerald-950 font-bold">
                        <Eye className="w-3.5 h-3.5 text-amber-600" />
                        <span>{heroNews.viewCount} Views</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-rose-600 font-bold">
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        <span>{heroNews.likeCount}</span>
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 group-hover:text-emerald-900 transition-colors leading-tight">
                      {heroNews.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 font-light">
                      {heroNews.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0">
                  <Link
                    href={`/news/${heroNews.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                  >
                    <span>Read Full Gazette</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-stone-200 text-slate-500 text-xs">
                No featured news gazette published yet.
              </div>
            )}

            {/* Right 5 Columns: 3 Sub-Featured News Cards */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {subNewsArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
                >
                  {article.featuredMedia?.url ? (
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={article.featuredMedia.url}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                      YOSU
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                        {article.category.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-emerald-900 transition-colors leading-snug">
                      {article.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1">
                      <span>👁️ {article.viewCount}</span>
                      <span>❤️ {article.likeCount}</span>
                      <span>🔗 {article.shareCount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. CURRENT ADMINISTRATION HIGHLIGHTS & ACHIEVEMENTS (REQUIREMENT 5) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 w-full max-w-full my-12">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                  ACTIVE SESSION ACHIEVEMENTS
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  Flagship Achievements of {currentSession?.title || '2026/2027 Session'}
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                100% Dynamic Prisma Telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {combinedFlagshipItems.map((item) => {
                const isCompleted = item.progressPercentage >= 100;
                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 rounded-3xl p-6 space-y-4 hover-lift transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="w-10 h-10 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center border border-amber-400/30">
                          <Award className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 ${
                            isCompleted
                              ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-amber-400" />}
                          {isCompleted ? 'Completed' : `${item.progressPercentage}% Ongoing`}
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-extrabold text-amber-400/90 uppercase tracking-widest block mb-0.5">
                          {item.categoryLabel}
                        </span>
                        <h3 className="font-serif font-bold text-base text-white leading-snug">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Completion Milestone</span>
                        <span className="text-amber-400">{item.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-400 to-emerald-500'
                          }`}
                          style={{ width: `${item.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 7. EXECUTIVE COUNCIL CAROUSEL */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section id="executive-council-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-12">
          <ExecutiveCarousel
            officers={carouselOfficers}
            sessionTitle={currentSession?.title ? `${currentSession.title} (Progress Era)` : '2026/2027 Session'}
          />
        </section>
      </ScrollReveal>

      {/* 8. HOUSE OF REPRESENTATIVES CAROUSEL (SLIDER LIKE EXECUTIVE CARDS) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section id="house-of-reps-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-12">
          <RepresentativeCarousel
            representatives={dbRepresentatives}
            sessionTitle={currentSession?.title ? `${currentSession.title} (Progress Era)` : '2026/2027 Session'}
          />
        </section>
      </ScrollReveal>

      {/* 9. HOMEPAGE CONTACT PREVIEW & MAP (REQUIREMENT 7) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-16 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block">GET IN TOUCH</span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">Union Secretariat & Contact Preview</h2>
            </div>
            <Link
              href="/contact"
              className="text-xs font-bold text-emerald-950 hover:text-amber-600 flex items-center gap-1.5"
            >
              <span>Full Contact & Enquiry Center</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 5 Columns: Contact Info Cards */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900">Secretariat Office Address</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-light mt-0.5">{contactAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900">Official Email</h4>
                    <a href={`mailto:${contactEmail}`} className="text-xs text-emerald-800 font-bold hover:underline">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900">Helpline Phone</h4>
                    <a href={`tel:${contactPhone}`} className="text-xs text-slate-700 font-semibold hover:underline">
                      {contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900">Official WhatsApp Desk</h4>
                    <a href={`https://wa.me/${contactWhatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-800 font-bold hover:underline">
                      {contactWhatsapp}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Office Hours</span>
                <span className="text-xs font-semibold text-slate-800 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 inline-block">
                  Monday – Friday: 9:00 AM – 5:00 PM (WAT)
                </span>
              </div>
            </div>

            {/* Right 7 Columns: Embedded Google Map Preview */}
            <div className="lg:col-span-7 bg-stone-200 rounded-3xl overflow-hidden shadow-sm border border-stone-300 relative min-h-[320px]">
              <iframe
                title="Federal University Dutse Google Map Location"
                src={contactMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '360px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full rounded-3xl"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
