'use client';

import React, { useState } from 'react';
import { Users, X, Save, Loader2 } from 'lucide-react';
import { createUserAction } from '@/app/admin/actions';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuperAdmin?: boolean;
}

export function UserModal({ isOpen, onClose, isSuperAdmin = false }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createUserAction(formData);
      if (res.success) {
        setMessage(res.message || 'User account provisioned successfully!');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setMessage(`Error: ${res.error || 'Failed to create user'}`);
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
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">Provision User Account</h3>
            <p className="text-xs text-slate-500">Assign role permissions and credentials for executive members.</p>
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
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="e.g. Cmrd. Olumide Akande"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="secgen@yosufud.org"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Initial Password *</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">System Role</label>
            <select
              name="roleCode"
              defaultValue="SECRETARY_GENERAL"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none"
            >
              {isSuperAdmin && <option value="SUPER_ADMIN">SUPER_ADMIN (System Administrator)</option>}
              <option value="ADMIN">ADMIN (Full Content Manager)</option>
              <option value="PRESIDENT">PRESIDENT (Executive Chief)</option>
              <option value="VICE_PRESIDENT">VICE_PRESIDENT (Deputy Executive)</option>
              <option value="SECRETARY_GENERAL">SECRETARY_GENERAL (Secretariat & News)</option>
              <option value="PUBLISHER">PUBLISHER (Content Publisher)</option>
              <option value="EDITOR">EDITOR (Draft Content Editor)</option>
              <option value="TREASURER">TREASURER (Financial Projects)</option>
              <option value="AUDITOR">AUDITOR (Security Auditor)</option>
              <option value="GUEST_ADMIN">GUEST_ADMIN (Read Only)</option>
            </select>
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Save className="w-4 h-4 text-amber-400" />}
              <span>{loading ? 'Provisioning...' : 'Provision User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
