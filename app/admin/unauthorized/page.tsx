import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-xl space-y-5">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wider uppercase">
            ACCESS RESTRICTED (403)
          </span>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Insufficient Role Privileges
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your current assigned account roles do not have permission to view or manage this security section. If you believe this is an error, please contact the Super Administrator.
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/dashboard"
            className="flex-1 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/"
            className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-stone-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Site</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
