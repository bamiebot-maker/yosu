'use client';

import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Award, CheckCircle2, Clock, X, Check } from 'lucide-react';
import {
  createAchievementAction,
  updateAchievementAction,
  deleteAchievementAction,
} from '@/app/admin/actions';

interface AchievementItem {
  id: string;
  title: string;
  description: string;
  progressPercentage: number;
  status: string;
  imageUrl: string | null;
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

export function AchievementsCrudPage({
  achievements,
  sessions,
  isSuperAdmin = false,
}: {
  achievements: AchievementItem[];
  sessions: SessionOption[];
  isSuperAdmin?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<AchievementItem | null>(null);
  const [search, setSearch] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('ALL');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredAchievements = achievements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesSession = selectedSessionId === 'ALL' || a.sessionId === selectedSessionId;
    return matchesSearch && matchesSession;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      let res;
      if (editingAchievement) {
        res = await updateAchievementAction(editingAchievement.id, formData);
      } else {
        res = await createAchievementAction(formData);
      }

      if (res.success) {
        setMessage(res.message || 'Saved successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setEditingAchievement(null);
          setMessage(null);
        }, 1000);
      } else {
        setMessage(`Error: ${res.error || 'Failed to save achievement'}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement record?')) return;
    const res = await deleteAchievementAction(id);
    if (res.success) {
      setMessage(res.message || 'Deleted successfully!');
      setTimeout(() => setMessage(null), 3000);
    } else {
      alert(res.error || 'Failed to delete achievement');
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            EXECUTIVE ERA ACHIEVEMENTS & MILESTONES
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Institutional Accomplishments ({achievements.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Dynamic progress tracking for flagship executive era initiatives.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingAchievement(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add Achievement</span>
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
            placeholder="Search achievements by title or description..."
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
        {filteredAchievements.map((a) => {
          const isCompleted = a.progressPercentage >= 100;
          return (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span
                    className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                    {isCompleted ? 'Completed' : `${a.progressPercentage}% Ongoing`}
                  </span>

                  <span className="text-[10px] font-mono text-slate-500 font-bold bg-stone-100 px-2 py-0.5 rounded">
                    {a.session.title}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                    {a.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-3">{a.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Progress Metric</span>
                    <span>{a.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${a.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingAchievement(a);
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-lg border border-stone-200 transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" /> Edit
                </button>

                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                  title="Delete Achievement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative overflow-hidden">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingAchievement(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {editingAchievement ? 'Edit Achievement' : 'Add Executive Achievement'}
                </h3>
                <p className="text-xs text-slate-500">Configure key milestone and completion progress</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingAchievement?.title || ''}
                  placeholder="e.g. Digital Constitution Launch"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={editingAchievement?.description || ''}
                  placeholder="Detailed summary of this achievement initiative..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Completion Progress (0-100%) *
                  </label>
                  <input
                    type="number"
                    name="progressPercentage"
                    min="0"
                    max="100"
                    required
                    defaultValue={editingAchievement?.progressPercentage ?? 80}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Session
                  </label>
                  <select
                    name="sessionId"
                    defaultValue={editingAchievement?.sessionId || sessions.find((s) => s.isCurrent)?.id}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} {s.isCurrent ? '(ACTIVE)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Image URL (Optional / Cloudinary)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  defaultValue={editingAchievement?.imageUrl || ''}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAchievement(null);
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
                  <span>{loading ? 'Saving...' : 'Save Achievement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
