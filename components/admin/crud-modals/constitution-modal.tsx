'use client';

import React, { useState } from 'react';
import { BookOpen, X, Save, Loader2 } from 'lucide-react';
import { createConstitutionVersionAction } from '@/app/admin/actions';

interface ConstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConstitutionModal({ isOpen, onClose }: ConstitutionModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createConstitutionVersionAction(formData);
      if (res.success) {
        setMessage(res.message || 'Successfully saved!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setMessage(`Error: ${res.error || 'Failed to create constitution'}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center shrink-0 border border-emerald-800 shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">Add Constitution Gazette</h3>
            <p className="text-xs text-slate-500">Publish ratified constitutional amendments and gazette versions.</p>
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
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Version Title / Name *</label>
            <input
              type="text"
              name="versionName"
              required
              placeholder="e.g., 2026 Unification Constitution (Ratified Gazette)"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="isCurrent"
                value="true"
                defaultChecked
                className="w-4 h-4 text-emerald-800 rounded"
              />
              <span>Set as Active Ratified Constitution</span>
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
              <span>{loading ? 'Creating...' : 'Publish Version'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
