'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, CheckCircle2, Trash2, FileText, Award, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { ConstitutionModal } from '@/components/admin/crud-modals/constitution-modal';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import {
  deleteConstitutionVersionAction,
  addConstitutionArticleAction,
  addConstitutionAmendmentAction,
} from '@/app/admin/actions';

interface ConstitutionVersionItem {
  id: string;
  versionName: string;
  edition: string;
  effectiveDate: Date;
  isCurrent: boolean;
  assentedBy: string | null;
  speakerCertBy: string | null;
  sessionTitle: string;
  articlesCount: number;
  amendmentsCount: number;
  articles: {
    id: string;
    articleNumber: number;
    title: string;
    overview: string | null;
    sectionsCount: number;
  }[];
  amendments: {
    id: string;
    proposedBy: string;
    amendmentSummary: string;
  }[];
}

interface SessionOption {
  id: string;
  title: string;
}

export function ConstitutionCrudPage({
  versions,
  sessions,
}: {
  versions: ConstitutionVersionItem[];
  sessions: SessionOption[];
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [versionToDelete, setVersionToDelete] = useState<ConstitutionVersionItem | null>(null);
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(
    versions.find((v) => v.isCurrent)?.id || versions[0]?.id || null
  );

  // Form states for adding articles & amendments inline
  const [activeAddArticleVersionId, setActiveAddArticleVersionId] = useState<string | null>(null);
  const [activeAddAmendmentVersionId, setActiveAddAmendmentVersionId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedVersionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            SUPER ADMIN CONSTITUTION & GAZETTE MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Constitution Versions & Articles ({versions.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage ratified constitutional versions, codified articles, sub-sections, and amendment records.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Upload New Constitution Version</span>
        </button>
      </div>

      {/* Version List */}
      <div className="space-y-6">
        {versions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-slate-900">No Constitution Versions Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your first ratified constitution gazette version to populate the online reader.
            </p>
          </div>
        ) : (
          versions.map((ver) => {
            const isExpanded = expandedVersionId === ver.id;
            return (
              <div
                key={ver.id}
                className={`bg-white rounded-2xl border transition-all ${
                  ver.isCurrent ? 'border-2 border-emerald-700 shadow-md' : 'border-stone-200 shadow-sm'
                }`}
              >
                {/* Main Version Banner Header */}
                <div
                  onClick={() => toggleExpand(ver.id)}
                  className="p-6 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase">
                        {ver.versionName}
                      </span>

                      {ver.isCurrent ? (
                        <span className="bg-emerald-950 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase flex items-center gap-1 border border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> ACTIVE RATIFIED LAW
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-stone-200">
                          SUPERSEDED ARCHIVE
                        </span>
                      )}

                      <span className="text-xs font-semibold text-slate-500 bg-stone-100 px-2.5 py-0.5 rounded">
                        {ver.sessionTitle}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-xl text-slate-900">{ver.versionName}</h3>
                    <p className="text-xs text-slate-500">
                      Effective Date: {new Date(ver.effectiveDate).toLocaleDateString()} • {ver.articlesCount} Articles • {ver.amendmentsCount} Amendments
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {!ver.isCurrent && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setVersionToDelete(ver);
                        }}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors border border-rose-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Delete
                      </button>
                    )}

                    <div className="p-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Article & Amendment Management Stream */}
                {isExpanded && (
                  <div className="p-6 space-y-6 bg-slate-50/50 rounded-b-2xl border-t border-stone-100">
                    {/* Toolbar Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-stone-200">
                      <button
                        type="button"
                        onClick={() => setActiveAddArticleVersionId(ver.id)}
                        className="px-4 py-2 bg-slate-900 text-amber-300 font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add New Article</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveAddAmendmentVersionId(ver.id)}
                        className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Add Amendment Record</span>
                      </button>
                    </div>

                    {/* Inline Add Article Form */}
                    {activeAddArticleVersionId === ver.id && (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          await addConstitutionArticleAction(ver.id, formData);
                          setActiveAddArticleVersionId(null);
                        }}
                        className="p-5 bg-white rounded-2xl border border-stone-300 space-y-4 shadow-sm"
                      >
                        <h4 className="font-serif font-bold text-sm text-slate-900">Add Article to {ver.versionName}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-bold block mb-1">Article Number *</label>
                            <input
                              type="number"
                              name="articleNumber"
                              required
                              defaultValue={ver.articlesCount + 1}
                              className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs font-bold"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-xs font-bold block mb-1">Article Title *</label>
                            <input
                              type="text"
                              name="title"
                              required
                              placeholder="e.g. ELECTIONS AND DISCIPLINE"
                              className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold block mb-1">Article Overview / Summary</label>
                          <textarea
                            name="overview"
                            rows={2}
                            placeholder="Brief summary of what this article covers..."
                            className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveAddArticleVersionId(null)}
                            className="px-4 py-2 bg-stone-100 text-xs font-bold rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-950 text-white text-xs font-bold rounded-lg"
                          >
                            Save Article
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Inline Add Amendment Form */}
                    {activeAddAmendmentVersionId === ver.id && (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          await addConstitutionAmendmentAction(ver.id, formData);
                          setActiveAddAmendmentVersionId(null);
                        }}
                        className="p-5 bg-amber-50 rounded-2xl border border-amber-300 space-y-4 shadow-sm"
                      >
                        <h4 className="font-serif font-bold text-sm text-amber-950">Add Amendment Record to {ver.versionName}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold block mb-1">Proposed By *</label>
                            <input
                              type="text"
                              name="proposedBy"
                              required
                              placeholder="e.g. Constitutional Review Committee (CRC)"
                              className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold block mb-1">Date Proposed *</label>
                            <input
                              type="date"
                              name="dateProposed"
                              required
                              defaultValue="2026-06-20"
                              className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold block mb-1">Amendment Summary *</label>
                          <input
                            type="text"
                            name="amendmentSummary"
                            required
                            placeholder="e.g. Codified Article Seven Section 2 State Equality Framework"
                            className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold block mb-1">Full Amendment Text *</label>
                          <textarea
                            name="fullText"
                            required
                            rows={3}
                            placeholder="Full ratified text of the amendment..."
                            className="w-full p-2.5 bg-white border rounded-xl text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveAddAmendmentVersionId(null)}
                            className="px-4 py-2 bg-stone-200 text-xs font-bold rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg"
                          >
                            Save Amendment
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Enacted Articles List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enacted Articles ({ver.articles.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ver.articles.map((art) => (
                          <div
                            key={art.id}
                            className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm space-y-1"
                          >
                            <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded">
                              Article {art.articleNumber}
                            </span>
                            <h5 className="font-serif font-bold text-sm text-slate-900 line-clamp-1">{art.title}</h5>
                            <p className="text-xs text-slate-500">{art.sectionsCount} Sections</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ConstitutionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        sessions={sessions}
      />

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
