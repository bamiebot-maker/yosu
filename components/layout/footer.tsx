import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t-4 border-[#E5A91A] mt-auto">
      {/* Upper Footer - Main Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo.png"
                  alt="YOSU Seal"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">YOSU FUD</h3>
                <p className="text-xs text-amber-400 font-medium">Federal University Dutse</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The official digital headquarters of the Yoruba Students' Union, Federal University Dutse Chapter. Empowering student leaders, preserving Yoruba heritage, and promoting unity.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-emerald-950 border border-emerald-700 text-amber-300 text-[11px] font-serif italic px-3 py-1 rounded">
                "Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ"
              </span>
            </div>
          </div>

          {/* Col 2: Institutional Governance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Institutional Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About YOSU & Objectives
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-amber-400 transition-colors">
                  History (NAKOLES to YOSU)
                </Link>
              </li>
              <li>
                <Link href="/leadership" className="hover:text-amber-400 transition-colors">
                  Executive Council (17 Offices)
                </Link>
              </li>
              <li>
                <Link href="/leadership#house-of-reps" className="hover:text-amber-400 transition-colors">
                  House of Representatives
                </Link>
              </li>
              <li>
                <Link href="/constituent-states" className="hover:text-amber-400 transition-colors">
                  The 8 Constituent States
                </Link>
              </li>
              <li>
                <Link href="/constitution" className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>2026 Unification Constitution</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Media & Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Media & Downloads
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/news" className="hover:text-amber-400 transition-colors">
                  Press Releases & Newsroom
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-amber-400 transition-colors">
                  Upcoming Events & Programs
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-amber-400 transition-colors">
                  Development Projects Tracker
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors">
                  Official Photo Gallery & Albums
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-amber-400 transition-colors">
                  Gazettes & Downloadable Forms
                </Link>
              </li>
              <li>
                <Link href="/culture" className="hover:text-amber-400 transition-colors">
                  Traditional Titles & Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact & Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Official Headquarters
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:info@yosu.fud.edu.ng" className="hover:text-amber-400">
                  info@yosu.fud.edu.ng
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+234 801 234 5678</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright */}
      <div className="bg-slate-900 border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {currentYear} Yoruba Students' Union (YOSU), Federal University Dutse Chapter. All Rights Reserved.</p>
          <p className="text-[11px] text-slate-400">
            Official 2026 Unification Constitution Ratified & Assented.
          </p>
        </div>
      </div>
    </footer>
  );
}
