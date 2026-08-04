'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Plus, Search, Copy, Check, Trash2, FileText, ExternalLink } from 'lucide-react';
import { ImageUploader } from '@/components/ui/image-uploader';
import { deleteMediaAction } from '@/app/admin/actions';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
}

export function MediaCrudPage({ mediaItems }: { mediaItems: MediaItem[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredMedia = mediaItems.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase()) ||
    m.url.toLowerCase().includes(search.toLowerCase())
  );

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            CENTRAL ASSET MANAGEMENT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Media Library & Assets ({mediaItems.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Upload, inspect, copy public URLs, and manage all images and document media.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen((prev) => !prev)}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Upload Asset</span>
        </button>
      </div>

      {/* Upload Drawer */}
      {isAddOpen && (
        <div className="bg-white p-6 rounded-2xl border border-amber-300 shadow-lg space-y-4 animate-fade-in">
          <h3 className="font-serif font-bold text-base text-slate-900">Upload New Media Asset</h3>
          <ImageUploader label="Choose File to Upload to Central Media Library" />
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media files by filename or URL..."
          className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div className="h-32 bg-slate-900 relative overflow-hidden flex items-center justify-center">
              {m.mimeType.startsWith('image/') || m.url.endsWith('.jpg') || m.url.endsWith('.png') ? (
                <Image src={m.url} alt={m.filename} fill className="object-cover" />
              ) : (
                <FileText className="w-10 h-10 text-stone-400" />
              )}
            </div>

            <div className="p-3 space-y-1 bg-white">
              <p className="text-[11px] font-bold text-slate-900 truncate">{m.filename}</p>
              <p className="text-[9px] text-slate-400 font-mono">
                {(m.sizeBytes / 1024).toFixed(1)} KB
              </p>

              <div className="pt-2 flex items-center justify-between gap-1 border-t border-stone-100">
                <button
                  onClick={() => copyUrl(m.id, m.url)}
                  className="px-2 py-1 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-[9px] font-bold rounded flex items-center gap-1 border border-stone-200 transition-colors"
                >
                  {copiedId === m.id ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-500" />
                  )}
                  <span>{copiedId === m.id ? 'Copied' : 'Copy URL'}</span>
                </button>

                <button
                  onClick={async () => {
                    await deleteMediaAction(m.id);
                  }}
                  className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
