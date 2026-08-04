'use client';

import React, { useState } from 'react';
import { Newspaper, Plus, Search, Edit3, Trash2, CheckCircle2, FileText } from 'lucide-react';
import { NewsModal } from '@/components/admin/crud-modals/news-modal';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import { deleteNewsArticleAction } from '@/app/admin/actions';

interface NewsArticleItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  status: string;
  isFeatured: boolean;
  publishedAt: Date | null;
  category: { name: string } | null;
  featuredMedia?: { url: string } | null;
}

export function NewsCrudPage({ articles }: { articles: NewsArticleItem[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<NewsArticleItem | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<NewsArticleItem | null>(null);
  const [search, setSearch] = useState('');

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    (a.summary && a.summary.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            NEWSROOM PUBLISHING CMS
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Press Releases & Gazettes ({articles.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage official union press releases, announcements, and constitutional gazette publications.
          </p>
        </div>

        <button
          onClick={() => {
            setArticleToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add News Gazette</span>
        </button>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search gazettes by title or keywords..."
          className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
        />
      </div>

      {/* Data List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-slate-900">No News Articles Found</h3>
            <p className="text-xs text-slate-500">Create your first press gazette by clicking the "Add News Gazette" button above.</p>
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-amber-400/50 transition-all"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                      art.status === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-stone-100 text-slate-700 border border-stone-200'
                    }`}
                  >
                    {art.status}
                  </span>

                  {art.isFeatured && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      HOMEPAGE FEATURED
                    </span>
                  )}

                  <span className="text-[11px] text-slate-500">Category: {art.category?.name || 'General'}</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-slate-900">{art.title}</h3>
                <p className="text-xs text-slate-600 font-light line-clamp-2">{art.summary || art.content}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setArticleToEdit(art)}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-lg transition-colors border border-stone-200 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" /> Edit
                </button>
                <button
                  onClick={() => setArticleToDelete(art)}
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
      <NewsModal
        isOpen={isAddModalOpen || !!articleToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setArticleToEdit(null);
        }}
        articleToEdit={articleToEdit}
      />

      {articleToDelete && (
        <DeleteConfirmModal
          isOpen={!!articleToDelete}
          onClose={() => setArticleToDelete(null)}
          title="Delete News Article"
          itemTitle={articleToDelete.title}
          onConfirm={async () => {
            await deleteNewsArticleAction(articleToDelete.id);
          }}
        />
      )}
    </div>
  );
}
