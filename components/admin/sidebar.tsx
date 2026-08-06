'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Users,
  BookOpen,
  FolderGit2,
  Sliders,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  BarChart3,
  Layers,
  Crown,
} from 'lucide-react';
import { SessionPayload } from '@/lib/auth';

interface SidebarProps {
  session: SessionPayload;
}

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isSuperAdmin = session.roleCodes.includes('SUPER_ADMIN');

  const navigation = [
    {
      group: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'CONTENT & NEWSROOM',
      items: [
        { name: 'President\'s Welcome', href: '/admin/welcome-message', icon: Crown },
        { name: 'About YOSU CMS', href: '/admin/about-content', icon: BookOpen },
        { name: 'News Gazettes', href: '/admin/news', icon: Newspaper },
        { name: 'Announcements', href: '/admin/announcements', icon: Layers },
        { name: 'Central Media Library', href: '/admin/media', icon: Layers },
        { name: 'Transparency Projects', href: '/admin/projects', icon: FolderGit2 },
        { name: 'Interactive Constitution', href: '/admin/constitution', icon: BookOpen },
      ],
    },
    {
      group: 'GOVERNANCE & ROSTER',
      items: [
        { name: 'Executive Offices', href: '/admin/executives', icon: Users },
        { name: 'House Representatives', href: '/admin/representatives', icon: FolderGit2 },
        { name: 'Era Achievements', href: '/admin/achievements', icon: BarChart3 },
        { name: 'Sessions & Timeline', href: '/admin/sessions', icon: BarChart3 },
      ],
    },
    {
      group: 'SYSTEM & SECURITY',
      items: [
        { name: 'User Accounts', href: '/admin/users', icon: Users },
        { name: 'Feature Flags', href: '/admin/feature-flags', icon: Sliders },

        ...(isSuperAdmin
          ? [
              { name: 'Audit Security Log', href: '/admin/audit', icon: ShieldAlert, highlight: true },
              { name: 'Site Settings', href: '/admin/settings', icon: Settings },
            ]
          : []),
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-950 text-white border-r border-slate-800 transition-all duration-300 hidden lg:flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Brand */}
      <div>
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-10 h-10 flex-shrink-0 bg-white p-1 rounded-xl shadow-md">
              <Image
                src="/images/logo.png"
                alt="YOSU Brand"
                fill
                className="object-contain p-0.5"
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="font-serif text-sm font-bold text-white tracking-tight">
                  YOSU PORTAL
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Admin CMS v2.1
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navigation.map((group) => (
            <div key={group.group} className="space-y-1">
              {!collapsed && (
                <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-3 mb-1.5">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all group relative ${
                      active
                        ? 'bg-emerald-900 text-amber-300 font-bold shadow-lg border border-emerald-700/50'
                        : item.highlight
                        ? 'text-amber-400 hover:bg-slate-900 hover:text-amber-300'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                    title={collapsed ? item.name : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        active ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-300'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}

                    {collapsed && active && (
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-amber-400 rounded-l-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Quick Link & Version */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-2.5 px-3 py-2 bg-slate-900 hover:bg-stone-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Open Public Website"
        >
          <ExternalLink className="w-4 h-4 text-amber-400 flex-shrink-0" />
          {!collapsed && <span>View Live Website</span>}
        </Link>
      </div>
    </aside>
  );
}
