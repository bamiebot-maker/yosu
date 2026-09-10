'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  Save,
  X,
  User,
  Image as ImageIcon,
  FileText,
  Clock,
} from 'lucide-react';
import {
  createHistoryChapterAction,
  updateHistoryChapterAction,
  deleteHistoryChapterAction,
} from '@/app/admin/history-actions';

interface HistoryChapter {
  id: string;
  title: string;
  slug: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  isCurrent: boolean;
  theme?: string | null;
  presidentName?: string | null;
  presidentPhotoUrl?: string | null;
  presidentBio?: string | null;
  historicalNarrative?: string | null;
  motto?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

interface HistoryCrudPageProps {
  initialChapters: HistoryChapter[];
}

export function HistoryCrudPage({ initialChapters }: HistoryCrudPageProps) {
  const [chapters, setChapters] = useState<HistoryChapter[]>(initialChapters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<HistoryChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openCreateModal = () => {
    setEditingChapter(null);
    setIsModalOpen(true);
  };

  const openEditModal = (chapter: HistoryChapter) => {
    setEditingChapter(chapter);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setLoading(true);
    const res = await deleteHistoryChapterAction(id);
    setLoading(false);
    if (res.success) {
      setChapters((prev) => prev.filter((c) => c.id !== id));
      setMessage({ type: 'success', text: 'History chapter deleted successfully' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete chapter' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    if (editingChapter) {
      const res = await updateHistoryChapterAction(editingChapter.id, formData);
      setLoading(false);
      if (res.success && res.chapter) {
        setChapters((prev) =>
          prev.map((c) => (c.id === editingChapter.id ? (res.chapter as any) : c))
        );
        setIsModalOpen(false);
        setMessage({ type: 'success', text: 'History chapter updated successfully!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update chapter' });
      }
    } else {
      const res = await createHistoryChapterAction(formData);
      setLoading(false);
      if (res.success && res.chapter) {
        setChapters((prev) => [...prev, res.chapter as any]);
        setIsModalOpen(false);
        setMessage({ type: 'success', text: 'History chapter created successfully!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to create chapter' });
      }
    }
  };

  const formatDateForInput = (d?: string | Date | null) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 text-white p-6 rounded-3xl border border-emerald-900 shadow-lg">
        <div>
          <span className="bg-emerald-900 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            HISTORY & ADMINISTRATION CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100 mt-2">
            Historical Chapters & Past Presidents CMS
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-light mt-1">
            Update and order YOSU administration chapters as real history documents arrive from past presidents.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Administration Era</span>
        </button>
      </div>

      {/* NOTIFICATION FEEDBACK */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-500 hover:text-slate-900">
            ✕
          </button>
        </div>
      )}

      {/* CHAPTERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chapters.map((ch, index) => (
          <div
            key={ch.id}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 relative"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="bg-slate-900 text-amber-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-400/40">
                Chapter {index + 1} (Order: {ch.displayOrder})
              </span>
              <div className="flex items-center gap-2">
                {ch.isPublished ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Published
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                    <Clock className="w-3 h-3 text-amber-600" /> Draft
                  </span>
                )}
                {ch.isCurrent && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    Active Session
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">{ch.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                {new Date(ch.startDate).getFullYear()} – {ch.endDate ? new Date(ch.endDate).getFullYear() : 'Present'}
              </p>
            </div>

            {ch.presidentName && (
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  <span>President: {ch.presidentName}</span>
                </div>
                {ch.theme && (
                  <p className="text-slate-600 italic line-clamp-1">&ldquo;{ch.theme}&rdquo;</p>
                )}
              </div>
            )}

            {ch.historicalNarrative && (
              <p className="text-xs text-slate-600 line-clamp-3 bg-stone-50/50 p-3 rounded-xl border border-stone-100 font-light">
                {ch.historicalNarrative}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => openEditModal(ch)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1 border border-stone-300"
              >
                <Edit2 className="w-3.5 h-3.5 text-emerald-700" /> Edit Chapter
              </button>
              <button
                onClick={() => handleDelete(ch.id, ch.title)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1 border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-800" />
                {editingChapter ? 'Edit History Chapter / Era' : 'Add New History Chapter / Era'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Era / Session Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingChapter?.title || ''}
                    placeholder="e.g. 2015-2017 Expansion Era"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingChapter?.slug || ''}
                    placeholder="e.g. 2015-2017-expansion-era"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    defaultValue={formatDateForInput(editingChapter?.startDate)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Date (Leave blank if current)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    defaultValue={formatDateForInput(editingChapter?.endDate)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    President Name
                  </label>
                  <input
                    type="text"
                    name="presidentName"
                    defaultValue={editingChapter?.presidentName || ''}
                    placeholder="e.g. Cmrd. Ibrahim Sobur Bamidele"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    President Portrait URL
                  </label>
                  <input
                    type="text"
                    name="presidentPhotoUrl"
                    defaultValue={editingChapter?.presidentPhotoUrl || ''}
                    placeholder="https://... or /images/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tenure Theme / Motto
                </label>
                <input
                  type="text"
                  name="theme"
                  defaultValue={editingChapter?.theme || editingChapter?.motto || ''}
                  placeholder="e.g. Omoluabi Harmonization & Student Progress"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  President Bio / Short Profile
                </label>
                <textarea
                  name="presidentBio"
                  rows={2}
                  defaultValue={editingChapter?.presidentBio || ''}
                  placeholder="Brief background of the President..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Historical Narrative (Full History Record) *
                </label>
                <textarea
                  name="historicalNarrative"
                  rows={5}
                  required
                  defaultValue={editingChapter?.historicalNarrative || ''}
                  placeholder="Write or paste authentic history received from past presidents..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-200 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Timeline Set & Order (1 = 1st Tenure at bottom, 2 = 2nd Set, etc.) *
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    required
                    defaultValue={editingChapter?.displayOrder ?? 1}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    value="true"
                    defaultChecked={editingChapter ? editingChapter.isPublished : true}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <label htmlFor="isPublished" className="text-xs font-bold text-slate-800">
                    Publish Immediately
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    name="isCurrent"
                    value="true"
                    defaultChecked={editingChapter?.isCurrent || false}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <label htmlFor="isCurrent" className="text-xs font-bold text-slate-800">
                    Current Active Session
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save History Chapter'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
