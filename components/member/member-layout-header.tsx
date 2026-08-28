'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { MemberNavTabs } from '@/app/member/member-nav-tabs';
import { memberLogoutAction } from '@/lib/actions/member.actions';

export function MemberLayoutHeader({
  memberName,
  regNumber,
}: {
  memberName: string;
  regNumber: string;
}) {
  const pathname = usePathname();

  // Hide the Member Centre top header & navigation bar on login page
  if (pathname === '/member/login') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-950 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/member" className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-white p-1 rounded-xl shadow-sm flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="YOSU Official Seal"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <span className="font-serif text-sm sm:text-base font-bold text-amber-300 tracking-tight block">
              YOSU Member Centre
            </span>
            <span className="text-[10px] text-stone-400 font-sans tracking-wide block sm:inline">
              FUD Chapter
            </span>
          </div>
        </Link>

        {/* User Profile Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-emerald-950 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold text-xs">
              {memberName.charAt(0)}
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-white truncate max-w-[130px]">{memberName}</p>
              <p className="text-[10px] text-amber-400 font-mono font-semibold">{regNumber}</p>
            </div>
          </div>

          <form action={memberLogoutAction}>
            <button
              type="submit"
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/50 text-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Sign Out of Member Centre"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Navigation Tabs Bar */}
      <div className="bg-slate-900 border-t border-slate-800 hidden md:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <MemberNavTabs />
        </div>
      </div>
    </header>
  );
}

export function MemberLayoutMobileNav() {
  const pathname = usePathname();

  if (pathname === '/member/login') {
    return null;
  }

  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 md:hidden py-2 px-3">
      <MemberNavTabs isMobile />
    </nav>
  );
}
