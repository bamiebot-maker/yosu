'use client';

import React, { useState } from 'react';
import { FolderGit2, X, Save, Loader2 } from 'lucide-react';
import { createProjectAction, updateProjectAction } from '@/app/admin/actions';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: {
    id: string;
    title: string;
    summary: string | null;
    description: string;
    status: string;
    progressPercentage: number;
  } | null;
}

export function ProjectModal({ isOpen, onClose, projectToEdit }: ProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(projectToEdit?.progressPercentage || 50);

  if (!isOpen) return null;

  const isEditing = !!projectToEdit;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set('progressPercentage', progress.toString());

    try {
      const res = isEditing
        ? await updateProjectAction(projectToEdit.id, formData)
        : await createProjectAction(formData);

      if (res.success) {
        setMessage(res.message || 'Successfully saved!');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setMessage(`Error: ${res.error || 'Failed to save project'}`);
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
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-slate-900">
              {isEditing ? 'Edit Development Project' : 'Create Transparency Project'}
            </h3>
            <p className="text-xs text-slate-500">Track union welfare initiatives, infrastructure, and progress.</p>
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
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Project Title *</label>
            <input
              type="text"
              name="title"
              defaultValue={projectToEdit?.title || ''}
              required
              placeholder="e.g., Campus Wi-Fi & Digital Library Resource Integration"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Summary Description *</label>
            <textarea
              name="summary"
              rows={2}
              defaultValue={projectToEdit?.summary || ''}
              required
              placeholder="Brief overview for public progress tracker..."
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Project Status</label>
              <select
                name="status"
                defaultValue={projectToEdit?.status || 'IN_PROGRESS'}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="PLANNED">PLANNED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="ON_HOLD">ON HOLD</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span>Progress</span>
                <span className="text-amber-600 font-extrabold">{progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer pt-2"
              />
            </div>
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
              <span>{loading ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
