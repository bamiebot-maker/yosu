import React from 'react';
import { db } from '@/lib/db';
import { Camera } from 'lucide-react';
import { GalleryGrid, GalleryPhotoItem } from '@/components/gallery/gallery-grid';

export const dynamic = 'force-dynamic';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 font-sans">
      {/* Minimalist Header */}
      <div className="space-y-1.5 border-b border-stone-200/80 pb-4 font-sans">
        <span className="text-[10px] sm:text-xs font-bold text-amber-700 uppercase tracking-widest block">
          HISTORICAL PHOTO ARCHIVE
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900">
          YOSU Photo Gallery
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed max-w-2xl">
          Official photographic archive of executive inaugurations, swearing-in ceremonies, traditional royal court sittings, and cultural week festivities.
        </p>
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
