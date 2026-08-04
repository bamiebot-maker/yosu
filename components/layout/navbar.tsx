'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  BookOpen,
  ChevronDown,
  Camera,
  Download,
  Sparkles,
  PhoneCall,
  Users,
  Building2,
  ShieldCheck,
  Scale,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [governanceDropdownOpen, setGovernanceDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  const govRef = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setGovernanceDropdownOpen(false);
    setResourcesDropdownOpen(false);
  }, [pathname]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (govRef.current && !govRef.current.contains(event.target as Node)) {
        setGovernanceDropdownOpen(false);
      }
      if (resRef.current && !resRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNav = [
    { name: 'Home', href: '/' },
    { name: 'About YOSU', href: '/about' },
    { name: 'History', href: '/history' },
    { name: 'Constitution', href: '/constitution', highlight: true },
    { name: 'Newsroom', href: '/news' },
    { name: 'Events', href: '/events' },
    { name: 'Projects', href: '/projects' },
  ];

  const secondaryNav = [
    { name: 'Photo Gallery', href: '/gallery', icon: Camera, desc: 'Historical event photographs' },
    { name: 'Downloads & Publications', href: '/downloads', icon: Download, desc: 'Gazettes, forms & archives' },
    { name: 'Culture & Heritage', href: '/culture', icon: Sparkles, desc: 'Traditional Yoruba history' },
    { name: 'Contact Headquarters', href: '/contact', icon: PhoneCall, desc: 'Official Secretariat helpdesk' },
  ];

  const governanceLinks = [
    { name: 'Leadership & Executive Roster', href: '/leadership', icon: Users, desc: 'Comdr Sobur-Led Administration' },
    { name: 'House of Representatives', href: '/leadership#house-of-reps', icon: Scale, desc: 'Legislative Principal Officers' },
    { name: 'The 8 Yoruba Constituent States', href: '/constituent-states', icon: Building2, desc: 'Regional State Representation' },
    { name: 'Independent Bodies (CRC / NSC)', href: '/leadership#independent-bodies', icon: ShieldCheck, desc: 'Constitutional & Advisory Councils' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-[9999] w-full max-w-full overflow-visible shadow-xl font-sans bg-white/95 backdrop-blur-md transition-all duration-300">
      {/* Top Banner - Motto & Institutional Identity */}
      <div className="bg-emerald-950 text-white py-1 px-3 sm:px-6 text-[10px] sm:text-xs font-medium border-b border-emerald-800 w-full">
        <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-2 w-full min-w-0">
          {/* Left: Motto Badge */}
          <div className="flex items-center gap-1.5 min-w-0 shrink">
            <span className="bg-[#E5A91A] text-slate-900 font-bold px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] tracking-wider uppercase shrink-0">
              MOTTO
            </span>
            <span className="italic font-serif tracking-wide text-amber-200 truncate text-[10px] sm:text-xs">
              "Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ"
            </span>
          </div>

          {/* Right: Institutional Designation */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-emerald-200 text-[10px] sm:text-[11px] shrink-0">
            <span className="truncate">FUD Chapter</span>
            <span className="hidden sm:inline text-amber-400">•</span>
            <span className="hidden sm:inline text-slate-300">PMB 7156, Dutse</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-white border-b border-stone-200 w-full relative overflow-visible z-[9999]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16 sm:h-20 w-full gap-2">
            {/* Brand Logo & Title */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 shrink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 rounded-lg py-1 pr-1"
              aria-label="Yoruba Students' Union Homepage"
            >
              <div className="relative w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 transition-transform group-hover:scale-105 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Official YOSU Seal"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-serif text-sm sm:text-lg lg:text-2xl font-bold tracking-tight text-emerald-950 leading-tight truncate">
                  YORUBA STUDENTS' UNION
                </span>
                <span className="text-[9px] sm:text-[11px] font-semibold tracking-wider text-amber-700 uppercase leading-none truncate">
                  (YOSU) — Federal University Dutse
                </span>
              </div>
            </Link>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <Link
                href="/search"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-900 bg-stone-100 hover:bg-amber-50 rounded-xl transition-colors border border-stone-200 focus-visible:ring-2 focus-visible:ring-emerald-900"
              >
                <Search className="w-3.5 h-3.5 text-amber-600" />
                <span>Search Portal</span>
              </Link>
              <Link
                href="/constitution"
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-900 hover:bg-emerald-800 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>2026 Constitution</span>
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-1 shrink-0">
              <Link
                href="/search"
                className="p-2 text-slate-700 hover:text-emerald-900 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Search Portal"
              >
                <Search className="w-5 h-5 text-amber-700" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-emerald-900 rounded-lg focus:outline-none min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-emerald-950" /> : <Menu className="w-6 h-6 text-slate-800" />}
              </button>
            </div>
          </div>
        </div>

        {/* Primary Desktop Navigation Bar */}
        <nav
          className="hidden lg:block bg-stone-50 border-t border-stone-200/80 w-full relative overflow-visible z-[9999]"
          aria-label="Main Navigation"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-1">
                {primaryNav.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : link.highlight
                        ? 'text-emerald-900 hover:bg-amber-100 font-bold'
                        : 'text-slate-700 hover:bg-stone-200/80 hover:text-emerald-950'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Governance Dropdown */}
                <div className="relative" ref={govRef}>
                  <button
                    onClick={() => {
                      setGovernanceDropdownOpen(!governanceDropdownOpen);
                      setResourcesDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      governanceDropdownOpen
                        ? 'bg-emerald-950 text-amber-300'
                        : 'text-slate-700 hover:bg-stone-200/80 hover:text-emerald-950'
                    }`}
                    aria-haspopup="true"
                    aria-expanded={governanceDropdownOpen}
                  >
                    <span>Governance</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${governanceDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
                  </button>

                  {governanceDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-72 bg-slate-950 text-white rounded-2xl shadow-2xl border-2 border-amber-400/60 p-2 z-[99999] space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      {governanceLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setGovernanceDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-900/90 transition-all border border-transparent hover:border-amber-400/30 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-900/80 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-700 group-hover:scale-105 transition-transform">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-light leading-tight">
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Media & Resources Dropdown (Right Aligned) */}
                <div className="relative" ref={resRef}>
                  <button
                    onClick={() => {
                      setResourcesDropdownOpen(!resourcesDropdownOpen);
                      setGovernanceDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      resourcesDropdownOpen
                        ? 'bg-emerald-950 text-amber-300'
                        : 'text-slate-700 hover:bg-stone-200/80 hover:text-emerald-950'
                    }`}
                    aria-haspopup="true"
                    aria-expanded={resourcesDropdownOpen}
                  >
                    <span>More Resources</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${resourcesDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
                  </button>

                  {resourcesDropdownOpen && (
                    <div className="absolute right-0 left-auto top-full mt-1.5 w-72 bg-slate-950 text-white rounded-2xl shadow-2xl border-2 border-amber-400/60 p-2 z-[99999] space-y-1 animate-in fade-in zoom-in-95 duration-150">
                      {secondaryNav.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setResourcesDropdownOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-900/90 transition-all border border-transparent hover:border-amber-400/30 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-900/80 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-700 group-hover:scale-105 transition-transform">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-light leading-tight">
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 text-white border-b border-slate-800 px-4 py-5 space-y-5 shadow-2xl animate-in slide-in-from-top duration-200 max-w-full overflow-hidden">
          <div className="pb-3 border-b border-slate-800">
            <Link
              href="/constitution"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 bg-amber-400 text-slate-950 text-xs font-bold rounded-xl w-full min-h-[44px] shadow-md"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              <span>Ratified 2026 Constitution</span>
            </Link>
          </div>

          {/* Primary Navigation Links */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-amber-400 uppercase px-2 mb-1">
              Primary Navigation
            </p>
            {primaryNav.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                  isActive(link.href) ? 'bg-emerald-900 text-amber-300 font-bold border border-emerald-700' : 'text-slate-200 hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Governance Section */}
          <div className="pt-3 border-t border-slate-800 space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-amber-400 uppercase px-2 mb-1">
              Governance & Structure
            </p>
            {governanceLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-emerald-950 hover:text-amber-300 rounded-xl transition-colors"
                >
                  <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Additional Resources */}
          <div className="pt-3 border-t border-slate-800 space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-amber-400 uppercase px-2 mb-1">
              Media & Resources
            </p>
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-emerald-950 hover:text-amber-300 rounded-xl transition-colors"
                >
                  <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
