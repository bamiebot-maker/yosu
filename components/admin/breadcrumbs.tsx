'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const formatSegment = (seg: string) => {
    return seg
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto py-1">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-1 hover:text-emerald-900 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Portal</span>
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;

        if (segment === 'admin') return null;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
            {isLast ? (
              <span className="font-bold text-slate-900 truncate">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link href={href} className="hover:text-emerald-900 transition-colors truncate">
                {formatSegment(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
