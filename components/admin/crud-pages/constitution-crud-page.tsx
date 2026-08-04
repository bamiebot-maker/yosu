'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { ConstitutionModal } from '@/components/admin/crud-modals/constitution-modal';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import { deleteConstitutionVersionAction } from '@/app/admin/actions';

interface ConstitutionVersionItem {
  id: string;
  versionName: string;
  effectiveDate: Date;
  isCurrent: boolean;
  assentedBy: string | null;
}

export function ConstitutionCrudPage({ versions }: { versions: ConstitutionVersionItem[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<ConstitutionVersionItem | null>(null);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            CONSTITUTIONAL GAZETTES & AMENDMENTS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Constitution Version History ({versions.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage ratified constitutional versions, amendments, and public gazette download archives.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Upload Constitution Gazette</span>
        </button>
      </div>

      {/* Version List */}
      <div className="space-y-4">
        {versions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-slate-900">No Constitution Versions</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your first ratified constitution gazette version.
            </p>
          </div>
        ) : (
          versions.map((ver) => (
            <div
              key={ver.id}
              className={`bg-white p-6 rounded-2xl border ${
                ver.isCurrent ? 'border-2 border-emerald-700 shadow-md bg-emerald-50/20' : 'border-stone-200 shadow-sm'
              } flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                    {ver.versionName}
                  </span>

                  {ver.isCurrent ? (
                    <span className="bg-emerald-950 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase flex items-center gap-1 border border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> RATIFIED IN FORCE
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-stone-200">
                      SUPERSEDED HISTORICAL VERSION
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-lg text-slate-900">{ver.versionName}</h3>
                <p className="text-[11px] text-slate-400">
                  Effective Date: {new Date(ver.effectiveDate).toLocaleDateString()}
                </p>
              </div>

              {!ver.isCurrent && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setVersionToDelete(ver)}
                    className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors border border-rose-200 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete Version
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <ConstitutionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {versionToDelete && (
        <DeleteConfirmModal
          isOpen={!!versionToDelete}
          onClose={() => setVersionToDelete(null)}
          title="Delete Constitution Version"
          itemTitle={versionToDelete.versionName}
          onConfirm={async () => {
            await deleteConstitutionVersionAction(versionToDelete.id);
          }}
        />
      )}
    </div>
  );
}
