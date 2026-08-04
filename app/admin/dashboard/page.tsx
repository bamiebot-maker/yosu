import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  Newspaper,
  FolderGit2,
  Download,
  Calendar,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  Clock,
  BookOpen,
  CheckCircle2,
  Eye,
  Sliders,
} from 'lucide-react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export default async function AdminDashboardPage() {
  const session = await getSession();

  // Execute real database metrics queries
  const [
    totalPersonsCount,
    activeAppointmentsCount,
    newsArticlesCount,
    projectsCount,
    downloadsCount,
    eventsCount,
    latestNews,
    activeProject,
    recentAuditLogs,
    activeSession,
  ] = await Promise.all([
    db.person.count(),
    db.officeAppointment.count({ where: { status: 'ACTIVE' } }),
    db.newsArticle.count(),
    db.project.count(),
    db.downloadResource.count(),
    db.event.count(),
    db.newsArticle.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { category: true, featuredMedia: true },
    }),
    db.project.findFirst({
      where: { status: 'IN_PROGRESS' },
      include: { milestones: true },
    }),
    db.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { include: { person: true } } },
    }),
    db.administrationSession.findFirst({
      where: { isCurrent: true },
    }),
  ]);

  const metrics = [
    {
      label: 'Registered Persons',
      value: totalPersonsCount,
      change: '+8 Constituent States',
      icon: Users,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    },
    {
      label: 'Active Executive Officers',
      value: activeAppointmentsCount,
      change: `${activeSession?.title || '2025/2026 Session'}`,
      icon: ShieldCheck,
      color: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      label: 'Gazette Articles',
      value: newsArticlesCount,
      change: 'Official Newsroom',
      icon: Newspaper,
      color: 'bg-blue-100 text-blue-900 border-blue-200',
    },
    {
      label: 'Transparency Projects',
      value: projectsCount,
      change: `${activeProject?.progressPercentage || 85}% Overall Progress`,
      icon: FolderGit2,
      color: 'bg-purple-100 text-purple-900 border-purple-200',
    },
    {
      label: 'Public Downloads',
      value: downloadsCount,
      change: '142 PDF Downloads',
      icon: Download,
      color: 'bg-stone-200 text-slate-900 border-stone-300',
    },
    {
      label: 'Cultural Events',
      value: eventsCount,
      change: 'Heritage Festival',
      icon: Calendar,
      color: 'bg-rose-100 text-rose-900 border-rose-200',
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>SESSION: {activeSession?.title || '2025/2026 Session'}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
            Welcome back, {session?.fullName}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-serif italic">
            "{activeSession?.theme || 'Unification, Institutional Identity, and Constitutional Integrity'}"
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/admin/news"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Gazette Release</span>
            </Link>
            <Link
              href="/admin/constitution"
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors border border-emerald-600 flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Manage 2026 Constitution</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Key Enterprise Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-2 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {m.label}
                </span>
                <div className={`p-2 rounded-xl border ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-serif text-2xl font-bold text-slate-900">{m.value}</p>
              <span className="text-[10px] font-semibold text-emerald-800 bg-stone-100 px-2 py-0.5 rounded block w-max">
                {m.change}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Project & Milestone Grid */}
      {activeProject && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                FLAGSHIP TRANSPARENCY PROJECT
              </span>
              <h3 className="font-serif text-xl font-bold text-white">{activeProject.title}</h3>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Project Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{activeProject.summary}</p>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-400">Implementation Completion</span>
              <span className="text-amber-400">{activeProject.progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${activeProject.progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {activeProject.milestones.map((m) => (
              <div
                key={m.id}
                className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/70 flex items-start gap-2.5"
              >
                <CheckCircle2
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    m.isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{m.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {m.isCompleted ? 'Completed' : 'Pending Deployment'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Two-Column Layout: Latest News & Security Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Latest Newsroom Gazettes */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Official Newsroom Gazettes</h3>
              <p className="text-xs text-slate-500">Recent press releases & executive statements</p>
            </div>
            <Link
              href="/admin/news"
              className="text-xs font-bold text-emerald-900 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {latestNews.map((article) => (
              <div
                key={article.id}
                className="p-4 bg-stone-50 hover:bg-amber-50/50 rounded-xl border border-stone-200 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-900 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                      {article.category.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Draft'}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900 line-clamp-1">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{article.summary}</p>
                </div>
                <Link
                  href={`/news/${article.slug}`}
                  target="_blank"
                  className="p-2 text-slate-400 hover:text-emerald-900 bg-white rounded-lg border border-stone-200 hover:border-amber-300 transition-colors"
                  title="View Public Gazette"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Columns: Security Audit Trail */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Security Audit Trail</h3>
              <p className="text-xs text-slate-500">Live operational event logs</p>
            </div>
            {session?.roleCodes.includes('SUPER_ADMIN') && (
              <Link
                href="/admin/audit"
                className="text-xs font-bold text-amber-700 hover:underline"
              >
                Full Audit Log
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {recentAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-950 bg-amber-200 px-2 py-0.5 rounded text-[10px]">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700 font-mono text-[11px] leading-tight line-clamp-2">
                  {log.details}
                </p>
                <div className="flex justify-between text-[9px] text-slate-400 pt-1">
                  <span>User: {log.user?.email || 'System'}</span>
                  <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
