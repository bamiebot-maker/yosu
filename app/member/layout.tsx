import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getMemberSession } from '@/lib/member-auth';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ShieldCheck, Users, MessageSquare, Download, LogOut, ExternalLink, Sparkles, User } from 'lucide-react';
import { MemberNavTabs } from './member-nav-tabs';
import { memberLogoutAction } from '@/lib/actions/member.actions';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const memberSession = await getMemberSession();
  const adminSession = await getSession();

  if (!memberSession && !adminSession) {
    redirect('/member/login');
  }

  // Fetch full student registration record if memberSession exists
  let student = null;
  if (memberSession?.studentId) {
    student = await db.studentRegistration.findUnique({
      where: { id: memberSession.studentId },
    });
  }

  const memberName = student?.fullName || memberSession?.fullName || adminSession?.fullName || 'Verified Member';
  const regNumber = student?.regNumber || memberSession?.regNumber || 'YOSU MEMBER';
  const level = student?.level || '100L';

  return (
    <div className="min-h-screen bg-stone-100 font-sans flex flex-col justify-between pb-20 md:pb-8">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md">
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
                className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/50 text-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
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

      {/* Main Page Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-stone-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Yoruba Students' Union (YOSU) • Federal University Dutse</p>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="hover:text-emerald-950 font-semibold flex items-center gap-1">
              <span>Main Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Navigation Bar */}
      <nav className="no-print fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 md:hidden py-2 px-3">
        <MemberNavTabs isMobile />
      </nav>
    </div>
  );
}
