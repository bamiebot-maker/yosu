'use client';

import React, { useState } from 'react';
import { DigitalIdCard } from '@/components/member/digital-id-card';
import { MemberProfileEditModal } from '@/components/member/member-profile-edit-modal';
import { DuesPaymentModal } from '@/components/portal/dues-payment-modal';
import { Edit3, CreditCard, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface MemberPortalDashboardClientProps {
  memberData: any;
  student: any;
}

export function MemberPortalDashboardClient({ memberData, student }: MemberPortalDashboardClientProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDuesModalOpen, setIsDuesModalOpen] = useState(false);

  // Determine if student has already completed payment
  const hasPaidDues = Boolean(
    (student.payments && student.payments.some((p: any) => p.status === 'SUCCESS')) ||
    student.status === 'VERIFIED'
  );

  return (
    <div className="space-y-6">
      {/* Header with Edit & Dues Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <span className="bg-emerald-950 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/40">
            OFFICIAL MEMBER PORTAL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            Digital Membership Card & Credentials
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official digital identity issued for {memberData.membership.academicSession}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-2xl transition-all border border-stone-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-800" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDuesModalOpen(true)}
            className={`px-5 py-2.5 text-xs font-extrabold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              hasPaidDues
                ? 'bg-emerald-900 hover:bg-emerald-800 text-amber-300 border border-emerald-700'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-300'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{hasPaidDues ? 'View Dues Receipt' : 'Pay Yearly Dues (₦2,000)'}</span>
          </button>
        </div>
      </div>

      {/* SECURE YEARLY DUES STATUS CARD */}
      <div className="bg-gradient-to-br from-slate-950 to-emerald-950 text-white p-5 sm:p-6 rounded-3xl border border-emerald-900/60 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-extrabold text-[10px] uppercase tracking-wider bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              ANNUAL MEMBER DUES • {memberData.membership.academicSession || '2026/2027'}
            </span>
            {hasPaidDues ? (
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> VERIFIED & ACTIVE
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> DUES PENDING
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-100">
            {hasPaidDues
              ? 'Your 2026/2027 YOSU Dues Payment is Verified'
              : 'Official Annual Dues Payment Required'}
          </h3>
          <p className="text-xs text-slate-300 font-light max-w-xl">
            {hasPaidDues
              ? 'Your membership dues for this academic session are fully paid and synchronized with your digital identity card.'
              : 'Pay your official ₦2,000 annual dues to unlock verified member benefits, library access, and official gazette issuance.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDuesModalOpen(true)}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl transition-all shadow shrink-0 flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>{hasPaidDues ? 'Receipt & Verification' : 'Pay ₦2,000 Dues Now'}</span>
        </button>
      </div>

      {/* Digital ID Card Display */}
      <DigitalIdCard memberData={memberData} />

      {/* Edit Profile Modal */}
      <MemberProfileEditModal
        student={student}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      {/* Dues Payment Checkout Modal */}
      <DuesPaymentModal
        isOpen={isDuesModalOpen}
        onClose={() => setIsDuesModalOpen(false)}
        defaultMatric={student.matricNumber || ''}
        defaultEmail={student.email || ''}
      />
    </div>
  );
}
