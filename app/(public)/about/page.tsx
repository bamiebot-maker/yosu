import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  BookOpen,
  Target,
  Eye,
  Award,
  ShieldCheck,
  Crown,
  Users,
  Building2,
  GraduationCap,
  History as HistoryIcon,
  Heart,
  Globe,
  ArrowRight,
  CheckCircle2,
  Compass,
  Sparkles,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { WelcomeMessageModal } from '@/components/home/welcome-message-modal';

export const revalidate = 60; // ISR 60 seconds

export default async function AboutPage() {
  // 1. Fetch Active Session
  const currentSession = (await db.administrationSession.findFirst({
    where: { isCurrent: true },
  }).catch(() => null)) || (await db.administrationSession.findFirst().catch(() => null));

  const activeSessionId = currentSession?.id;

  // 2. Fetch Active Presidential Welcome Address
  const presidentialWelcome = await db.presidentialWelcome.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => null);

  // Fallback President Appointment if welcome record missing
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

  const presName = presidentialWelcome?.presidentName || presidentAppt?.person.fullName || 'Cmrd. Ibrahim Sobur Bamidele';
  const presOffice = presidentialWelcome?.officeTitle || presidentAppt?.office.title || 'Executive President';
  const presState = presidentialWelcome?.stateOfOrigin || presidentAppt?.person.stateOfOrigin || 'Ekiti State';
  const presSession = presidentialWelcome?.sessionTitle || currentSession?.title || '2026/2027 Session';
  const presPortrait = presidentialWelcome?.portraitUrl || presidentAppt?.person.avatarMedia?.url || '/images/gallery/sobur-certificate-presentation.jpg';
  const presSummary = presidentialWelcome?.welcomeSummary || "Leading with dedication, integrity, and an unyielding commitment to every Yoruba student's success.";
  const presFullMessage = presidentialWelcome?.fullMessage || `Greetings Great Yoruba Students of Federal University Dutse!\n\nIt is with immense humility and gratitude that I address you as the President of our esteemed union for the 2026/2027 Progress Era.\n\nOur administration stands firmly on the pillars of Unity, Integrity, Academic Superiority, and Cultural Heritage. Through our interactive digital platforms, transparency initiatives, and legislative representation across all 8 Yoruba constituent states, we are transforming student governance at FUD.\n\nI encourage every member to engage with our supreme constitution, participate in union projects, and leverage our central media library. Together, we shall elevate YOSU to unprecedented heights.\n\nLong Live YOSU! Long Live Federal University Dutse! Long Live the Federal Republic of Nigeria!`;

  // 3. Fetch Dynamic About Content Sections from Prisma DB
  const dbAboutSections = await db.aboutContent.findMany({
    orderBy: { displayOrder: 'asc' },
  }).catch(() => []);

  // Default fallback sections if DB empty
  const defaultSections = [
    {
      key: 'MISSION',
      title: 'Our Supreme Mission',
      subtitle: 'Academic Supremacy & Student Welfare',
      content: 'To foster unshakeable unity, intellectual excellence, leadership capacity building, and cultural dignity among all bona fide Yoruba scholars enrolled at Federal University Dutse, Jigawa State.',
    },
    {
      key: 'VISION',
      title: 'Our Grand Vision',
      subtitle: 'Gold Standard of Northern Unionism',
      content: 'To stand as the gold standard of transparent student unionism in Northern Nigeria, renowned for unwavering integrity, scholarship support, cultural preservation, and student advocacy.',
    },
    {
      key: 'OBJECTIVES',
      title: 'Union Objectives',
      subtitle: 'Chartered Mandate & Advocacy',
      content: 'Safeguarding student rights, sponsoring academic scholarships, mentoring newly admitted scholars, fostering peaceful inter-ethnic harmony, and representing Yoruba constituent state interests.',
    },
    {
      key: 'HISTORY',
      title: 'Historical Lineage (NAKOLES to YOSU)',
      subtitle: 'Decades of Struggle & Unionism',
      content: 'Traced from the historic era of NAKOLES (National Association of Kwara & Kogi Yoruba Students) to the contemporary unification into the Yoruba Students’ Union (YOSU) at FUD under a bicameral constitution.',
    },
    {
      key: 'CULTURE',
      title: 'Cultural Heritage & OBA Court',
      subtitle: 'Preserving Language, Royalty & Omoluabi Ethics',
      content: 'Celebrating Yoruba language, traditional royalty (OBA Court & Royal Oloris), ethics (Omoluabi), and organizing annual cultural festivals (Àṣà Day) on university campus grounds.',
    },
    {
      key: 'GOVERNANCE',
      title: 'Bicameral Democratic Governance',
      subtitle: 'Executive Council & 8-State Legislature',
      content: 'Operating under an 8-state House of Representatives, an Executive Council of 17 elected portfolios, independent audit committees, and supreme constitutional checks.',
    },
  ];

  // 4. Yoruba Constituent States List
  const constituentStates = [
    { name: 'Ekiti State', capital: 'Ado-Ekiti', motto: 'Fountain of Knowledge' },
    { name: 'Lagos State', capital: 'Ikeja', motto: 'Centre of Excellence' },
    { name: 'Ogun State', capital: 'Abeokuta', motto: 'Gateway State' },
    { name: 'Ondo State', capital: 'Akure', motto: 'Sunshine State' },
    { name: 'Osun State', capital: 'Osogbo', motto: 'State of the Living Spring' },
    { name: 'Oyo State', capital: 'Ibadan', motto: 'Pace Setter State' },
    { name: 'Kwara State', capital: 'Ilorin', motto: 'State of Harmony' },
    { name: 'Kogi State (Okun)', capital: 'Lokoja / Kabba', motto: 'Okun Heritage' },
  ];

  // 5. Live Metrics Count
  const [excoCount, repCount, userCount] = await Promise.all([
    db.officeAppointment.count({ where: { status: 'ACTIVE' } }).catch(() => 17),
    db.houseRepresentative.count().catch(() => 24),
    db.user.count({ where: { isActive: true } }).catch(() => 50),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] font-sans antialiased text-slate-900 overflow-x-hidden">
      {/* 1. HERO HEADER BANNER */}
      <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-amber-400/60 shadow-md">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
              INSTITUTIONAL CHARTER & HERITAGE
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            About Yoruba Students&apos; Union (YOSU)
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 font-light leading-relaxed max-w-3xl">
            Official Enterprise Headquarters of Yoruba scholars at Federal University Dutse, Jigawa State — Uniting 8 constituent state delegations under the Supreme Unification Constitution.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="bg-emerald-900/90 text-emerald-300 px-3.5 py-1.5 rounded-xl border border-emerald-700">
              Active Session: {currentSession?.title || '2026/2027 Session'}
            </span>
            <span className="bg-slate-900 text-amber-400 px-3.5 py-1.5 rounded-xl border border-slate-800">
              Motto: Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full my-12 space-y-16">
        {/* 2. PRESIDENTIAL WELCOME ADDRESS SECTION */}
        <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
          <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-10 space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* President Portrait Photo */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-amber-400 shrink-0 shadow-xl bg-slate-950">
                <Image
                  src={presPortrait}
                  alt={presName}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* President Info & Excerpt */}
              <div className="space-y-4 flex-1 text-center md:text-left">
                <div>
                  <span className="bg-emerald-950 text-amber-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-emerald-800 inline-block mb-1.5">
                    {presOffice} ADDRESS
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
                    {presName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                    {presState} Delegation • {presSession}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed border-l-4 border-amber-400 pl-4 py-1 bg-amber-50/50 rounded-r-xl">
                  &quot;{presSummary}&quot;
                </p>

                <div className="pt-2">
                  <WelcomeMessageModal
                    presidentName={presName}
                    officeTitle={presOffice}
                    stateOfOrigin={presState}
                    sessionTitle={presSession}
                    portraitUrl={presPortrait}
                    welcomeSummary={presSummary}
                    fullMessage={presFullMessage}
                    buttonText="READ FULL PRESIDENTIAL SPEECH →"
                    buttonClassName="px-6 py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-105 inline-flex items-center gap-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3. DYNAMIC INSTITUTIONAL CONTENT SECTIONS */}
        <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                FOUNDATIONAL PILLARS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Institutional Charter & Values
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-light">
                100% dynamic content sections maintained directly by the Executive Secretariat.
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
                : defaultSections.map((sec) => (
                    <div
                      key={sec.key}
                      className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center border border-amber-400/30">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="font-serif font-bold text-xl text-slate-900">{sec.title}</h3>
                        <p className="text-xs text-amber-700 font-semibold italic">{sec.subtitle}</p>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                          {sec.content}
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 4. THE 8 YORUBA CONSTITUENT STATES REPRESENTATION */}
        <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                  FEDERATED ASSEMBLY STRUCTURE
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  The 8 Yoruba Constituent States
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                100% Equal Legislative Voice
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {constituentStates.map((st) => (
                <div
                  key={st.name}
                  className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-400/60 transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <h3 className="font-serif font-bold text-sm text-white">{st.name}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Capital: {st.capital}</p>
                  <p className="text-[10px] text-emerald-400 italic">{st.motto}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 5. CORE ETHOS: OMOLUABI CODE & MOTTO */}
        <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left 6 Columns: Motto & Unification */}
            <div className="lg:col-span-6 bg-emerald-950 text-white p-8 sm:p-10 rounded-3xl shadow-md border border-emerald-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                  SUPREME MOTTO & CHARTER
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-300 italic">
                  &quot;Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ&quot;
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                  Signifying that the heritage of Oduduwa children thrives through brotherly love, mutual cooperation, and unbroken solidarity across all Yoruba constituent states.
                </p>
              </div>

              <div className="pt-4 border-t border-emerald-900 flex items-center justify-between text-xs text-amber-400 font-bold">
                <span>Ratified under 2026 Constitution</span>
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* Right 6 Columns: Omoluabi Ethics */}
            <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-md space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block">
                  ETHICAL CODE OF CONDUCT
                </span>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  The Omoluabi Ethos
                </h3>

                <div className="space-y-3 text-xs text-slate-700 font-medium">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    <span><strong>Ìwà Rere (Integrity):</strong> High moral standing, honesty, and truthfulness in student unionism.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    <span><strong>Ọ̀wọ̀ (Respect):</strong> Reverence for university authority, elders, traditional royalty, and student peers.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    <span><strong>Akinkanjú (Resilience & Valor):</strong> Academic diligence, courage in advocacy, and pursuit of excellence.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <Link
                  href="/constitution"
                  className="text-xs font-bold text-emerald-950 hover:text-amber-600 flex items-center gap-1.5"
                >
                  <span>Read Supreme Constitution Code</span>
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 6. CALL TO ACTION NAVIGATION */}
        <ScrollReveal animation="fade-up" delayMs={100} durationMs={800}>
          <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl border border-amber-400/40">
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
              Explore Our Governance, Leadership & Public Gazettes
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light">
              Dive into our interactive 2026 Supreme Unification Constitution, view executive profiles, or contact the Secretariat directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/leadership"
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-xl transition-all hover:scale-105"
              >
                Leadership Roster
              </Link>
              <Link
                href="/constitution"
                className="px-6 py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl border border-emerald-700 shadow-xl transition-all hover:scale-105"
              >
                Supreme Constitution
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 shadow-xl transition-all hover:scale-105"
              >
                Contact Secretariat
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
