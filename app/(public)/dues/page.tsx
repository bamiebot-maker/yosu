import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ShieldCheck, CreditCard, Lock, ArrowRight, Home, ChevronRight, UserCheck } from 'lucide-react';

export default function StudentDuesRedirectPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Yearly Dues Portal</span>
      </nav>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8 sm:p-12 space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto border-2 border-emerald-300 shadow-md">
          <Lock className="w-8 h-8 text-emerald-800" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <span className="bg-emerald-950 text-amber-300 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border border-amber-400/40 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            SECURE MEMBER VERIFICATION REQUIRED
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">
            Student Member Dues Collection
          </h1>
          <p className="text-slate-600 text-sm font-light leading-relaxed">
            To ensure complete financial integrity and member security, YOSU annual dues collection is accessible exclusively inside the registered Student Member Portal.
          </p>
        </div>

        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 max-w-md mx-auto text-xs text-slate-600 space-y-2 text-left">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-800" />
            <span>Member Verification Rules:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 font-light">
            <li>You must be a registered member with an official Matriculation Number.</li>
            <li>Dues payments are automatically synchronized with your Digital ID Card.</li>
            <li>Verified digital receipts and QR credentials are issued inside your portal.</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/member/login"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>Log in to Member Portal to Pay Dues</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-2xl border border-stone-300 transition-all flex items-center justify-center"
          >
            <span>Not yet a member? Register here</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
