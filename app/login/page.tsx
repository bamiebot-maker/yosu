'use client';

import React, { useActionState, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { loginAction, AuthState } from '@/lib/actions/auth.actions';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(loginAction, null);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Organization Brand Header */}
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
            <span className="bg-amber-400 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[11px] tracking-wider uppercase">
              EXECUTIVE PORTAL
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950 mt-2 tracking-tight">
              Yoruba Students' Union
            </h1>
            <p className="text-xs font-serif italic text-amber-700 tracking-wide mt-0.5">
              "Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ" — Federal University Dutse
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-200 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">Executive Portal Sign In</h2>
              <p className="text-xs text-slate-500">Authorized governance authentication</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>

          {state?.error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="email@yosu.fud.edu.ng"
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Hidden Callback URL */}
            <input type="hidden" name="callbackUrl" value="/admin/dashboard" />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Executive Portal</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Back Link */}
        <div className="text-center">
          <Link href="/" className="text-xs text-slate-600 hover:text-emerald-950 font-semibold">
            ← Return to YOSU Website
          </Link>
        </div>
      </div>
    </div>
  );
}
