'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Calendar,
  Award,
  CheckCircle2,
  Building2,
  Users,
  FileText,
  Image as ImageIcon,
  Film,
  BookOpen,
  Sparkles,
  Clock,
  ChevronRight,
  ChevronDown,
  Download,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FolderKanban,
  Newspaper,
  Shield,
  Crown,
  UserCheck,
  BarChart3,
  Check,
  Layers,
  ArrowRight,
  Home,
  FolderOpen,
  Info,
  MapPin,
  CheckCircle,
  LucideIcon,
} from 'lucide-react';

export interface SerializedPerson {
  id: string;
  fullName: string;
  email?: string | null;
  phoneNumber?: string | null;
  stateOfOrigin: string;
  department?: string | null;
  level?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
}

export interface SerializedAppointment {
  id: string;
  person: SerializedPerson;
  officeTitle: string;
  officeCategory: string;
  displayOrder: number;
}

export interface SerializedRepresentative {
  id: string;
  fullName: string;
  stateOfOrigin: string;
  positionTitle: string;
  photoUrl?: string | null;
  displayOrder: number;
}

export interface SerializedAchievement {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  progressPercentage?: number;
  status?: string;
  imageUrl?: string | null;
  displayOrder?: number;
}

export interface SerializedProject {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  description: string;
  status: string;
  progressPercentage: number;
  startDate?: string | null;
  targetCompletionDate?: string | null;
  actualCompletionDate?: string | null;
  budgetAmount?: number | null;
  spentAmount?: number | null;
  featuredMediaUrl?: string | null;
  milestones: {
    id: string;
    title: string;
    description?: string | null;
    isCompleted: boolean;
  }[];
}

export interface SerializedConstitution {
  id: string;
  versionName: string;
  effectiveDate: string;
  isCurrent: boolean;
  pdfUrl?: string | null;
  articlesCount: number;
}

export interface SerializedMediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  caption?: string | null;
  altText?: string | null;
}

export interface SerializedAlbum {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  coverMediaUrl?: string | null;
  mediaItems: SerializedMediaItem[];
}

export interface SerializedNews {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  publishedAt?: string | null;
  featuredMediaUrl?: string | null;
  categoryName?: string;
  authorName?: string;
}

export interface SerializedEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  bannerMediaUrl?: string | null;
}

export interface SerializedDocument {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  fileUrl: string;
  mimeType: string;
  downloadsCount: number;
  createdAt: string;
}

export interface SerializedSession {
  id: string;
  title: string;
  slug: string;
  theme?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  historicalSummary: string;
  president?: (SerializedPerson & { officeTitle: string }) | null;
  vicePresident?: (SerializedPerson & { officeTitle: string }) | null;
  secretaryGeneral?: (SerializedPerson & { officeTitle: string }) | null;
  executives: SerializedAppointment[];
  houseRepresentatives: SerializedRepresentative[];
  achievements: SerializedAchievement[];
  projects: SerializedProject[];
  constitutions: SerializedConstitution[];
  albums: SerializedAlbum[];
  mediaItems: SerializedMediaItem[];
  newsArticles: SerializedNews[];
  events: SerializedEvent[];
  documents: SerializedDocument[];
  stats: {
    totalExecutives: number;
    totalRepresentatives: number;
    totalProjects: number;
    totalCompletedProjects: number;
    totalAchievements: number;
    totalAlbums: number;
    totalMediaItems: number;
    totalConstitutions: number;
    totalNews: number;
  };
}

export interface HistoryStats {
  totalAdministrations: number;
  totalExecutives: number;
  totalRepresentatives: number;
  totalConstitutions: number;
  totalProjectsCompleted: number;
  totalAchievements: number;
  totalPublishedNews: number;
  totalGalleries: number;
}

