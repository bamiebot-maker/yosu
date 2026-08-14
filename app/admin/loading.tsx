import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 space-y-3 font-sans">
      <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center shadow-md">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
        Loading Admin CMS Module...
      </p>
    </div>
  );
}
