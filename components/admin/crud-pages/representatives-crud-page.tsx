'use client';

import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Building2, Image as ImageIcon, X, Check } from 'lucide-react';
import {
  createRepresentativeAction,
  updateRepresentativeAction,
  deleteRepresentativeAction,
} from '@/app/admin/actions';

interface RepItem {
  id: string;
  fullName: string;
  stateOfOrigin: string;
  positionTitle: string;
  photoUrl: string | null;
  sessionId: string;
  session: {
    title: string;
    isCurrent: boolean;
  };
}

interface SessionOption {
  id: string;
  title: string;
  isCurrent: boolean;
}

export function RepresentativesCrudPage({
  representatives,
  sessions,
  isSuperAdmin = false,
}: {
  representatives: RepItem[];
  sessions: SessionOption[];
  isSuperAdmin?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRep, setEditingRep] = useState<RepItem | null>(null);
  const [search, setSearch] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('ALL');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredReps = representatives.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.stateOfOrigin.toLowerCase().includes(search.toLowerCase()) ||
      r.positionTitle.toLowerCase().includes(search.toLowerCase());
    const matchesSession = selectedSessionId === 'ALL' || r.sessionId === selectedSessionId;
    return matchesSearch && matchesSession;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      let res;
      if (editingRep) {
        res = await updateRepresentativeAction(editingRep.id, formData);
      } else {
        res = await createRepresentativeAction(formData);
      }

      if (res.success) {
        setMessage(res.message || 'Saved successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setEditingRep(null);
          setMessage(null);
        }, 1000);
      } else {
        setMessage(`Error: ${res.error || 'Failed to save representative'}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this representative?')) return;
    const res = await deleteRepresentativeAction(id);
    if (res.success) {
      setMessage(res.message || 'Deleted successfully!');
      setTimeout(() => setMessage(null), 3000);
    } else {
      alert(res.error || 'Failed to delete representative');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            HOUSE OF REPRESENTATIVES MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            State Delegates & Assembly Members ({representatives.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Dynamic assembly roster tied to specific Administration Sessions.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingRep(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Representative</span>
        </button>
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

      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200 w-full sm:w-auto flex-1">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search representatives by name, state, or office..."
            className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        <select
          value={selectedSessionId}
          onChange={(e) => setSelectedSessionId(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Administration Sessions</option>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} {s.isCurrent ? '(ACTIVE)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReps.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {r.photoUrl ? (
                    <img
                      src={r.photoUrl}
                      alt={r.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-400/40 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-400/40">
                      {r.fullName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                      {r.fullName}
                    </h3>
                    <span className="text-[11px] font-extrabold text-amber-700 block">
                      {r.stateOfOrigin} State Delegate
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{r.positionTitle}</span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    r.session.isCurrent
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-100 text-slate-600 border border-stone-200'
                  }`}
                >
                  {r.session.title}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditingRep(r);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-lg border border-stone-200 transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" /> Edit
              </button>

              <button
                onClick={() => handleDelete(r.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                title="Delete Representative"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative overflow-hidden">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingRep(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {editingRep ? 'Edit Representative' : 'Add House Representative'}
                </h3>
                <p className="text-xs text-slate-500">Configure state constituent assembly delegate</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  defaultValue={editingRep?.fullName || ''}
                  placeholder="e.g. Hon. Adebayo Sunkanmi"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Yoruba State *
                  </label>
                  <select
                    name="stateOfOrigin"
                    required
                    defaultValue={editingRep?.stateOfOrigin || 'Ekiti'}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value="Ekiti">Ekiti</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Ogun">Ogun</option>
                    <option value="Ondo">Ondo</option>
                    <option value="Osun">Osun</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Kwara">Kwara</option>
                    <option value="Kogi">Kogi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Position Title
                  </label>
                  <input
                    type="text"
                    name="positionTitle"
                    defaultValue={editingRep?.positionTitle || 'Representative'}
                    placeholder="e.g. Speaker / Representative"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Administration Session
                </label>
                <select
                  name="sessionId"
                  defaultValue={editingRep?.sessionId || sessions.find((s) => s.isCurrent)?.id}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} {s.isCurrent ? '(ACTIVE SESSION)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Photo URL (Optional / Cloudinary)
                </label>
                <input
                  type="url"
                  name="photoUrl"
                  defaultValue={editingRep?.photoUrl || ''}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingRep(null);
                  }}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>{loading ? 'Saving...' : 'Save Representative'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
