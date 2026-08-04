'use client';

import React, { useState } from 'react';
import { Layers, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { SessionModal } from '@/components/admin/crud-modals/session-modal';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import { setActiveSessionAction, deleteSessionAction } from '@/app/admin/actions';

interface SessionItem {
  id: string;
  title: string;
  theme: string | null;
  isCurrent: boolean;
  _count: {
    appointments: number;
    albums: number;
    projects: number;
  };
}

export function SessionsCrudPage({ sessions }: { sessions: SessionItem[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<SessionItem | null>(null);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            ADMINISTRATION MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Sessions & Administrations Manager ({sessions.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage multi-session leadership archives, create future academic sessions, and toggle active platform administration.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>New Session</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="space-y-6">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className={`bg-white rounded-3xl border ${
              sess.isCurrent ? 'border-2 border-amber-400 shadow-xl' : 'border-stone-200 shadow-sm'
            } overflow-hidden space-y-4 p-6 sm:p-8`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">{sess.title}</h2>
                  {sess.isCurrent ? (
                    <span className="bg-emerald-950 text-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      ACTIVE PLATFORM SESSION
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border border-stone-200">
                      HISTORICAL ARCHIVE
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-emerald-900">
                  Theme: {sess.theme || 'Standard Academic Administration'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!sess.isCurrent && (
                  <button
                    onClick={async () => {
                      await setActiveSessionAction(sess.id);
                    }}
                    className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-xl transition-colors border border-emerald-300"
                  >
                    Set as Active
                  </button>
                )}
                {!sess.isCurrent && (
                  <button
                    onClick={() => setSessionToDelete(sess)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                  Appointments Bound
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {sess._count.appointments} Confirmed Officers
                </span>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                  Media Archives
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {sess._count.albums} Photo Albums
                </span>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                  Projects Tracker
                </span>
                <span className="font-bold text-slate-900 text-sm block">
                  {sess._count.projects} Active Projects
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <SessionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {sessionToDelete && (
        <DeleteConfirmModal
          isOpen={!!sessionToDelete}
          onClose={() => setSessionToDelete(null)}
          title="Delete Administration Session"
          itemTitle={sessionToDelete.title}
          onConfirm={async () => {
            await deleteSessionAction(sessionToDelete.id);
          }}
        />
      )}
    </div>
  );
}