interface HistoryArchiveClientProps {
  stats: HistoryStats;
  sessions: SerializedSession[];
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto border border-amber-200">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="font-serif font-bold text-slate-800 text-base">{title}</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-light leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function HistoryArchiveClient({ stats, sessions }: HistoryArchiveClientProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions.find((s) => s.isCurrent)?.id || sessions[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<
    'cabinet' | 'reps' | 'achievements' | 'projects' | 'media' | 'documents' | 'news' | 'stats'
  >('cabinet');
  const [mediaFilter, setMediaFilter] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [lightboxMedia, setLightboxMedia] = useState<SerializedMediaItem | null>(null);

  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];
  const activeAdministration = sessions.find((s) => s.isCurrent);
  const archivedAdministrations = sessions.filter((s) => !s.isCurrent);

  // Group representatives by state of origin for the selected session
  const stateRepsMap = (currentSession?.houseRepresentatives || []).reduce<
    Record<string, SerializedRepresentative[]>
  >((acc, rep) => {
    const st = rep.stateOfOrigin || 'General';
    if (!acc[st]) acc[st] = [];
    acc[st].push(rep);
    return acc;
  }, {});

  const stateList = Object.keys(stateRepsMap);

  // Media items filtering
  const sessionMedia = currentSession?.mediaItems || [];
  const filteredMedia = sessionMedia.filter((item) => {
    if (mediaFilter === 'IMAGE') return item.mimeType.startsWith('image/');
    if (mediaFilter === 'VIDEO') return item.mimeType.startsWith('video/');
    return true;
  });

  return (
    <div className="space-y-10 font-sans pb-16">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Official Historical Archive</span>
      </nav>

      {/* 1. HERO SECTION WITH DECORATIVE TIMELINE ELEMENTS (TASK 5 - COMPACT MOBILE HEADER CARD) */}
      <header className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-xl relative overflow-hidden border border-slate-800 font-sans">
        {/* Background decorative glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/15 text-amber-300 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border border-amber-400/30">
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>YOSU FUD • HISTORICAL REPOSITORY</span>
          </div>

          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-snug">
            Institutional Evolution & Heritage Archive
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
            The codified historical chronicle of the Yoruba Students&apos; Union (YOSU), Federal University Dutse Chapter. Inspect active and archived executive cabinets, legislative assemblies, ratified constitutional versions, projects, achievements, and media gazettes.
          </p>

          {/* Quick Hero Statistics Banner */}
          <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                <strong className="text-white font-bold">{stats.totalAdministrations}</strong> Recorded Administrations
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white font-bold">{stats.totalExecutives + stats.totalRepresentatives}</strong> Sworn Delegates
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                <strong className="text-white font-bold">{stats.totalProjectsCompleted}</strong> Completed Projects
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HISTORICAL STATISTICS DASHBOARD CARDS */}
      <section aria-labelledby="stats-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">
              LIVE SYSTEM STATISTICS
            </span>
            <h2 id="stats-heading" className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Union Heritage & Impact Metrics
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-semibold border border-slate-200">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-700" /> Database Live Query
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Administrations', value: stats.totalAdministrations, icon: History, color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { label: 'Executives', value: stats.totalExecutives, icon: Users, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { label: 'Representatives', value: stats.totalRepresentatives, icon: Building2, color: 'text-blue-700 bg-blue-50 border-blue-200' },
            { label: 'Constitutions', value: stats.totalConstitutions, icon: ShieldCheck, color: 'text-purple-700 bg-purple-50 border-purple-200' },
            { label: 'Projects Done', value: stats.totalProjectsCompleted, icon: FolderKanban, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
            { label: 'Achievements', value: stats.totalAchievements, icon: Award, color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { label: 'Published News', value: stats.totalPublishedNews, icon: Newspaper, color: 'text-teal-700 bg-teal-50 border-teal-200' },
            { label: 'Photo Galleries', value: stats.totalGalleries, icon: ImageIcon, color: 'text-rose-700 bg-rose-50 border-rose-200' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2 hover:shadow-md transition-all hover:border-amber-400/50"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                  {item.value}
                </div>
                <div className="text-[11px] font-medium text-slate-600 leading-tight">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VISUALLY ENGAGING CHRONOLOGICAL TIMELINE (ACTIVE VS PREVIOUS) */}
      <section aria-labelledby="timeline-heading" className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              CHRONOLOGICAL TIMELINE
            </span>
            <h2 id="timeline-heading" className="text-2xl font-serif font-bold text-white">
              Administration Tenures Directory
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-light">
            Select any tenure to inspect its complete governance gazette
          </span>
        </div>

        <div className="space-y-6">
          {/* Active Administration Highlight Section */}
          {activeAdministration && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  ACTIVE CURRENT ADMINISTRATION
                </h3>
              </div>

              <div
                onClick={() => setSelectedSessionId(activeAdministration.id)}
                className={`group cursor-pointer bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                  selectedSessionId === activeAdministration.id
                    ? 'border-amber-400 shadow-md'
                    : 'border-emerald-800/80 hover:border-emerald-500'
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden relative border border-amber-400 bg-slate-800 shrink-0 shadow-sm">
                      {activeAdministration.president?.avatarUrl ? (
                        <Image
                          src={activeAdministration.president.avatarUrl}
                          alt={activeAdministration.president.fullName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Crown className="w-5 h-5 text-amber-400 m-auto mt-2.5" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-emerald-900 text-emerald-300 text-[9px] font-bold px-2 py-0.2 rounded uppercase border border-emerald-700">
                          CURRENT TENURE
                        </span>
                        <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          {activeAdministration.startDate} — Present
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                        {activeAdministration.title} — {activeAdministration.theme || 'Progress Era'}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-light line-clamp-1">
                        President: <strong className="text-white">{activeAdministration.president?.fullName || 'Cmrd. Ibrahim Sobur Bamidele'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-800 pt-2 lg:pt-0">
                    <div className="flex items-center gap-3 text-[11px] text-slate-300">
                      <span><strong>{activeAdministration.stats.totalExecutives}</strong> Execs</span>
                      <span><strong>{activeAdministration.stats.totalRepresentatives}</strong> Reps</span>
                      <span><strong>{activeAdministration.stats.totalProjects}</strong> Projects</span>
                    </div>

                    <button
                      type="button"
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1"
                    >
                      <span>View Administration</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Previous Archived Administrations */}
          {archivedAdministrations.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                PREVIOUS HISTORICAL ADMINISTRATIONS ({archivedAdministrations.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {archivedAdministrations.map((session) => {
                  const isSelected = selectedSessionId === session.id;
                  return (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`group cursor-pointer p-3.5 rounded-xl border transition-all duration-200 space-y-2 ${
                        isSelected
                          ? 'bg-slate-800 border-amber-400 shadow-sm'
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start text-[11px]">
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          {session.startDate} {session.endDate ? `— ${session.endDate}` : ''}
                        </span>
                        <span className="bg-slate-700 text-slate-300 text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">
                          ARCHIVED
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full overflow-hidden relative bg-slate-700 border border-slate-600 shrink-0">
                          {session.president?.avatarUrl ? (
                            <Image
                              src={session.president.avatarUrl}
                              alt={session.president.fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Users className="w-4 h-4 text-slate-400 m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                            {session.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                            "{session.theme || 'Historical Administration'}"
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{session.stats.totalExecutives} Officers</span>
                        <span>{session.stats.totalProjects} Projects</span>
                        <span className="text-amber-300 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                          View Details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. SELECTED SESSION DETAIL DISPLAY */}
      {currentSession && (
        <AnimatePresence mode="wait">
          <motion.section
            key={currentSession.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            aria-labelledby="session-detail-heading"
            className="space-y-8"
          >
            {/* SESSION BANNER & PRINCIPAL OFFICERS SPOTLIGHT */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-900 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase border border-slate-800">
                      {currentSession.title}
                    </span>
                    {currentSession.isCurrent ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase border border-emerald-200">
                        Active Administration
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase border border-slate-200">
                        Archived Tenure
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Tenure: {currentSession.startDate} {currentSession.endDate ? `to ${currentSession.endDate}` : 'to Date'}
                    </span>
                  </div>

                  <h2 id="session-detail-heading" className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
                    Theme: {currentSession.theme || 'Official Administration Session'}
                  </h2>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl font-light">
                    {currentSession.historicalSummary}
                  </p>
                </div>
              </div>

              {/* PRINCIPAL OFFICERS SPOTLIGHT (President, VP, SecGen) */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  SESSION PRINCIPAL OFFICERS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* President */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-amber-400 bg-slate-800 flex-shrink-0">
                        {currentSession.president?.avatarUrl ? (
                          <Image
                            src={currentSession.president.avatarUrl}
                            alt={currentSession.president.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Crown className="w-7 h-7 text-amber-400 m-auto mt-3" />
                        )}
                      </div>
                      <div>
                        <span className="bg-amber-400/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border border-amber-400/30">
                          {currentSession.president?.officeTitle || 'Executive President'}
                        </span>
                        <h4 className="font-serif font-bold text-base text-white mt-0.5">
                          {currentSession.president?.fullName || 'Office Holder On Record'}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {currentSession.president?.stateOfOrigin ? `${currentSession.president.stateOfOrigin} State` : 'Yoruba Union'}
                        </p>
                      </div>
                    </div>
                    {currentSession.president?.bio && (
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed border-t border-slate-800 pt-2 font-light">
                        {currentSession.president.bio}
                      </p>
                    )}
                  </div>

                  {/* Vice President */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-emerald-400 bg-slate-800 flex-shrink-0">
                        {currentSession.vicePresident?.avatarUrl ? (
                          <Image
                            src={currentSession.vicePresident.avatarUrl}
                            alt={currentSession.vicePresident.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <UserCheck className="w-7 h-7 text-emerald-400 m-auto mt-3" />
                        )}
                      </div>
                      <div>
                        <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border border-emerald-400/30">
                          {currentSession.vicePresident?.officeTitle || 'Vice President'}
                        </span>
                        <h4 className="font-serif font-bold text-base text-white mt-0.5">
                          {currentSession.vicePresident?.fullName || 'Office Holder On Record'}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {currentSession.vicePresident?.stateOfOrigin ? `${currentSession.vicePresident.stateOfOrigin} State` : 'Yoruba Union'}
                        </p>
                      </div>
                    </div>
                    {currentSession.vicePresident?.bio && (
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed border-t border-slate-800 pt-2 font-light">
                        {currentSession.vicePresident.bio}
                      </p>
                    )}
                  </div>

                  {/* Secretary General */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-2xl border border-slate-800 shadow-md space-y-3 relative overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden relative border-2 border-blue-400 bg-slate-800 flex-shrink-0">
                        {currentSession.secretaryGeneral?.avatarUrl ? (
                          <Image
                            src={currentSession.secretaryGeneral.avatarUrl}
                            alt={currentSession.secretaryGeneral.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <FileText className="w-7 h-7 text-blue-400 m-auto mt-3" />
                        )}
                      </div>
                      <div>
                        <span className="bg-blue-400/20 text-blue-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border border-blue-400/30">
                          {currentSession.secretaryGeneral?.officeTitle || 'Secretary General'}
                        </span>
                        <h4 className="font-serif font-bold text-base text-white mt-0.5">
                          {currentSession.secretaryGeneral?.fullName || 'Office Holder On Record'}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {currentSession.secretaryGeneral?.stateOfOrigin ? `${currentSession.secretaryGeneral.stateOfOrigin} State` : 'Yoruba Union'}
                        </p>
                      </div>
                    </div>
                    {currentSession.secretaryGeneral?.bio && (
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed border-t border-slate-800 pt-2 font-light">
                        {currentSession.secretaryGeneral.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TABBED SESSION ARCHIVE NAVIGATION (ATTACHMENT 1 - RESPONSIVE MOBILE DROPDOWN FILTER) */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 space-y-6">
              {/* Mobile Select Dropdown Filter */}
              <div className="block sm:hidden w-full space-y-1.5 pb-2">
                <label htmlFor="history-tab-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Filter Archive View:
                </label>
                <div className="relative">
                  <select
                    id="history-tab-select"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value as any)}
                    className="w-full bg-slate-950 text-amber-300 font-bold text-xs py-3 px-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none shadow-md pr-10"
                  >
                    <option value="cabinet">👥 Executive Cabinet ({currentSession.executives.length})</option>
                    <option value="reps">🏛️ House Representatives ({currentSession.houseRepresentatives.length})</option>
                    <option value="achievements">🏅 Achievements ({currentSession.achievements.length})</option>
                    <option value="projects">📊 Projects ({currentSession.projects.length})</option>
                    <option value="media">🖼️ Media Archive ({currentSession.mediaItems.length})</option>
                    <option value="documents">📜 Documents ({currentSession.constitutions.length + currentSession.documents.length})</option>
                    <option value="news">📰 Gazette News ({currentSession.newsArticles.length})</option>
                    <option value="stats">📈 Session Metrics</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Desktop Horizontal Tab Pills Bar */}
              <div
                role="tablist"
                aria-label="Administration Session Details Navigation"
                className="hidden sm:flex sm:flex-wrap items-center gap-2 border-b border-slate-200 pb-4"
              >
                {[
                  { id: 'cabinet', label: `Executive Cabinet (${currentSession.executives.length})`, icon: Users },
                  { id: 'reps', label: `House Representatives (${currentSession.houseRepresentatives.length})`, icon: Building2 },
                  { id: 'achievements', label: `Achievements (${currentSession.achievements.length})`, icon: Award },
                  { id: 'projects', label: `Projects (${currentSession.projects.length})`, icon: FolderKanban },
                  { id: 'media', label: `Media Archive (${currentSession.mediaItems.length})`, icon: ImageIcon },
                  { id: 'documents', label: `Documents (${currentSession.constitutions.length + currentSession.documents.length})`, icon: FileText },
                  { id: 'news', label: `Gazette News (${currentSession.newsArticles.length})`, icon: Newspaper },
                  { id: 'stats', label: 'Session Metrics', icon: BarChart3 },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${tab.id}`}
                      id={`tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-amber-300 shadow-sm border border-slate-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: EXECUTIVE CABINET */}
              {activeTab === 'cabinet' && (
                <div id="panel-cabinet" role="tabpanel" aria-labelledby="tab-cabinet" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">
                        {currentSession.title} Executive Officers
                      </h3>
                      <p className="text-xs text-slate-500">
                        Exclusively displaying officers sworn into office during the {currentSession.title} administration.
                      </p>
                    </div>
                  </div>

                  {currentSession.executives.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No Executive Officers Record Found"
                      description="There are currently no executive cabinet officers registered in the database for this specific administration session."
                    />
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentSession.executives.map((app) => (
                        <div
                          key={app.id}
                          className="bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400/50 hover:shadow-md transition-all flex items-start gap-3.5"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-slate-200 border border-slate-300 flex-shrink-0">
                            {app.person.avatarUrl ? (
                              <Image
                                src={app.person.avatarUrl}
                                alt={app.person.fullName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <Users className="w-6 h-6 text-slate-400 m-auto mt-3" />
                            )}
                          </div>
                          <div className="space-y-0.5 overflow-hidden">
                            <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded border border-amber-200 inline-block">
                              {app.officeTitle}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-slate-900 truncate">
                              {app.person.fullName}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {app.person.stateOfOrigin} State {app.person.department ? `• ${app.person.department}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: HOUSE REPRESENTATIVES */}
              {activeTab === 'reps' && (
                <div id="panel-reps" role="tabpanel" aria-labelledby="tab-reps" className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-xl text-slate-900">
                      {currentSession.title} House of Representatives
                    </h3>
                    <p className="text-xs text-slate-500">
                      Displaying legislative representatives belonging ONLY to the {currentSession.title} session.
                    </p>
                  </div>

                  {currentSession.houseRepresentatives.length === 0 ? (
                    <EmptyState
                      icon={Building2}
                      title="No Legislative Representatives Record Found"
                      description="No house representatives have been registered in the database for this archived administration session."
                    />
                  ) : (
                    <div className="space-y-6">
                      {stateList.map((state) => (
                        <div key={state} className="space-y-3">
                          <div className="flex items-center gap-2 border-b border-slate-200 pb-1.5">
                            <Building2 className="w-4 h-4 text-emerald-700" />
                            <h4 className="font-serif font-bold text-sm text-slate-900 uppercase tracking-wider">
                              {state} State Delegation ({stateRepsMap[state].length})
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stateRepsMap[state].map((rep) => (
                              <div
                                key={rep.id}
                                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-3"
                              >
                                <div className="w-10 h-10 rounded-full overflow-hidden relative bg-emerald-100 border border-emerald-300 flex-shrink-0">
                                  {rep.photoUrl ? (
                                    <Image
                                      src={rep.photoUrl}
                                      alt={rep.fullName}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <UserCheck className="w-5 h-5 text-emerald-700 m-auto mt-2.5" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                                    {rep.fullName}
                                  </h5>
                                  <p className="text-xs text-slate-500 font-medium">
                                    {rep.positionTitle}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: HISTORICAL ACHIEVEMENTS */}
              {activeTab === 'achievements' && (
                <div id="panel-achievements" role="tabpanel" aria-labelledby="tab-achievements" className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-xl text-slate-900">
                      {currentSession.title} Landmark Achievements
                    </h3>
                    <p className="text-xs text-slate-500">
                      Database-verified achievements and key milestones executed during this administration.
                    </p>
                  </div>

                  {currentSession.achievements.length === 0 ? (
                    <EmptyState
                      icon={Award}
                      title="No Achievements Recorded"
                      description="No landmark achievements have been recorded in the database for this specific session."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSession.achievements.map((ach) => (
                        <div
                          key={ach.id}
                          className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-amber-400/60 transition-all space-y-3"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-amber-200">
                              {ach.category || 'GOVERNANCE'}
                            </span>
                            {ach.status && (
                              <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-200 px-2 py-0.5 rounded">
                                {ach.status}
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif font-bold text-base text-slate-900">
                            {ach.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-light">
                            {ach.description}
                          </p>

                          {ach.progressPercentage !== undefined && ach.progressPercentage > 0 && (
                            <div className="space-y-1 pt-2">
                              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                                <span>Progress</span>
                                <span>{ach.progressPercentage}%</span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-amber-500 h-full rounded-full transition-all"
                                  style={{ width: `${ach.progressPercentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: HISTORICAL PROJECTS */}
              {activeTab === 'projects' && (
                <div id="panel-projects" role="tabpanel" aria-labelledby="tab-projects" className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-xl text-slate-900">
                      {currentSession.title} Infrastructure & Capital Projects
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time project tracking from database. Completed projects automatically feature an official Completed badge.
                    </p>
                  </div>

                  {currentSession.projects.length === 0 ? (
                    <EmptyState
                      icon={FolderKanban}
                      title="No Projects Recorded"
                      description="No capital or infrastructure projects recorded in the database for this administration session."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentSession.projects.map((proj) => {
                        const isCompleted =
                          proj.status === 'COMPLETED' || proj.progressPercentage === 100;
                        return (
                          <div
                            key={proj.id}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 relative overflow-hidden"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              {isCompleted ? (
                                <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  COMPLETED
                                </span>
                              ) : (
                                <span className="bg-amber-100 text-amber-900 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-300">
                                  {proj.status} ({proj.progressPercentage}%)
                                </span>
                              )}

                              {proj.startDate && (
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {proj.startDate}
                                </span>
                              )}
                            </div>

                            <h4 className="font-serif font-bold text-lg text-slate-900">
                              {proj.title}
                            </h4>

                            <p className="text-xs text-slate-600 leading-relaxed font-light">
                              {proj.summary || proj.description}
                            </p>

                            {/* Progress bar */}
                            <div className="space-y-1.5 pt-2">
                              <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span>Completion Progress</span>
                                <span>{proj.progressPercentage}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${proj.progressPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: HISTORICAL MEDIA & GALLERY */}
              {activeTab === 'media' && (
                <div id="panel-media" role="tabpanel" aria-labelledby="tab-media" className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">
                        {currentSession.title} Media Archive
                      </h3>
                      <p className="text-xs text-slate-500">
                        Images and videos strictly linked to this administration session.
                      </p>
                    </div>

                    {/* Filter buttons */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setMediaFilter('ALL')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          mediaFilter === 'ALL'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All ({sessionMedia.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaFilter('IMAGE')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          mediaFilter === 'IMAGE'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Images
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaFilter('VIDEO')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          mediaFilter === 'VIDEO'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Videos
                      </button>
                    </div>
                  </div>

                  {filteredMedia.length === 0 ? (
                    <EmptyState
                      icon={ImageIcon}
                      title="No Media Assets Found"
                      description="No images or videos matching your selected filter were found for this session."
                    />
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredMedia.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setLightboxMedia(m)}
                          className="group relative bg-slate-900 rounded-2xl overflow-hidden aspect-video border border-slate-800 cursor-pointer shadow-sm hover:shadow-xl transition-all"
                        >
                          <Image
                            src={m.url}
                            alt={m.altText || m.filename}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                            <span className="text-[10px] font-bold text-amber-300 uppercase">
                              {m.mimeType.startsWith('video/') ? 'VIDEO' : 'IMAGE'}
                            </span>
                            <p className="text-xs text-white font-medium line-clamp-1">
                              {m.caption || m.filename}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: CONSTITUTIONS & DOCUMENTS */}
              {activeTab === 'documents' && (
                <div id="panel-documents" role="tabpanel" aria-labelledby="tab-documents" className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-xl text-slate-900">
                      {currentSession.title} Constitutions & Legal Documents
                    </h3>
                    <p className="text-xs text-slate-500">
                      Official constitution versions ratified or active during this administration.
                    </p>
                  </div>

                  {currentSession.constitutions.length === 0 && currentSession.documents.length === 0 ? (
                    <EmptyState
                      icon={FileText}
                      title="No Legal Documents Recorded"
                      description="No constitutions or downloadable gazette documents have been linked to this session."
                    />
                  ) : (
                    <div className="space-y-4">
                      {currentSession.constitutions.map((c) => (
                        <div
                          key={c.id}
                          className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif font-bold text-base text-slate-900">
                                  {c.versionName}
                                </h4>
                                {c.isCurrent && (
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-200">
                                    CURRENT RATIFIED LAW
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                Effective Date: {c.effectiveDate} • Contains {c.articlesCount} Codified Articles
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Link
                              href="/constitution"
                              className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 justify-center w-full sm:w-auto"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                              Read Gazette Online
                            </Link>
                            {c.pdfUrl && (
                              <a
                                href={c.pdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center gap-1.5 justify-center"
                              >
                                <Download className="w-3.5 h-3.5" />
                                PDF
                              </a>
                            )}
                          </div>
                        </div>
                      ))}

                      {currentSession.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-serif font-bold text-sm text-slate-900">
                                {doc.title}
                              </h5>
                              <p className="text-xs text-slate-500">
                                Category: {doc.category} • Downloaded {doc.downloadsCount} times
                              </p>
                            </div>
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-300 transition-colors"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: GAZETTE NEWS & EVENTS */}
              {activeTab === 'news' && (
                <div id="panel-news" role="tabpanel" aria-labelledby="tab-news" className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-xl text-slate-900">
                      {currentSession.title} Gazette News & Major Events
                    </h3>
                    <p className="text-xs text-slate-500">
                      Official publications and events hosted during this session's tenure.
                    </p>
                  </div>

                  {currentSession.newsArticles.length === 0 ? (
                    <EmptyState
                      icon={Newspaper}
                      title="No Gazette Articles Found"
                      description="No news articles were published during the timeframe of this administration session."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSession.newsArticles.map((article) => (
                        <Link
                          key={article.id}
                          href={`/news/${article.slug}`}
                          className="bg-slate-50 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400/60 hover:shadow-md transition-all block space-y-2"
                        >
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                            {article.categoryName || 'GAZETTE'}
                          </span>
                          <h4 className="font-serif font-bold text-base text-slate-900 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2 font-light">
                            {article.summary}
                          </p>
                          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200 flex justify-between">
                            <span>By {article.authorName || 'Secretariat'}</span>
                            <span>{article.publishedAt}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 8: SESSION STATS */}
              {activeTab === 'stats' && (
                <div id="panel-stats" role="tabpanel" aria-labelledby="tab-stats" className="space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-xl text-slate-900">
                      {currentSession.title} Database Metrics Breakdown
                    </h3>
                    <p className="text-xs text-slate-500">
                      Specific count of records linked to this session in Neon PostgreSQL.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Executive Officers', count: currentSession.stats.totalExecutives },
                      { label: 'House Representatives', count: currentSession.stats.totalRepresentatives },
                      { label: 'Projects Initiated', count: currentSession.stats.totalProjects },
                      { label: 'Completed Projects', count: currentSession.stats.totalCompletedProjects },
                      { label: 'Achievements', count: currentSession.stats.totalAchievements },
                      { label: 'Albums & Galleries', count: currentSession.stats.totalAlbums },
                      { label: 'Media Files', count: currentSession.stats.totalMediaItems },
                      { label: 'Published News', count: currentSession.stats.totalNews },
                    ].map((s, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="text-2xl font-extrabold text-slate-900 font-serif">
                          {s.count}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      )}

      {/* LIGHTBOX MODAL FOR MEDIA VIEWING */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 flex items-center justify-center"
          onClick={() => setLightboxMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black">
              <Image
                src={lightboxMedia.url}
                alt={lightboxMedia.altText || lightboxMedia.filename}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex justify-between items-center text-white px-2">
              <div>
                <h4 className="font-serif font-bold text-sm">
                  {lightboxMedia.caption || lightboxMedia.filename}
                </h4>
                <p className="text-xs text-slate-400">{lightboxMedia.mimeType}</p>
              </div>

              <button
                type="button"
                onClick={() => setLightboxMedia(null)}
                className="bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
