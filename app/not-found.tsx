import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, ArrowLeft, Search, Compass, Shield } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200 text-center space-y-6">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-950 rounded-2xl shadow-md">
          <div className="relative w-14 h-14">
            <Image
              src="/images/logo.png"
              alt="YOSU Crest"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-widest">
            ERROR 404 — PAGE NOT FOUND
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Destination Outside Territory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            The page or resource you are looking for does not exist or has been relocated to another section.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/constitution"
            className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl transition-all border border-stone-300 flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-emerald-800" />
            <span>Explore Platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
