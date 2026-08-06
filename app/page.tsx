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
  FileText,
  ImageIcon,
  Download,
  Flame,
} from 'lucide-react';
import { ExecutiveCarousel, ExecutiveOfficerItem } from '@/components/home/executive-carousel';
import { HeroBackgroundSlider } from '@/components/home/hero-background-slider';
import { ScrollingMarquee } from '@/components/home/scrolling-marquee';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  // 1. Current Session & Executive Appointments
  const currentSession = await db.administrationSession.findFirst({
    where: { isCurrent: true },
  }) || await db.administrationSession.findFirst();

  const activeSessionId = currentSession?.id;

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
  });

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

  // 2. Dynamic News (Hero Article + 3 Sub-featured Articles) - TASK 4
  const [heroNews, subNewsArticles] = await Promise.all([
    db.newsArticle.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
      include: { category: true, featuredMedia: true },
    }),
    db.newsArticle.findMany({
      where: { status: 'PUBLISHED' },
      skip: 1,
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: { category: true, featuredMedia: true },
    }),
  ]);

  // 3. Dynamic Achievements for Active Session - TASK 3
  const dynamicAchievements = await db.achievement.findMany({
    where: {
      ...(activeSessionId ? { sessionId: activeSessionId } : {}),
    },
    orderBy: [{ progressPercentage: 'desc' }, { createdAt: 'desc' }],
    take: 4,
  });

  // 4. Dynamic Statistics Queries - TASK 10
  const [
    excoCount,
    repCount,
    achieveCount,
    newsCount,
    mediaCount,
    downloadCount,
    constVersionCount,
    userCount,
  ] = await Promise.all([
    db.officeAppointment.count({
      where: { status: 'ACTIVE', ...(activeSessionId ? { sessionId: activeSessionId } : {}) },
    }),
    db.houseRepresentative.count({
      where: { ...(activeSessionId ? { sessionId: activeSessionId } : {}) },
    }),
    db.achievement.count({
      where: { ...(activeSessionId ? { sessionId: activeSessionId } : {}) },
    }),
    db.newsArticle.count({ where: { status: 'PUBLISHED' } }),
    db.media.count(),
    db.downloadResource.count(),
    db.constitutionVersion.count(),
    db.user.count({ where: { isActive: true } }),
  ]);

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
      title: 'YOSU Royal Monarch',
      name: 'OBA Fouad Adegoke Adedotun',
      role: 'Kabiyesi — Sovereign Cultural Custodian',
      badge: 'Yoruba Student Throne',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans antialiased text-slate-900 selection:bg-amber-200 selection:text-emerald-950 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[88vh] min-h-[580px] max-h-[900px] flex items-center justify-center overflow-hidden bg-slate-950">
        <HeroBackgroundSlider images={heroBackgroundImages} intervalMs={6500} />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-amber-400/60 backdrop-blur-md shadow-lg animate-pulse-subtle">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-300">
              YORUBA STUDENTS&apos; UNION (YOSU) — FUD CHAPTER
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto drop-shadow-md">
            Promoting Heritage, Unity & Academic Excellence
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
            Official Enterprise Portal of Federal University Dutse Yoruba Students — Uniting constituent Yoruba states across academic frontiers.
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
              <span>Interactive Constitution</span>
            </Link>
          </div>
        </div>
      </section>

      {/* MARQUEE ANNOUNCEMENTS */}
      <ScrollingMarquee text="OFFICIAL GAZETTE: 2026/2027 Progress Era Administration Fully Inaugurated • Cmrd. Ibrahim Sobur Bamidele Sworn In as President • Interactive Supreme Constitution v2.1 Ratified • Central Media Library & Transparency Projects Online" />

      {/* 2. DYNAMIC STATISTICAL METRICS BAR (TASK 10) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Constituent</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">8 States</div>
              <div className="text-[9px] text-slate-400 font-medium">100% Yoruba</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Executives</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{excoCount} Exco</div>
              <div className="text-[9px] text-slate-400 font-medium">Active Portfolio</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Delegates</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">{repCount} Reps</div>
              <div className="text-[9px] text-slate-400 font-medium">House Assembly</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Achievements</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{achieveCount} Goals</div>
              <div className="text-[9px] text-slate-400 font-medium">Progress Era</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Gazettes</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">{newsCount} News</div>
              <div className="text-[9px] text-slate-400 font-medium">Published</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Media Assets</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{mediaCount} Media</div>
              <div className="text-[9px] text-slate-400 font-medium">Cloudinary CDN</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Downloads</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-950">{downloadCount} PDFs</div>
              <div className="text-[9px] text-slate-400 font-medium">Resource Center</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center space-y-1 hover:shadow-md transition-shadow">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Registered</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600">{userCount} Users</div>
              <div className="text-[9px] text-slate-400 font-medium">Admin Accounts</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 3. MODERN NEWSROOM BROADCAST (TASK 4 - BBC / CHANNELS TV STYLE) */}
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
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>{heroNews.publishedAt ? new Date(heroNews.publishedAt).toLocaleDateString() : 'Recent'}</span>
                    </div>

                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 group-hover:text-emerald-900 transition-colors leading-tight">
                      {heroNews.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
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

            {/* Right 5 Columns: 3 Latest Sub-Featured News Cards */}
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

                    <p className="text-xs text-slate-500 line-clamp-1 font-light">{article.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 4. DYNAMIC EXECUTIVE ACHIEVEMENTS SHOWCASE (TASK 3) */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 w-full max-w-full my-12">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                  PROFILES IN EXCELLENCE
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  Key Achievements of the {currentSession?.title || 'Progress Era'}
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                Official Administration Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dynamicAchievements.map((ach) => {
                const isCompleted = ach.progressPercentage >= 100;
                return (
                  <div
                    key={ach.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/60 rounded-2xl p-6 space-y-4 hover-lift transition-all flex flex-col justify-between"
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
                        <span>Milestone Progress</span>
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

      {/* 5. EXECUTIVE COUNCIL SHOWCASE */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section id="executive-council-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-12">
          <ExecutiveCarousel
            officers={carouselOfficers}
            sessionTitle={currentSession?.title ? `${currentSession.title} (Progress Era)` : '2026/2027 Session'}
          />
        </section>
      </ScrollReveal>

      {/* 6. CONSTITUENT STATES & DIGNITARIES */}
      <ScrollReveal animation="fade-up" delayMs={100} durationMs={850}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">CONSTITUENT REPUBLICS</span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
              8 Constituent Yoruba States
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Representing students across the 8 Yoruba constituent states of the Federal Republic of Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {constituentStates.map((st) => (
              <div
                key={st.name}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow text-center space-y-1"
              >
                <h3 className="font-serif font-bold text-sm text-slate-900">{st.name}</h3>
                <p className="text-[11px] text-amber-700 font-medium italic">{st.tagline}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
