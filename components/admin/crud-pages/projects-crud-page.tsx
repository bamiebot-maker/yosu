'use client';

import React, { useState } from 'react';
import { FolderGit2, Plus, Edit3, Trash2 } from 'lucide-react';
import { ProjectModal } from '@/components/admin/crud-modals/project-modal';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import { deleteProjectAction } from '@/app/admin/actions';

interface ProjectItem {
  id: string;
  title: string;
  summary: string | null;
  description: string;
  status: string;
  progressPercentage: number;
}

export function ProjectsCrudPage({ projects }: { projects: ProjectItem[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<ProjectItem | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
            TRANSPARENCY & PROJECTS CMS
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            Development Projects ({projects.length})
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage union welfare initiatives, infrastructure projects, and progress tracking.
          </p>
        </div>

        <button
          onClick={() => {
            setProjectToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center space-y-3">
            <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-slate-900">No Development Projects</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first transparency project to publish progress updates and budgets.
            </p>
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-amber-400/50 transition-all"
            >
              <div className="space-y-2 max-w-2xl w-full">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-950 text-amber-300 text-[9px] font-extrabold px-2.5 py-0.5 rounded uppercase border border-emerald-800">
                    {proj.status}
                  </span>
                  <span className="text-xs text-amber-600 font-extrabold">{proj.progressPercentage}% Completed</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-slate-900">{proj.title}</h3>
                <p className="text-xs text-slate-600 font-light line-clamp-2">{proj.summary || proj.description}</p>

                {/* Progress Bar */}
                <div className="w-full bg-stone-100 rounded-full h-2 max-w-md pt-1">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${proj.progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setProjectToEdit(proj)}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-stone-200 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" /> Edit
                </button>
                <button
                  onClick={() => setProjectToDelete(proj)}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors border border-rose-200 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={isAddModalOpen || !!projectToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setProjectToEdit(null);
        }}
        projectToEdit={projectToEdit}
      />

      {projectToDelete && (
        <DeleteConfirmModal
          isOpen={!!projectToDelete}
          onClose={() => setProjectToDelete(null)}
          title="Delete Development Project"
          itemTitle={projectToDelete.title}
          onConfirm={async () => {
            await deleteProjectAction(projectToDelete.id);
          }}
        />
      )}
    </div>
  );
}
