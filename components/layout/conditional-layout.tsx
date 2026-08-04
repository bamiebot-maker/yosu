'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminOrLogin = pathname.startsWith('/admin') || pathname === '/login';

  if (isAdminOrLogin) {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow w-full max-w-full overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
