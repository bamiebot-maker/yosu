'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, X, Check, Save } from 'lucide-react';
import { upsertAboutContentAction, deleteAboutContentAction } from '@/app/admin/actions';

interface AboutSectionItem {
  id: string;
  sectionKey: string;
  title: string;
  subtitle: string | null;
  content: string;
  iconName: string | null;
  displayOrder: number;
}

export function AboutContentCrudPage({
  aboutSections,
  isSuperAdmin = false,
}: {
  aboutSections: AboutSectionItem[];
  isSuperAdmin?: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<AboutSectionItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultKeys = [
    { key: 'MAIN_INTRO', title: 'Institutional Overview', order: 1 },
    { key: 'MISSION', title: 'Our Mission', order: 2 },
    { key: 'VISION', title: 'Our Vision', order: 3 },
    { key: 'OBJECTIVES', title: 'Union Objectives', order: 4 },
    { key: 'HISTORY', title: 'Historical Heritage', order: 5 },
    { key: 'STUDENT_REPRESENTATION', title: 'Student Representation', order: 6 },
    { key: 'ACADEMIC_DEVELOPMENT', title: 'Academic Development', order: 7 },
    { key: 'CULTURE_PRESERVATION', title: 'Culture Preservation', order: 8 },
    { key: 'LEADERSHIP_UNITY', title: 'Leadership & Unity', order: 9 },
    { key: 'COMMUNITY_IMPACT', title: 'Community Impact', order: 10 },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await upsertAboutContentAction(formData);
      if (res.success) {
        setMessage(res.message || 'Saved section successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
          setEditingSection(null);
          setMessage(null);
        }, 1000);
      } else {
        setMessage(`Error: ${res.error || 'Failed to save section'}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content section?')) return;
    const res = await deleteAboutContentAction(id);
    if (res.success) {
      setMessage(res.message || 'Deleted successfully!');
      setTimeout(() => setMessage(null), 3000);
    } else {
      alert(res.error || 'Failed to delete section');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
            ABOUT YOSU CMS MANAGEMENT
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            Institutional About Sections ({aboutSections.length})
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure dynamic Mission, Vision, Objectives, History, Culture & Impact paragraphs.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSection(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Add About Section</span>
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

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aboutSections.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="bg-amber-100 text-amber-900 font-extrabold text-[9px] uppercase px-2.5 py-0.5 rounded border border-amber-300 font-mono">
                  {sec.sectionKey}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">Order: #{sec.displayOrder}</span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">
                  {sec.title}
                </h3>
                {sec.subtitle && (
                  <p className="text-xs text-amber-700 font-medium italic mt-0.5">{sec.subtitle}</p>
                )}
                <p className="text-xs text-slate-600 mt-2 line-clamp-4 leading-relaxed font-light">{sec.content}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditingSection(sec);
                  setIsModalOpen(true);
                }}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-lg border border-stone-200 transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" /> Edit
              </button>

              <button
                onClick={() => handleDelete(sec.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                title="Delete Section"
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
                setEditingSection(null);
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">
                  {editingSection ? 'Edit About Section' : 'Add About Content Section'}
                </h3>
                <p className="text-xs text-slate-500">Configure institutional paragraph and display order</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Section Key / Preset *
                </label>
                <input
                  type="text"
                  name="sectionKey"
                  required
                  defaultValue={editingSection?.sectionKey || 'MISSION'}
                  placeholder="e.g. MISSION, VISION, HISTORY, CULTURE"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Section Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingSection?.title || ''}
                  placeholder="e.g. Our Mission & Academic Charter"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={editingSection?.subtitle || ''}
                  placeholder="e.g. Empowering Yoruba Scholars Nationwide"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Detailed Section Content *
                </label>
                <textarea
                  name="content"
                  required
                  rows={5}
                  defaultValue={editingSection?.content || ''}
                  placeholder="Detailed institutional narrative text..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Display Order (1, 2, 3...)
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    defaultValue={editingSection?.displayOrder ?? 1}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Icon Name
                  </label>
                  <input
                    type="text"
                    name="iconName"
                    defaultValue={editingSection?.iconName || 'BookOpen'}
                    placeholder="e.g. Target, Eye, Award, Shield"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSection(null);
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
                  <span>{loading ? 'Saving...' : 'Save Section'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
