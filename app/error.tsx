'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-stone-200 text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 bg-rose-50 border border-rose-200 rounded-2xl">
          <AlertTriangle className="w-10 h-10 text-rose-600" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            System Notice
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            An unexpected error occurred while loading this page. Our team has been notified.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-left font-mono text-[11px] text-rose-900 overflow-x-auto max-h-32">
            {error.message || 'Unknown runtime error'}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl transition-all border border-stone-300 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-emerald-800" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
