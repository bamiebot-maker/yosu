'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Shield, BookOpen } from 'lucide-react';
import { Breadcrumbs } from './breadcrumbs';
import { UserDropdown } from './user-dropdown';
import { NotificationsMenu } from './notifications-menu';
import { SessionPayload } from '@/lib/auth';

interface HeaderProps {
  session: SessionPayload;
}

export function Header({ session }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-stone-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Mobile menu button & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-emerald-900 rounded-lg hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 text-white p-4 space-y-3 shadow-2xl border-b border-slate-800">
          <div className="pb-2 border-b border-slate-800">
            <Breadcrumbs />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-1">
              Admin Navigation
            </p>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/news"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Newsroom Gazettes
            </Link>
            <Link
              href="/admin/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Transparency Projects
            </Link>
            <Link
              href="/admin/executives"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Executive Offices
            </Link>
            <Link
              href="/admin/constitution"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Interactive Constitution
            </Link>
            <Link
              href="/admin/feature-flags"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Feature Flags
            </Link>
            {session.roleCodes.includes('SUPER_ADMIN') && (
              <Link
                href="/admin/audit"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-bold text-amber-400 rounded-lg hover:bg-slate-900"
              >
                Security Audit Log
              </Link>
            )}
            <Link
              href="/admin/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-900 text-slate-200"
            >
              Site Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
