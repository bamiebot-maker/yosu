import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Calendar, MapPin, Clock, ArrowLeft, Camera, ShieldCheck } from 'lucide-react';
import { GalleryGrid, GalleryPhotoItem } from '@/components/gallery/gallery-grid';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;

  const event = await db.event.findUnique({
    where: { slug },
    include: {
      bannerMedia: true,
      albums: {
        where: { isPublic: true },
        include: {
          mediaItems: {
            include: { media: true },
            orderBy: { displayOrder: 'asc' },
          },
        },
      },
    },
  });

  if (!event) {
    notFound();
  }

  // Collect event album photos
  const eventPhotos: GalleryPhotoItem[] = [];
  event.albums.forEach((album) => {
    album.mediaItems.forEach((item) => {
      if (item.media) {
        eventPhotos.push({
          id: item.id,
          url: item.media.url,
          altText: item.caption || item.media.altText || event.title,
          caption: item.caption || item.media.altText,
          albumTitle: album.title,
        });
      }
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      {/* Back Link */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#E5A91A] hover:text-amber-400 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white border border-amber-500/30 shadow-2xl min-h-[340px] sm:min-h-[420px] flex items-end">
        {event.bannerMedia?.url && (
          <Image
            src={event.bannerMedia.url}
            alt={event.title}
            fill
            priority
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />

        <div className="relative z-20 p-6 sm:p-10 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-md tracking-wider">
              {event.organizer || 'Executive Council'}
            </span>
            <span className="bg-emerald-950/90 text-amber-300 text-xs font-bold px-3 py-1 rounded-md border border-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Official Program
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300 pt-2 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {new Date(event.startDate).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Event Write-up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold text-emerald-950 border-b border-stone-200 pb-3">
              Event Overview & Proceedings
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-light whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-md">
            <h3 className="font-serif font-bold text-lg text-amber-400 border-b border-slate-800 pb-2">
              Event Information
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Organized By</span>
                <span className="font-semibold text-white">{event.organizer}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Venue / Location</span>
                <span className="font-semibold text-white">{event.location}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block">Gallery Photos</span>
                <span className="font-semibold text-amber-300">{eventPhotos.length} Attached Photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Photo Gallery Slider & Grid */}
      {eventPhotos.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-stone-200">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                EVENT PHOTO GALLERY
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-emerald-950">
                Official Photos from {event.title}
              </h2>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>{eventPhotos.length} Event Photos</span>
            </span>
          </div>

          <GalleryGrid photos={eventPhotos} />
        </div>
      )}
    </div>
  );
}
