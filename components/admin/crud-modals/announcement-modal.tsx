'use client';

import React, { useState } from 'react';
import { Megaphone, X, Save, Loader2 } from 'lucide-react';
import { createAnnouncementAction, updateAnnouncementAction } from '@/app/admin/actions';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcementToEdit?: {
    id: string;
    title: string;
    content: string;
    type: string;
    isPinned: boolean;
    isActive: boolean;
    linkUrl: string | null;
  } | null;
}

export function AnnouncementModal({ isOpen, onClose, announcementToEdit }: AnnouncementModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEditing = !!announcementToEdit;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = isEditing
        ? await updateAnnouncementAction(announcementToEdit.id, formData)
        : await createAnnouncementAction(formData);

      if (res.success) {
        setMessage(res.message || 'Successfully saved!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setMessage(`Error: ${res.error || 'Failed to save announcement'}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center shrink-0 border border-emerald-800 shadow-md">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              {isEditing ? 'Edit Announcement' : 'Create Public Announcement'}
            </h3>
            <p className="text-xs text-slate-500">Publish alerts, emergency banners, or ticker updates.</p>
          </div>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs font-bold ${
              message.startsWith('Error') ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Announcement Title *</label>
            <input
              type="text"
              name="title"
              defaultValue={announcementToEdit?.title || ''}
              required
              placeholder="e.g., Emergency General Congress Assembly Notice"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Message Content *</label>
            <textarea
              name="content"
              rows={3}
              defaultValue={announcementToEdit?.content || ''}
              required
              placeholder="Detailed announcement broadcast message..."
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Alert Type</label>
              <select
                name="type"
                defaultValue={announcementToEdit?.type || 'INFO'}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="INFO">INFO (Standard Bulletin)</option>
                <option value="URGENT">URGENT (Red Emergency Banner)</option>
                <option value="MARQUEE">MARQUEE (Scrolling Marquee Ticker)</option>
                <option value="EVENT">EVENT (Program Notice)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Action Link (Optional)</label>
              <input
                type="url"
                name="linkUrl"
                defaultValue={announcementToEdit?.linkUrl || ''}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isPinned"
                value="true"
                defaultChecked={announcementToEdit?.isPinned ?? false}
                className="w-4 h-4 text-emerald-800 rounded"
              />
              <span>Pin to Top</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked={announcementToEdit?.isActive ?? true}
                className="w-4 h-4 text-emerald-800 rounded"
              />
              <span>Active Broadcast</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-400" />}
              <span>{loading ? 'Saving...' : isEditing ? 'Update Alert' : 'Publish Alert'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
