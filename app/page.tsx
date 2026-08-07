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
} from 'lucide-react';
import { ExecutiveCarousel, ExecutiveOfficerItem } from '@/components/home/executive-carousel';
import { HeroBackgroundSlider } from '@/components/home/hero-background-slider';
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
      {/* 1. HERO SECTION WITH BACKGROUND SLIDER */}
      <section className="relative w-full h-[85vh] min-h-[580px] max-h-[850px] flex items-center justify-center overflow-hidden bg-slate-950">
        <HeroBackgroundSlider images={heroBackgroundImages} intervalMs={6500} />

        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-amber-400/60 backdrop-blur-md shadow-lg animate-pulse-subtle">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-300">
              YORUBA STUDENTS&apos; UNION (YOSU) — FUD CHAPTER
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] drop-shadow-md">
            Promoting Heritage, Unity & Academic Excellence
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 font-light leading-relaxed drop-shadow max-w-2xl mx-auto">
            Official Enterprise Portal of Federal University Dutse Yoruba Students — Uniting 8 constituent Yoruba state delegations under one supreme constitution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/leadership"
              className="px-6 py-3.5 bg-[#E5A91A] hover:bg-[#d49b14] text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Explore Executive Roster</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/constitution"
              className="px-6 py-3.5 bg-emerald-950/90 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl border border-amber-400/40 shadow-xl backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Interactive Supreme Constitution</span>
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE ANNOUNCEMENTS */}
      <ScrollingMarquee text="OFFICIAL GAZETTE: 2026/2027 Progress Era Administration Fully Inaugurated • Cmrd. Ibrahim Sobur Bamidele Sworn In as President • Supreme Constitution v2.1 Ratified • Central Media Library Online" />

      {/* DYNAMIC REGISTRATION WINDOW ANNOUNCEMENT CARD (TASK 5) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-8 relative z-30 font-sans">
        {regWindow.isOpen ? (
          <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-700 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  MEMBERSHIP REGISTRATION IS OPEN
                </span>
                <span className="text-emerald-300 text-xs font-mono font-bold">
                  {regWindow.academicSession} Session
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                Official YOSU Membership Data Capture
              </h3>
              <p className="text-xs text-stone-200 font-light max-w-xl">
                {regWindow.closesAt
                  ? `Registration is currently open for all bona fide students. Please complete your registration before ${regWindow.closesAt}.`
                  : 'Registration is currently open for all bona fide Yoruba students at Federal University Dutse.'}
              </p>
            </div>

            <Link
              href="/register"
              className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
          </div>
        ) : (
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  REGISTRATION CLOSED
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                Membership Registration Window Closed
              </h3>
              <p className="text-xs text-slate-300 font-light max-w-xl">
                {regWindow.closedMessage ||
                  'Registration is currently closed. Follow our official channels for the next exercise.'}
              </p>
            </div>

            <Link
              href="/contact"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition-all shrink-0"
            >
              Contact Secretariat
            </Link>
          </div>
        )}
      </section>

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

      {/* 3. EXPANDED ABOUT YOSU SECTION (REQUIREMENT 2) */}
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

      {/* 4. 100% DYNAMIC HOMEPAGE STATISTICS (REQUIREMENT 3) */}
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

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow border-t-4 border-t-emerald-800">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Registered Members</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">{registeredStudentCount} Students</div>
              <div className="text-[9px] text-emerald-800 font-bold">Bona Fide YOSU Members</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Sessions</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{sessionCount} Sessions</div>
              <div className="text-[9px] text-slate-400 font-medium">Historical Timeline</div>
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
