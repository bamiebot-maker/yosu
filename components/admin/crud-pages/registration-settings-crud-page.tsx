'use client';

import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Calendar,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  BellRing,
  Users,
  Info,
  Clock,
} from 'lucide-react';
import { updateRegistrationSettingsAction } from '@/app/admin/actions';

interface SettingsData {
  id: string;
  registrationOpen: boolean;
  opensAt: string;
  closesAt: string;
  notice: string;
  closedMessage: string;
  academicSession: string;
  updatedAt: string;
}

export function RegistrationSettingsCrudPage({
  settings,
  totalRegistered,
}: {
  settings: SettingsData | null;
  totalRegistered: number;
}) {
  const [isOpen, setIsOpen] = useState(settings ? settings.registrationOpen : true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set('registrationOpen', isOpen ? 'true' : 'false');

    try {
      const res = await updateRegistrationSettingsAction(formData);
      if (res.success) {
        setMessage(res.message || 'Registration window settings saved successfully!');
      } else {
        setMessage(`Error: ${res.error}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
            SUPER ADMIN CONFIGURATION
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            Controlled Membership Registration Window
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage official opening/closing dates, registration status, notices, and automatic closing rules for student membership data capture.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-bold ${
            message.startsWith('Error')
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* REGISTRATION STATUS WIDGET (TASK 7) */}
      <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              LIVE REGISTRATION WINDOW TELEMETRY
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">Current Status & Metrics</h2>
          </div>

          {isOpen ? (
            <div className="px-4 py-2 bg-emerald-950 text-emerald-300 border-2 border-emerald-500 rounded-2xl flex items-center gap-2 font-bold text-xs shadow-lg">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span>🟢 REGISTRATION WINDOW IS OPEN</span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-rose-950 text-rose-300 border-2 border-rose-600 rounded-2xl flex items-center gap-2 font-bold text-xs shadow-lg">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>🔴 REGISTRATION WINDOW IS CLOSED</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Registered Members</span>
            <span className="text-2xl font-extrabold font-serif text-amber-400 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              {totalRegistered} Students
            </span>
            <span className="text-[10px] text-slate-400 block font-light">Stored in Neon PostgreSQL</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Opening Date</span>
            <span className="text-base font-bold text-white flex items-center gap-1.5 mt-1">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {settings?.opensAt || 'Not Specified'}
            </span>
            <span className="text-[10px] text-slate-400 block font-light">Official Registration Launch</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Closing Date</span>
            <span className="text-base font-bold text-amber-300 flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4 text-amber-400" />
              {settings?.closesAt || 'Not Specified'}
            </span>
            <span className="text-[10px] text-slate-400 block font-light">Auto-Closes at 23:59:59 WAT</span>
          </div>
        </div>
      </div>

      {/* REGISTRATION CONTROL FORM (TASK 1) */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-slate-900">Window Control Parameters</h2>
            <p className="text-xs text-slate-500">Toggle status, set start/end dates, and customize notices.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-400" />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {/* STATUS TOGGLE SWITCH */}
        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Registration Master Switch
            </span>
            <p className="text-xs text-slate-500">
              When toggled OFF or when today&apos;s date exceeds the closing date, the registration form and API endpoint are blocked.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow ${
              isOpen
                ? 'bg-emerald-950 text-emerald-300 border-2 border-emerald-600'
                : 'bg-rose-950 text-rose-300 border-2 border-rose-600'
            }`}
          >
            {isOpen ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-rose-400" />}
            <span>{isOpen ? '🟢 STATUS: OPEN' : '🔴 STATUS: CLOSED'}</span>
          </button>
        </div>

        {/* ACADEMIC SESSION & DATES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-100">
          <div>
            <label className="text-xs font-bold block mb-1 text-slate-700">Academic Session *</label>
            <input
              type="text"
              name="academicSession"
              required
              defaultValue={settings?.academicSession || '2026/2027'}
              placeholder="e.g. 2026/2027"
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1 text-slate-700">Opening Date (Optional)</label>
            <input
              type="date"
              name="opensAt"
              defaultValue={settings?.opensAt || ''}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1 text-slate-700">Closing Date (Optional)</label>
            <input
              type="date"
              name="closesAt"
              defaultValue={settings?.closesAt || ''}
              className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
            />
          </div>
        </div>

        {/* NOTICE TEXTAREA (OPEN STATE) */}
        <div className="space-y-1 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold block text-slate-700">
            Registration Notice (Displayed on /register when OPEN)
          </label>
          <textarea
            name="notice"
            rows={3}
            defaultValue={
              settings?.notice ||
              'Registration for the 2026/2027 Academic Session is currently open. Eligible students are advised to complete their registration before the deadline.'
            }
            placeholder="Notice explaining terms, session, or deadline..."
            className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
          />
        </div>

        {/* CLOSED MESSAGE TEXTAREA (CLOSED STATE) */}
        <div className="space-y-1 pt-2 border-t border-stone-100">
          <label className="text-xs font-bold block text-slate-700">
            Closed Message (Displayed on /register when CLOSED)
          </label>
          <textarea
            name="closedMessage"
            rows={3}
            defaultValue={
              settings?.closedMessage ||
              'Registration for membership is currently closed. Please follow the Yoruba Students\' Union official communication channels for updates regarding the next registration exercise.'
            }
            placeholder="Message explaining closure and future exercise announcements..."
            className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-400" />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
