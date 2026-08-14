import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4 font-sans">
      <div className="relative w-16 h-16 bg-white p-2 rounded-2xl shadow-md border border-stone-200 animate-pulse">
        <Image
          src="/images/logo.png"
          alt="YOSU Loading Seal"
          fill
          className="object-contain p-1"
        />
      </div>

      <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
        <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
        <span>Loading YOSU Official Platform...</span>
      </div>
    </div>
  );
}
