'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Users, MessageSquare, Download } from 'lucide-react';

interface MemberNavTabsProps {
  isMobile?: boolean;
}

export function MemberNavTabs({ isMobile = false }: MemberNavTabsProps) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Digital ID Pass', href: '/member', icon: ShieldCheck },
    { name: 'Executive Directory', href: '/member/executives', icon: Users },
    { name: 'Feedback Centre', href: '/member/feedback', icon: MessageSquare },
    { name: 'Download Centre', href: '/member/downloads', icon: Download },
  ];

  const isActive = (href: string) => {
    if (href === '/member') return pathname === '/member' || pathname === '/member/id-card';
    return pathname.startsWith(href);
  };

  if (isMobile) {
    return (
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                active ? 'text-amber-400 font-bold bg-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5 truncate tracking-tight">{tab.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.href);

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              active
                ? 'bg-emerald-950 text-amber-300 border border-amber-400/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
