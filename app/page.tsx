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
  Crown,
  GraduationCap,
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
  Layers,
  FileText,
  Download,
  FolderGit2,
  History,
  Target,
  Compass,
} from 'lucide-react';
import { ExecutiveCarousel, ExecutiveOfficerItem } from '@/components/home/executive-carousel';
import { HeroBackgroundSlider } from '@/components/home/hero-background-slider';
import { ScrollingMarquee } from '@/components/home/scrolling-marquee';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { WelcomeMessageModal } from '@/components/home/welcome-message-modal';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  // 1. Current Administration Session & President Appointment
  const currentSession = (await db.administrationSession.findFirst({
    where: { isCurrent: true },
  }).catch(() => null)) || (await db.administrationSession.findFirst().catch(() => null));

  const activeSessionId = currentSession?.id;

  // 2. Fetch Presidential Welcome Address (Hero Section - Requirement 1)
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
  const heroSessionTitle = presidentialWelcome?.sessionTitle || currentSession?.title || '2026/2027 Progress Era Session';
  const heroPortraitUrl = presidentialWelcome?.portraitUrl || presidentAppt?.person.avatarMedia?.url || '/images/gallery/sobur-certificate-presentation.jpg';
  const heroWelcomeSummary =
    presidentialWelcome?.welcomeSummary ||
    "On behalf of the Executive Council and the entire Yoruba Students' Union (YOSU) at Federal University Dutse, I warmly welcome you to our official enterprise portal. We remain committed to academic excellence, cultural preservation, transparent governance, and student welfare.";
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

  // 6. Active Session Achievements (Requirement 5)
  const dynamicAchievements = await db.achievement.findMany({
    where: {
      ...(activeSessionId ? { sessionId: activeSessionId } : {}),
    },
    orderBy: [{ progressPercentage: 'desc' }, { createdAt: 'desc' }],
  }).catch(() => []);

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

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans antialiased text-slate-900 selection:bg-amber-200 selection:text-emerald-950 overflow-x-hidden">
      {/* 1. HERO SECTION WITH PRESIDENT WELCOME ADDRESS (REQUIREMENT 1) */}
      <section className="relative w-full min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden bg-slate-950 py-16">
        <HeroBackgroundSlider images={heroBackgroundImages} intervalMs={6500} />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 Columns: Title & Tagline */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-amber-400/60 backdrop-blur-md shadow-lg animate-pulse-subtle">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-300">
                  YORUBA STUDENTS&apos; UNION (YOSU) — FUD CHAPTER
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md">
                Promoting Heritage, Unity & Academic Excellence
              </h1>

              <p className="text-sm sm:text-lg text-slate-200 font-light leading-relaxed drop-shadow max-w-2xl mx-auto lg:mx-0">
                Official Enterprise Portal of Federal University Dutse Yoruba Students — Uniting 8 constituent Yoruba state delegations under one supreme constitution.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <WelcomeMessageModal
                  presidentName={heroPresidentName}
                  officeTitle={heroOfficeTitle}
                  stateOfOrigin={heroStateOfOrigin}
                  sessionTitle={heroSessionTitle}
                  portraitUrl={heroPortraitUrl}
                  welcomeSummary={heroWelcomeSummary}
                  fullMessage={heroFullMessage}
                />

                <Link
                  href="/leadership"
                  className="px-6 py-3 bg-emerald-950/90 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl border border-amber-400/40 shadow-xl backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>View Leadership Roster</span>
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Executive President Welcome Card (Requirement 1) */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/95 border-2 border-amber-400/60 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-4 hover-lift">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-lg bg-slate-950">
                    {heroPortraitUrl ? (
                      <Image
                        src={heroPortraitUrl}
                        alt={heroPresidentName}
                        fill
                        className="object-cover object-top"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-950 text-amber-400 flex items-center justify-center font-bold text-2xl">
                        {heroPresidentName.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="bg-emerald-950 text-amber-300 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-emerald-800 inline-block">
                      {heroOfficeTitle}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-white truncate">
                      {heroPresidentName}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      {heroStateOfOrigin} Delegation
                    </p>
                    <span className="text-[10px] text-amber-400 font-mono block">
                      {heroSessionTitle}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                    PRESIDENTIAL ADDRESS EXCERPT
                  </span>
                  <p className="text-xs text-slate-200 italic font-light leading-relaxed line-clamp-4">
                    &quot;{heroWelcomeSummary}&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE ANNOUNCEMENTS */}
      <ScrollingMarquee text="OFFICIAL GAZETTE: 2026/2027 Progress Era Administration Fully Inaugurated • Cmrd. Ibrahim Sobur Bamidele Sworn In as President • Supreme Constitution v2.1 Ratified • Central Media Library Online" />

      {/* 2. EXPANDED ABOUT YOSU SECTION (REQUIREMENT 2) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-16 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              INSTITUTIONAL CHARTER & HERITAGE
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900">
              About Yoruba Students&apos; Union (YOSU)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
              The supreme umbrella body uniting, representing, and empowering all bona fide Yoruba scholars at Federal University Dutse, Jigawa State.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbAboutSections.length > 0
              ? dbAboutSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center border border-amber-400/30">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">{sec.title}</h3>
                      {sec.subtitle && (
                        <p className="text-xs text-amber-700 font-semibold italic">{sec.subtitle}</p>
                      )}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light whitespace-pre-line">
                        {sec.content}
                      </p>
                    </div>
                  </div>
                ))
              : defaultAboutList.map((item) => (
                  <div
                    key={item.key}
                    className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center border border-amber-400/30">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                      {item.content}
                    </p>
                  </div>
                ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 3. 100% DYNAMIC HOMEPAGE STATISTICS (REQUIREMENT 3) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-12">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
              LIVE DATABASE METRICS
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Institutional Statistics & Data</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Yoruba States</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">8 States</div>
              <div className="text-[9px] text-slate-400 font-medium">100% Representation</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Active Excos</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{excoCount} Officers</div>
              <div className="text-[9px] text-slate-400 font-medium">Executive Portfolios</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">House Delegates</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">{repCount} Reps</div>
              <div className="text-[9px] text-slate-400 font-medium">State Assembly</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Achievements</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{achieveCount} Goals</div>
              <div className="text-[9px] text-slate-400 font-medium">Progress Era</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Projects</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">{projectCount} Projects</div>
              <div className="text-[9px] text-slate-400 font-medium">Transparency Tracker</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">News Gazettes</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{newsCount} Articles</div>
              <div className="text-[9px] text-slate-400 font-medium">Published Statements</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Media Assets</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">{mediaCount} Media</div>
              <div className="text-[9px] text-slate-400 font-medium">Cloudinary CDN</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Public Downloads</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{downloadCount} PDFs</div>
              <div className="text-[9px] text-slate-400 font-medium">Resource Portal</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Active Users</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">{userCount} Users</div>
              <div className="text-[9px] text-slate-400 font-medium">Admin Accounts</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Sessions</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{sessionCount} Sessions</div>
              <div className="text-[9px] text-slate-400 font-medium">Historical Timeline</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 4. MODERN NEWSROOM BROADCAST (REQUIREMENT 4) */}
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

      {/* 5. CURRENT ADMINISTRATION HIGHLIGHTS & ACHIEVEMENTS (REQUIREMENT 5) */}
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
              {dynamicAchievements.map((ach) => {
                const isCompleted = ach.progressPercentage >= 100;
                return (
                  <div
                    key={ach.id}
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
                          {isCompleted ? 'Completed' : `${ach.progressPercentage}% Ongoing`}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-white leading-snug">
                        {ach.title}
                      </h3>
                      <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3">
                        {ach.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Completion Milestone</span>
                        <span className="text-amber-400">{ach.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-400 to-emerald-500'
                          }`}
                          style={{ width: `${ach.progressPercentage}%` }}
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

      {/* 6. CURRENT ACTIVE SESSION REPRESENTATIVES (REQUIREMENT 6) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-12 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block">
                LEGISLATIVE LEGISLATURE
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
                House of Representatives ({currentSession?.title || 'Active Session'})
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                State assembly delegates representing Yoruba constituent states for the current active administration session.
              </p>
            </div>
            <Link
              href="/leadership#house-of-reps"
              className="text-xs font-bold text-emerald-950 hover:text-amber-600 flex items-center gap-1"
            >
              <span>Full Assembly Roster</span>
              <ArrowRight className="w-4 h-4 text-amber-500" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeConstituentStateList.length === 0 ? (
              <div className="col-span-full bg-white p-6 rounded-3xl border border-stone-200 text-center text-xs text-slate-500">
                No active session representatives enrolled.
              </div>
            ) : (
              activeConstituentStateList.map((stateName) => {
                const reps = stateRepresentativesMap[stateName];
                return (
                  <div key={stateName} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                      <Building2 className="w-4 h-4 text-emerald-950" />
                      <h3 className="font-serif font-bold text-sm text-slate-900">{stateName} Delegation</h3>
                    </div>

                    <div className="space-y-2">
                      {reps.map((r) => (
                        <div key={r.id} className="p-2.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
                          {r.photoUrl ? (
                            <img src={r.photoUrl} alt={r.fullName} className="w-8 h-8 rounded-full object-cover shrink-0 border border-amber-400" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-emerald-950 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                              {r.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-xs text-slate-900 truncate">{r.fullName}</h4>
                            <span className="text-[10px] text-amber-700 font-mono block">{r.positionTitle}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
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

      {/* 8. HOMEPAGE CONTACT PREVIEW & MAP (REQUIREMENT 7) */}
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

      {/* 9. IMPROVED ENTERPRISE FOOTER (REQUIREMENT 8) */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-8 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1: Brand & Institutional Description */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center border border-amber-400/40">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Yoruba Students&apos; Union</h3>
                  <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">
                    Federal University Dutse Chapter
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-light leading-relaxed max-w-md">
                Official enterprise platform for Yoruba scholars across Federal University Dutse. Governed under the ratified provisions of the Supreme Unification Constitution.
              </p>

              <div className="pt-2 text-xs font-bold text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 inline-block">
                Active Administration: <span className="text-amber-400">{currentSession?.title || '2026/2027 Session'}</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-amber-400 uppercase tracking-wider">Quick Navigation</h4>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li><Link href="/" className="hover:text-amber-300 transition-colors">Home Portal</Link></li>
                <li><Link href="/about" className="hover:text-amber-300 transition-colors">About YOSU</Link></li>
                <li><Link href="/leadership" className="hover:text-amber-300 transition-colors">Leadership Roster</Link></li>
                <li><Link href="/constitution" className="hover:text-amber-300 transition-colors">Supreme Constitution</Link></li>
                <li><Link href="/news" className="hover:text-amber-300 transition-colors">Newsroom Gazettes</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources & Governance */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-amber-400 uppercase tracking-wider">Resources & Portal</h4>
              <ul className="space-y-2 text-xs text-slate-300 font-medium">
                <li><Link href="/projects" className="hover:text-amber-300 transition-colors">Transparency Projects</Link></li>
                <li><Link href="/downloads" className="hover:text-amber-300 transition-colors">Public Downloads</Link></li>
                <li><Link href="/gallery" className="hover:text-amber-300 transition-colors">Central Media Library</Link></li>
                <li><Link href="/contact" className="hover:text-amber-300 transition-colors">Contact Secretariat</Link></li>
                <li><Link href="/login" className="hover:text-amber-300 transition-colors">Executive Admin Login</Link></li>
              </ul>
            </div>

            {/* Column 4: Emergency Contacts & Socials */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-amber-400 uppercase tracking-wider">Emergency Contacts</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <p className="font-mono text-[11px]">{contactPhone}</p>
                <p className="font-mono text-[11px]">{contactEmail}</p>
                <p className="text-[11px] text-slate-400 font-light">Student Affairs Division, FUD Campus</p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                {settingsMap['social_facebook'] && (
                  <a href={settingsMap['social_facebook']} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-amber-400 transition-colors border border-slate-800">
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
                {settingsMap['social_twitter'] && (
                  <a href={settingsMap['social_twitter']} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-amber-400 transition-colors border border-slate-800">
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
                {settingsMap['social_instagram'] && (
                  <a href={settingsMap['social_instagram']} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-amber-400 transition-colors border border-slate-800">
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
            <p>© {new Date().getFullYear()} Yoruba Students&apos; Union (YOSU), Federal University Dutse Chapter. All Rights Reserved.</p>
            <p className="text-[11px] text-slate-300 font-mono">
              Governed by the {currentSession?.title || 'Progress Era'} Administration
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
