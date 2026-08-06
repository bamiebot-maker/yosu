'use client';

import React, { useState } from 'react';
import { Crown, Check, Save } from 'lucide-react';
import { ImageUploader } from '@/components/ui/image-uploader';
import { upsertPresidentialWelcomeAction } from '@/app/admin/actions';

interface SessionOption {
  id: string;
  title: string;
  isCurrent: boolean;
}

interface WelcomeMessageItem {
  id: string;
  presidentName: string;
  officeTitle: string;
  stateOfOrigin: string;
  sessionTitle: string;
  portraitUrl: string | null;
  welcomeSummary: string;
  fullMessage: string;
  isActive: boolean;
}

export function WelcomeMessageCrudPage({
  welcomeMessage,
  sessions,
  isSuperAdmin = false,
}: {
  welcomeMessage: WelcomeMessageItem | null;
  sessions: SessionOption[];
  isSuperAdmin?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await upsertPresidentialWelcomeAction(formData);
      if (res.success) {
        setMessage(res.message || 'Presidential Welcome Address saved successfully!');
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage(`Error: ${res.error || 'Failed to save address'}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block">
            HOMEPAGE HERO CMS & PRESIDENTIAL WELCOME
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Executive President&apos;s Welcome Address
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Dynamic welcome speech displayed prominently on the homepage hero section.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold ${
            message.startsWith('Error')
              ? 'bg-rose-100 text-rose-900 border border-rose-300'
              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
          }`}
        >
          {message}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        {welcomeMessage?.id && <input type="hidden" name="id" value={welcomeMessage.id} />}

        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900">Presidential Information & Speech</h3>
            <p className="text-xs text-slate-500">Configure portrait photo, official title, and welcome text</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              President&apos;s Full Name *
            </label>
            <input
              type="text"
              name="presidentName"
              required
              defaultValue={welcomeMessage?.presidentName || 'Cmrd. Ibrahim Sobur Bamidele'}
              placeholder="e.g. Cmrd. Ibrahim Sobur Bamidele"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Office Title
            </label>
            <input
              type="text"
              name="officeTitle"
              defaultValue={welcomeMessage?.officeTitle || 'Executive President'}
              placeholder="e.g. Executive President"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Yoruba State of Origin
            </label>
            <select
              name="stateOfOrigin"
              defaultValue={welcomeMessage?.stateOfOrigin || 'Ekiti State'}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none text-slate-900"
            >
              <option value="Ekiti State">Ekiti State</option>
              <option value="Lagos State">Lagos State</option>
              <option value="Ogun State">Ogun State</option>
              <option value="Ondo State">Ondo State</option>
              <option value="Osun State">Osun State</option>
              <option value="Oyo State">Oyo State</option>
              <option value="Kwara State">Kwara State</option>
              <option value="Kogi State (Okun)">Kogi State (Okun)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Administration Session
            </label>
            <input
              type="text"
              name="sessionTitle"
              defaultValue={welcomeMessage?.sessionTitle || '2026/2027 Progress Era Session'}
              placeholder="e.g. 2026/2027 Progress Era Session"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none text-slate-900"
            />
          </div>
        </div>

        <ImageUploader
          name="portraitUrl"
          defaultValue={welcomeMessage?.portraitUrl || '/images/gallery/sobur-certificate-presentation.jpg'}
          label="President Portrait Photo (Upload File / Cloudinary)"
        />

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Homepage Hero Welcome Summary (Short Excerpt) *
          </label>
          <textarea
            name="welcomeSummary"
            required
            rows={3}
            defaultValue={
              welcomeMessage?.welcomeSummary ||
              "On behalf of the Executive Council and the entire Yoruba Students' Union (YOSU) at Federal University Dutse, I warmly welcome you to our official digital portal. We remain committed to academic excellence, cultural preservation, and student welfare."
            }
            placeholder="Brief summary displayed directly on the hero card..."
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Full Presidential Welcome Address (Displayed in Modal / Page) *
          </label>
          <textarea
            name="fullMessage"
            required
            rows={8}
            defaultValue={
              welcomeMessage?.fullMessage ||
              `Greetings Great Yoruba Students of Federal University Dutse!

It is with immense humility and gratitude that I address you as the President of our esteemed union for the 2026/2027 Progress Era.

Our administration stands firmly on the pillars of Unity, Integrity, Academic Superiority, and Cultural Heritage. Through our interactive digital platforms, transparency initiatives, and legislative representation across all 8 Yoruba constituent states, we are transforming student governance at FUD.

I encourage every member to engage with our constitution, participate in union projects, and leverage our central media library. Together, we shall elevate YOSU to unprecedented heights.

Long Live YOSU! Long Live Federal University Dutse! Long Live the Federal Republic of Nigeria!`
            }
            placeholder="Full welcome speech text..."
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-stone-100">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>{loading ? 'Saving Address...' : 'Save Welcome Address'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
