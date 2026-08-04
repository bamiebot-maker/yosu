'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, LogOut, Settings, ShieldCheck, ChevronDown } from 'lucide-react';
import { logoutAction } from '@/lib/actions/auth.actions';
import { SessionPayload } from '@/lib/auth';

interface UserDropdownProps {
  session: SessionPayload;
}

export function UserDropdown({ session }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const primaryRole = session.roleCodes[0] || 'MEMBER';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-stone-100 transition-colors focus:outline-none"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-emerald-900 text-amber-400 font-bold flex items-center justify-center text-xs border border-amber-400/50">
          {session.avatarUrl ? (
            <Image
              src={session.avatarUrl}
              alt={session.fullName}
              fill
              className="object-cover"
            />
          ) : (
            <span>{session.fullName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 line-clamp-1">
            {session.fullName}
          </span>
          <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
            {primaryRole}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
      </button>

      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            {/* Header profile info */}
            <div className="px-4 py-3 border-b border-stone-100 space-y-1">
              <p className="text-xs font-bold text-slate-900">{session.fullName}</p>
              <p className="text-[11px] text-slate-500 truncate">{session.email}</p>
              <div className="pt-1 flex flex-wrap gap-1">
                {session.roleCodes.map((role: string) => (
                  <span
                    key={role}
                    className="bg-emerald-100 text-emerald-900 font-bold text-[9px] px-2 py-0.5 rounded"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="py-1">
              <Link
                href="/admin/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-emerald-950 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Portal Settings</span>
              </Link>
              {session.roleCodes.includes('SUPER_ADMIN') && (
                <Link
                  href="/admin/audit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-emerald-950 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Security Audit Trail</span>
                </Link>
              )}
            </div>

            <div className="pt-1 border-t border-stone-100">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Sign Out of CMS</span>
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
