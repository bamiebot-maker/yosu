'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Image as ImageIcon, X, Check, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  name?: string;
  defaultValue?: string;
  label?: string;
  presets?: { label: string; url: string }[];
}

export function ImageUploader({
  name = 'imageUrl',
  defaultValue = '',
  label = 'Image / Headshot Photo',
  presets = [],
}: ImageUploaderProps) {
  const [url, setUrl] = useState<string>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setUrl(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2 font-sans">
      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
        {label}
      </label>

      {/* Hidden input to pass value in FormData */}
      <input type="hidden" name={name} value={url} />

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/20 rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-center gap-4 relative">
        {/* Preview Thumbnail */}
        {url ? (
          <div className="w-20 h-20 rounded-xl bg-slate-900 border border-amber-400/40 relative overflow-hidden shrink-0 shadow-md">
            <Image src={url} alt="Preview" fill className="object-cover object-top" />
            <button
              type="button"
              onClick={() => setUrl('')}
              className="absolute top-1 right-1 bg-slate-950/80 text-white p-1 rounded-full hover:bg-rose-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl bg-stone-200 border border-stone-300 flex items-center justify-center shrink-0 text-stone-400">
            <ImageIcon className="w-8 h-8" />
          </div>
        )}

        <div className="flex-1 space-y-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <UploadCloud className="w-4 h-4 text-amber-400" />
              )}
              <span>{uploading ? 'Uploading File...' : 'Choose File to Upload'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-light">
            Upload JPG, PNG, WEBP files up to 10MB directly from your device.
          </p>

          {url && (
            <p className="text-[10px] font-mono text-emerald-700 truncate max-w-xs flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
              {url}
            </p>
          )}

          {error && <p className="text-[11px] font-bold text-rose-600">{error}</p>}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Optional Presets */}
      {presets.length > 0 && (
        <div className="space-y-1 pt-1">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
            Or select from official uploaded headshots:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {presets.map((preset) => (
              <button
                key={preset.url}
                type="button"
                onClick={() => setUrl(preset.url)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                  url === preset.url
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-slate-700 border-stone-200'
                }`}
              >
                + {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
