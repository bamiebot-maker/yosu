'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  Newspaper,
  Users,
  FolderGit2,
  Sliders,
  Settings,
  ShieldAlert,
  BarChart3,
  Layers,
  Crown,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { Breadcrumbs } from './breadcrumbs';
import { UserDropdown } from './user-dropdown';
import { NotificationsMenu } from './notifications-menu';
import { SessionPayload } from '@/lib/auth';

interface HeaderProps {
  session: SessionPayload;
}

export function Header({ session }: HeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isSuperAdmin = session.roleCodes.includes('SUPER_ADMIN');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close drawer on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
        { name: 'Contact Messages Inbox', href: '/admin/contact-messages', icon: Newspaper },
        { name: 'Contact & Social CMS', href: '/admin/contact-settings', icon: Settings },
      ],
    },
    {
      group: 'GOVERNANCE & ROSTER',
      items: [
        { name: 'Student Member Database', href: '/admin/students', icon: Users },
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
              { name: 'Registration Window CMS', href: '/admin/registration-settings', icon: Sliders },
              { name: 'Faculties & Departments CMS', href: '/admin/departments', icon: Building2 },
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
    <header className="sticky top-0 z-30 w-full bg-white border-b border-stone-200 shadow-sm font-sans">
      <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Mobile menu toggle button & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-emerald-900 rounded-lg hover:bg-stone-100 cursor-pointer"
            aria-label="Toggle Admin Sidebar Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-amber-600" /> : <Menu className="w-6 h-6 text-emerald-950" />}
          </button>
          <div className="hidden sm:block">
            <Breadcrumbs />
          </div>
        </div>

        {/* Middle: Global Quick Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news gazettes, excos, constitution, projects..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right: Actions, Notifications & Profile Dropdown */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/constitution"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-amber-50 text-emerald-950 font-bold text-xs rounded-xl border border-stone-200 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>2026 Constitution</span>
          </Link>

          <NotificationsMenu />
          <UserDropdown session={session} />
        </div>
      </div>

      {/* FULL MOBILE LEFT SIDEBAR DRAWER (PORTALED TO DOCUMENT.BODY FOR VIEWPORT LOCK) */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100000] font-sans">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Left Slide-in Sidebar Panel (THIN & SPACE SAVING) */}
          <aside className="fixed top-0 left-0 bottom-0 h-full w-[72vw] max-w-[260px] bg-slate-950 text-white border-r border-slate-800/80 shadow-2xl z-[100001] flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-300">
            {/* Header with Seal & Close Button - PINNED */}
            <div className="shrink-0 p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900 shadow-sm">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="relative w-7 h-7 shrink-0 bg-white p-0.5 rounded-lg shadow">
                  <Image
                    src="/images/logo.png"
                    alt="YOSU Brand"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-serif text-xs font-bold text-white leading-tight truncate">
                    YOSU PORTAL
                  </span>
                  <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider truncate">
                    Admin Control Panel
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close Admin Sidebar Menu"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {/* Breadcrumb info inside drawer */}
              <div className="p-2.5 bg-slate-900/60 border-b border-slate-800/80">
                <Breadcrumbs />
              </div>

              {/* Full Admin Navigation Sections */}
              <div className="p-3 space-y-4">
                {navigation.map((group) => (
                  <div key={group.group} className="space-y-0.5">
                    <p className="text-[9px] font-extrabold tracking-wider text-amber-400/90 uppercase px-2 mb-1">
                      {group.group}
                    </p>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg font-medium text-[11px] transition-all ${
                            active
                              ? 'bg-emerald-950 text-amber-300 font-bold border border-emerald-800/90 shadow-sm'
                              : item.highlight
                              ? 'text-amber-400 hover:bg-slate-900 hover:text-amber-300'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <Icon
                            className={`w-3.5 h-3.5 shrink-0 ${
                              active ? 'text-amber-400' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Live Website Link - PINNED AT BOTTOM */}
            <div className="shrink-0 p-3 border-t border-slate-800 bg-slate-900">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold rounded-lg transition-colors w-full border border-slate-700/80"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>View Live Website</span>
              </Link>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </header>
  );
}
