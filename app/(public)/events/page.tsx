import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Calendar, MapPin, Camera, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export default async function EventsPage() {
  const events = await db.event.findMany({
    include: {
      bannerMedia: true,
      albums: {
        where: { isPublic: true },
        include: { mediaItems: true },
      },
    },
    orderBy: { startDate: 'asc' },
  }).catch(() => []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 font-sans">
      {/* Header Banner */}
      <div className="emerald-gradient-bg text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800">
        <div className="max-w-3xl space-y-3">
          <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30 uppercase tracking-wider">
            UNION CALENDAR & HISTORIC PROGRAMS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">YOSU Events & Cultural Ceremonies</h1>
          <p className="text-stone-200 text-sm sm:text-base font-light leading-relaxed">
            Official records of inauguration ceremonies, swearing-in proceedings, Àṣà Day cultural festivals, academic seminars, and union congresses.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map((evt) => {
          const photoCount = evt.albums.reduce((acc, alb) => acc + alb.mediaItems.length, 0);

          return (
            <div key={evt.id} className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-60 sm:h-64 bg-slate-950 border-b border-stone-100 overflow-hidden">
                  <Image
                    src={evt.bannerMedia?.url || '/images/logo.png'}
                    alt={evt.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 right-4 bg-slate-950/90 text-amber-300 font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow border border-amber-400/40 tracking-wider">
                    {evt.organizer}
                  </span>

                  {photoCount > 0 && (
                    <span className="absolute bottom-4 left-4 bg-emerald-950/95 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow border border-emerald-700 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>{photoCount} Event Photos</span>
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="font-serif font-bold text-xl text-slate-900 leading-snug group-hover:text-emerald-900 transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-light">
                    {evt.description}
                  </p>

                  <div className="space-y-2 pt-2 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        {new Date(evt.startDate).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-900 shrink-0" />
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link
                  href={`/events/${evt.slug}`}
                  className="w-full py-3 bg-slate-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-800"
                >
                  <span>Open Event & View Photos</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
