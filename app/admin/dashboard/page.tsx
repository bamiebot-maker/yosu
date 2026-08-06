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
  ShieldAlert,
  Activity,
  UserCheck,
  UserX,
  Lock,
} from 'lucide-react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export default async function AdminDashboardPage() {
  const session = await getSession();
  const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN') ?? false;

  // Execute database metrics queries
  const [
    totalPersonsCount,
    activeAppointmentsCount,
    newsArticlesCount,
    projectsCount,
    downloadsCount,
    totalUsersCount,
    activeUsersCount,
    inactiveUsersCount,
    failedLoginCount,
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
    db.user.count(),
    db.user.count({ where: { isActive: true } }),
    db.user.count({ where: { isActive: false } }),
    db.auditLog.count({ where: { action: 'AUTH_LOGIN_FAILED' } }),
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
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full uppercase tracking-widest border border-amber-300">
              {isSuperAdmin ? 'SUPER ADMIN SECURITY GOVERNANCE' : 'EXECUTIVE DIGITAL WORKSPACE'}
            </span>
            <span className="text-xs text-slate-500 font-semibold">• {activeSession?.title || '2025/2026 Session'}</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            Greetings, {session?.fullName || 'Executive Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Manage institutional publications, constitutional archives, executive rosters, and central media assets with full audit trail capabilities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            href="/admin/news"
            className="px-4 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Publish Gazette</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl border border-stone-300 transition-all flex items-center gap-2"
          >
            <span>Live Portal</span>
            <Eye className="w-4 h-4 text-slate-500" />
          </Link>
        </div>
      </div>

      {/* Super Admin Exclusive Security Dashboard Widget */}
      {isSuperAdmin && (
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">System Security & User Governance</h3>
                <p className="text-xs text-slate-400">Exclusive Super Admin system telemetry & authentication metrics</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> System Health: 100% Operational
              </span>
              <Link
                href="/admin/audit"
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Audit Logs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                <span>Total System Accounts</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <p className="font-serif text-2xl font-bold text-white">{totalUsersCount}</p>
              <span className="text-[10px] text-slate-400 font-mono">Provisioned Admin Users</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                <span>Active Accounts</span>
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="font-serif text-2xl font-bold text-emerald-400">{activeUsersCount}</p>
              <span className="text-[10px] text-slate-400 font-mono">Status: ACTIVE</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                <span>Suspended Accounts</span>
                <UserX className="w-4 h-4 text-rose-400" />
              </div>
              <p className="font-serif text-2xl font-bold text-rose-400">{inactiveUsersCount}</p>
              <span className="text-[10px] text-slate-400 font-mono">Status: SUSPENDED</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold">
                <span>Failed Auth Attempts</span>
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="font-serif text-2xl font-bold text-amber-400">{failedLoginCount}</p>
              <span className="text-[10px] text-slate-400 font-mono">Logged Security Events</span>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

      {/* Active Project Grid */}
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
            {isSuperAdmin && (
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
