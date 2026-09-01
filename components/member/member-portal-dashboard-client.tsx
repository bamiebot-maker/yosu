'use client';

import React, { useState } from 'react';
import { DigitalIdCard } from '@/components/member/digital-id-card';
import { MemberProfileEditModal } from '@/components/member/member-profile-edit-modal';
import { Edit3, UserCheck, ShieldCheck } from 'lucide-react';

interface MemberPortalDashboardClientProps {
  memberData: any;
  student: any;
}

export function MemberPortalDashboardClient({ memberData, student }: MemberPortalDashboardClientProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
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

        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-amber-400" />
          <span>Edit Profile Details</span>
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
    </div>
  );
}
