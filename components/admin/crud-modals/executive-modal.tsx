'use client';

import React, { useState } from 'react';
import { Users, X, Save, Loader2 } from 'lucide-react';
import { createExecutiveAppointmentAction, updateExecutiveAppointmentAction } from '@/app/admin/actions';
import { ImageUploader } from '@/components/ui/image-uploader';

interface ExecutiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentToEdit?: {
    id: string;
    person: {
      fullName: string;
      stateOfOrigin: string | null;
      department: string | null;
      phoneNumber?: string | null;
      bio: string | null;
      avatarMedia?: { url: string } | null;
    };
    office: {
      title: string;
    };
  } | null;
}

export function ExecutiveModal({ isOpen, onClose, appointmentToEdit }: ExecutiveModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEditing = !!appointmentToEdit;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = isEditing
        ? await updateExecutiveAppointmentAction(appointmentToEdit.id, formData)
        : await createExecutiveAppointmentAction(formData);

      if (res.success) {
        setMessage(res.message || 'Successfully saved!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setMessage(`Error: ${res.error || 'Failed to save executive'}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
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
            <h3 className="font-serif font-bold text-xl text-slate-900">
              {isEditing ? 'Edit Executive Officer' : 'Appoint New Executive Officer'}
            </h3>
            <p className="text-xs text-slate-500">Assign leadership offices, state origins, and portfolios.</p>
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
              defaultValue={appointmentToEdit?.person.fullName || ''}
              required
              placeholder="e.g., Cmrd. Ibrahim Sobur Bamidele"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Executive Position / Office Title *
            </label>
            <input
              type="text"
              name="officeTitle"
              defaultValue={appointmentToEdit?.office.title || ''}
              required
              list="executive-positions-list"
              placeholder="e.g., Executive President, Vice President, General Secretary"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
            />
            <datalist id="executive-positions-list">
              <option value="Executive President" />
              <option value="Vice President" />
              <option value="General Secretary" />
              <option value="Assistant General Secretary" />
              <option value="Financial Secretary" />
              <option value="Treasurer" />
              <option value="Public Relations Officer (PRO)" />
              <option value="Social Director" />
              <option value="Sports Director" />
              <option value="Welfare Director" />
              <option value="Auditor General" />
              <option value="Speaker (House of Reps)" />
              <option value="Deputy Speaker" />
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">State of Origin</label>
              <select
                name="stateOfOrigin"
                defaultValue={appointmentToEdit?.person.stateOfOrigin || 'Oyo'}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="Ekiti">Ekiti State</option>
                <option value="Kwara">Kwara State</option>
                <option value="Oyo">Oyo State</option>
                <option value="Osun">Osun State</option>
                <option value="Ondo">Ondo State</option>
                <option value="Ogun">Ogun State</option>
                <option value="Lagos">Lagos State</option>
                <option value="Kogi">Kogi State (Okun)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Academic Department</label>
              <input
                type="text"
                name="department"
                defaultValue={appointmentToEdit?.person.department || ''}
                placeholder="e.g., Public Administration"
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Phone Number / WhatsApp Contact
            </label>
            <input
              type="text"
              name="phoneNumber"
              defaultValue={(appointmentToEdit?.person as any)?.phoneNumber || (appointmentToEdit?.person as any)?.phone || ''}
              placeholder="e.g., +234 801 234 5678"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
            />
          </div>

          <ImageUploader
            name="imageUrl"
            defaultValue={appointmentToEdit?.person.avatarMedia?.url || ''}
            label="Official Headshot Photo"
            presets={[
              { label: 'President Sobur', url: '/images/leadership/president-sobur.jpg' },
              { label: 'VP Latifat', url: '/images/leadership/vp-latifat.jpg' },
              { label: 'Speaker Alabi', url: '/images/leadership/speaker-alabi.jpg' },
              { label: 'SecGen Olumide', url: '/images/leadership/secgen-olumide.jpg' },
              { label: 'FinSec Arike', url: '/images/leadership/finsec-arike.jpg' },
              { label: 'Treasurer Trimiz', url: '/images/leadership/treasurer-trimiz.jpg' },
              { label: 'Auditor Hameedat', url: '/images/leadership/auditor-hameedat.jpg' },
              { label: 'OBA Fouad', url: '/images/leadership/oba-procession.jpg' },
            ]}
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Biography / Portfolio Quote</label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={appointmentToEdit?.person.bio || ''}
              placeholder="Brief portfolio bio..."
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none"
            />
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
              <span>{loading ? 'Saving...' : isEditing ? 'Update Officer' : 'Appoint Officer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
