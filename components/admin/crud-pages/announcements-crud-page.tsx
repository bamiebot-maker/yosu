'use client';

import React, { useState } from 'react';
import { Megaphone, Plus, Pin, Calendar, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { AnnouncementModal } from '@/components/admin/crud-modals/announcement-modal';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import { deleteAnnouncementAction } from '@/app/admin/actions';

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  type: string;
  isPinned: boolean;
  isActive: boolean;
  linkUrl: string | null;
  expiryDate: Date | null;
}

export function AnnouncementsCrudPage({ announcements }: { announcements: AnnouncementItem[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState<AnnouncementItem | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<AnnouncementItem | null>(null);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            PUBLIC BROADCAST SYSTEM
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Announcements & Emergency Banners ({announcements.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Publish homepage alerts, breaking ticker notices, pinned bulletins, and emergency banners.
          </p>
        </div>

        <button
          onClick={() => {
            setAnnouncementToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center space-y-3">
            <Megaphone className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-slate-900">No Active Announcements</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first bulletin or homepage banner notice to publish real-time alerts to union members.
            </p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white p-6 rounded-2xl border ${
                ann.isPinned ? 'border-amber-400 shadow-md bg-amber-50/30' : 'border-stone-200 shadow-sm'
              } flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  {ann.isPinned && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase inline-flex items-center gap-1">
                      <Pin className="w-3 h-3" /> PINNED BULLETIN
                    </span>
                  )}

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                      ann.type === 'URGENT'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : ann.type === 'MARQUEE'
                        ? 'bg-emerald-950 text-amber-300 border border-emerald-800'
                        : 'bg-stone-100 text-slate-700 border border-stone-200'
                    }`}
                  >
                    {ann.type}
                  </span>

                  {ann.isActive ? (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live Broadcast
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Inactive</span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-lg text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">{ann.content}</p>

                {ann.expiryDate && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    Expires: {new Date(ann.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setAnnouncementToEdit(ann)}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-stone-200 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" /> Edit
                </button>
                <button
                  onClick={() => setAnnouncementToDelete(ann)}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors border border-rose-200 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AnnouncementModal
        isOpen={isAddModalOpen || !!announcementToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setAnnouncementToEdit(null);
        }}
        announcementToEdit={announcementToEdit}
      />

      {announcementToDelete && (
        <DeleteConfirmModal
          isOpen={!!announcementToDelete}
          onClose={() => setAnnouncementToDelete(null)}
          title="Delete Announcement"
          itemTitle={announcementToDelete.title}
          onConfirm={async () => {
            await deleteAnnouncementAction(announcementToDelete.id);
          }}
        />
      )}
    </div>
  );
}
