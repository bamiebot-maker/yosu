'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Users, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { ExecutiveModal } from '@/components/admin/crud-modals/executive-modal';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import { deleteExecutiveAppointmentAction } from '@/app/admin/actions';

interface ExecutiveAppointmentItem {
  id: string;
  person: {
    fullName: string;
    stateOfOrigin: string | null;
    department: string | null;
    level: string | null;
    bio: string | null;
    avatarMedia: { url: string } | null;
  };
  office: {
    title: string;
    category: string;
  };
}

export function ExecutivesCrudPage({ appointments }: { appointments: ExecutiveAppointmentItem[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<ExecutiveAppointmentItem | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<ExecutiveAppointmentItem | null>(null);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
            LEADERSHIP ROSTER MANAGEMENT
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            Executive & Legislative Roster ({appointments.length})
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage officer portfolios, state origin delegations, and leadership appointments.
          </p>
        </div>

        <button
          onClick={() => {
            setAppointmentToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Appoint Executive</span>
        </button>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-amber-400/40 relative overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-lg">
                  {appt.person.avatarMedia?.url ? (
                    <Image
                      src={appt.person.avatarMedia.url}
                      alt={appt.person.fullName}
                      fill
                      className="object-cover object-top"
                    />
                  ) : (
                    <span>{appt.person.fullName.charAt(0)}</span>
                  )}
                </div>

                <div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase block mb-0.5">
                    {appt.office.title}
                  </span>
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">{appt.person.fullName}</h3>
                  <span className="text-xs text-slate-500">{appt.person.stateOfOrigin} State Delegation</span>
                </div>
              </div>

              {appt.person.department && (
                <p className="text-xs text-slate-600 font-medium">
                  Department: <span className="text-slate-900 font-bold">{appt.person.department}</span>
                </p>
              )}

              {appt.person.bio && (
                <p className="text-xs text-slate-500 line-clamp-2 font-light">{appt.person.bio}</p>
              )}
            </div>

            <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Active Appointment
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAppointmentToEdit(appt)}
                  className="p-1.5 bg-white hover:bg-stone-200 text-slate-700 rounded-lg border border-stone-200 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setAppointmentToDelete(appt)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ExecutiveModal
        isOpen={isAddModalOpen || !!appointmentToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setAppointmentToEdit(null);
        }}
        appointmentToEdit={appointmentToEdit}
      />

      {appointmentToDelete && (
        <DeleteConfirmModal
          isOpen={!!appointmentToDelete}
          onClose={() => setAppointmentToDelete(null)}
          title="Delete Executive Appointment"
          itemTitle={appointmentToDelete.person.fullName}
          onConfirm={async () => {
            await deleteExecutiveAppointmentAction(appointmentToDelete.id);
          }}
        />
      )}
    </div>
  );
}
