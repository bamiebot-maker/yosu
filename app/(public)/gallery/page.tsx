import React from 'react';
import { db } from '@/lib/db';
import { Camera } from 'lucide-react';
import { GalleryGrid, GalleryPhotoItem } from '@/components/gallery/gallery-grid';

export const revalidate = 60;

export default async function GalleryPage() {
  const albums = await db.album.findMany({
    where: { isPublic: true },
    include: {
      coverMedia: true,
      mediaItems: {
        include: { media: true },
        orderBy: { displayOrder: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const allPhotos: GalleryPhotoItem[] = [];
  albums.forEach((album) => {
    album.mediaItems.forEach((item) => {
      if (item.media) {
        allPhotos.push({
          id: item.id,
          url: item.media.url,
          altText: item.media.altText || item.caption || album.title,
          caption: item.caption || item.media.altText,
          albumTitle: album.title,
        });
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans">
      {/* Header Banner */}
      <div className="emerald-gradient-bg text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-400/30 uppercase tracking-wider inline-flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            HISTORICAL PHOTO ARCHIVE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">YOSU Photo Gallery</h1>
          <p className="text-stone-200 text-sm sm:text-base font-light leading-relaxed">
            Official photographic archive of executive inaugurations, swearing-in ceremonies, traditional royal court sittings, and cultural week festivities.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-stone-200 pb-3">
          <h2 className="font-serif font-bold text-2xl text-emerald-950">
            All Ingested Photos ({allPhotos.length})
          </h2>
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Click any photo to expand
          </span>
        </div>

        <GalleryGrid photos={allPhotos} />
      </div>
    </div>
  );
}
