'use client';

import React, { useState } from 'react';
import { Download, FileText, Search, Shield, BookOpen, ExternalLink, HardDrive, Calendar } from 'lucide-react';

export interface MemberDownloadResource {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  fileUrl: string;
  fileSizeFormatted: string;
  mimeType: string;
  createdAt: Date | string;
  downloadsCount: number;
}

interface DownloadCentreProps {
  resources: MemberDownloadResource[];
}

export function DownloadCentre({ resources }: DownloadCentreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'Constitution', 'Gazette', 'Form', 'Report', 'Academic'];

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || res.category.toUpperCase() === selectedCategory.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Download className="w-3.5 h-3.5" />
            <span>YOSU Official Vault</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Document & Download Centre
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            Access official YOSU Constitutions, handbooks, gazettes, event documents, and membership forms.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-900 text-amber-300 shadow-sm'
                    : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
                }`}
              >
                {cat === 'ALL' ? 'All Files' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Downloads Grid */}
      {filteredResources.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-serif text-base font-bold text-slate-800">No Documents Found</h4>
          <p className="text-xs text-slate-500">No official resources matched your search query or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 hover:border-emerald-800/40 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {res.category}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <HardDrive className="w-3 h-3 text-slate-400" />
                    <span>{res.fileSizeFormatted}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-900 group-hover:text-amber-400 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-950 transition-colors line-clamp-2">
                      {res.title}
                    </h4>
                    {res.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {res.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(res.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Download</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
