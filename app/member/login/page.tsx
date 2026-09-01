'use client';

import React, { useActionState, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, UserCheck, ArrowRight, AlertCircle, Loader2, KeyRound, PhoneCall, Sparkles } from 'lucide-react';
import { memberLoginAction, MemberAuthState } from '@/lib/actions/member.actions';

export default function MemberLoginPage() {
  const [state, formAction, isPending] = useActionState<MemberAuthState | null, FormData>(
    memberLoginAction,
    null
  );

  const [identifierInput, setIdentifierInput] = useState('');
  const [verificationInput, setVerificationInput] = useState('');

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-md border border-stone-200">
            <div className="relative w-16 h-16">
              <Image
                src="/images/logo.png"
                alt="YOSU Official Seal"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div>
            <span className="bg-emerald-900 text-amber-400 font-bold px-3 py-1 rounded-full text-[10px] tracking-widest uppercase shadow-sm">
              MEMBER CENTRE PORTAL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950 mt-2 tracking-tight">
              Bona Fide Member Access
            </h1>
            <p className="text-xs font-serif italic text-amber-700 tracking-wide mt-0.5">
              Yoruba Students' Union (YOSU) • Federal University Dutse
            </p>
          </div>
        </div>

        {/* Member Authentication Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-stone-200 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">Member Verification Sign In</h2>
              <p className="text-xs text-slate-500">Sign in with your registered student records</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {state?.error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Registered Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="identifier"
                  required
                  value={identifierInput}
                  onChange={(e) => setIdentifierInput(e.target.value)}
                  placeholder="e.g. student@fud.edu.ng"
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Registered Phone Number (Password) Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex justify-between items-center">
                <span>Registered Phone Number</span>
                <span className="text-[10px] text-amber-700 font-extrabold normal-case bg-amber-50 px-2 py-0.5 rounded border border-amber-200">(Serves as Password)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="verification"
                  required
                  value={verificationInput}
                  onChange={(e) => setVerificationInput(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Callback URL */}
            <input type="hidden" name="callbackUrl" value="/member" />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Access Member Centre</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          {/* Registration Prompt */}
          <div className="pt-4 border-t border-stone-100 text-center space-y-2">
            <p className="text-xs text-slate-500">Not registered yet?</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-900 hover:text-emerald-950 font-bold underline"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Complete Student Membership Registration</span>
            </Link>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <Link href="/" className="text-xs text-slate-600 hover:text-emerald-950 font-semibold">
            ← Return to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}
