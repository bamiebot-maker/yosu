'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  UserCheck,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [governanceDropdownOpen, setGovernanceDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const govRef = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);

  // Fetch registration window status
  useEffect(() => {
    fetch('/api/students/register-status')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.isOpen === 'boolean') {
          setIsRegistrationOpen(data.isOpen);
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Track window scroll position for sticky header animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
    ...(isRegistrationOpen ? [{ name: 'Student Registration', href: '/register', badge: 'NEW' }] : []),
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
    <header
      className={`sticky top-0 z-[9999] w-full max-w-full font-sans transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-2xl border-b border-stone-300'
          : 'bg-white shadow-lg border-b border-stone-200'
      }`}
    >


      {/* Main Header Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 w-full relative z-[9999]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          <div className={`flex justify-between items-center transition-all duration-300 w-full gap-2 ${isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'}`}>
            {/* Brand Logo & Title */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 shrink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 rounded-lg py-1 pr-1"
              aria-label="Yoruba Students' Union Homepage"
            >
              <div className={`relative transition-all duration-300 shrink-0 ${isScrolled ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14'}`}>
                <Image
                  src="/images/logo.png"
                  alt="Official YOSU Seal"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className={`font-serif font-bold tracking-tight text-emerald-950 leading-tight truncate transition-all duration-300 ${isScrolled ? 'text-xs sm:text-base lg:text-xl' : 'text-sm sm:text-lg lg:text-2xl'}`}>
                  YORUBA STUDENTS&apos; UNION
                </span>
                <span className="text-[9px] sm:text-[11px] font-semibold tracking-wider text-amber-700 uppercase leading-none truncate">
                  (YOSU) — Federal University Dutse
                </span>
              </div>
            </Link>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {isRegistrationOpen && (
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-900"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-950" />
                  <span>Student Registration</span>
                </Link>
              )}
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
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-slate-700 hover:text-emerald-900 rounded-lg focus:outline-none min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
                aria-label="Open Mobile Navigation Sidebar"
              >
                <Menu className="w-6 h-6 text-emerald-950" />
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
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      isActive(link.href)
                        ? 'bg-emerald-900 text-white shadow-sm'
                        : link.highlight
                        ? 'text-emerald-900 hover:bg-amber-100 font-bold'
                        : 'text-slate-700 hover:bg-stone-200/80 hover:text-emerald-950'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}

                {/* Governance Dropdown */}
                <div className="relative" ref={govRef}>
                  <button
                    onClick={() => {
                      setGovernanceDropdownOpen(!governanceDropdownOpen);
                      setResourcesDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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

                {/* Media & Resources Dropdown */}
                <div className="relative" ref={resRef}>
                  <button
                    onClick={() => {
                      setResourcesDropdownOpen(!resourcesDropdownOpen);
                      setGovernanceDropdownOpen(false);
                    }}
                    className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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

      {/* MOBILE LEFT SIDEBAR DRAWER (PORTALED TO DOCUMENT.BODY) */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100000] font-sans">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Left Slide-In Drawer Sidebar Panel (ATTACHMENT 3 - THIN, SPACE-SAVING MOBILE SIDEBAR) */}
          <aside className="fixed top-0 left-0 bottom-0 h-full w-[72vw] max-w-[260px] bg-slate-950 text-white border-r border-slate-800/80 shadow-2xl z-[100001] flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-300 font-sans">
            {/* Top Drawer Header - Pinned */}
            <div className="shrink-0 p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900 shadow-sm">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="relative w-7 h-7 shrink-0 bg-white p-0.5 rounded-lg shadow">
                  <Image
                    src="/images/logo.png"
                    alt="YOSU Seal"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-serif text-xs font-bold text-white leading-tight truncate">
                    YOSU FUD
                  </span>
                  <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider truncate">
                    Official Secretariat
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close Mobile Sidebar"
              >
                <X className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {/* Callout Actions */}
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 space-y-1.5">
                {isRegistrationOpen && (
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-extrabold rounded-lg w-full shadow-sm transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-950" />
                    <span>Member Registration</span>
                  </Link>
                )}
                <Link
                  href="/constitution"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-slate-200 text-[10px] font-bold rounded-lg w-full border border-slate-700/80 transition-colors"
                >
                  <BookOpen className="w-3 h-3 text-amber-400" />
                  <span>2026 Constitution</span>
                </Link>
              </div>

              {/* Primary Navigation Links */}
              <div className="p-3 space-y-0.5 border-b border-slate-800">
                <p className="text-[9px] font-extrabold tracking-wider text-amber-400/90 uppercase px-2 mb-1">
                  PRIMARY NAVIGATION
                </p>
                {primaryNav.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-emerald-950 text-amber-300 border border-emerald-800/90'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="bg-amber-400 text-slate-950 text-[8px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Governance Section */}
              <div className="p-3 space-y-0.5 border-b border-slate-800">
                <p className="text-[9px] font-extrabold tracking-wider text-amber-400/90 uppercase px-2 mb-1">
                  GOVERNANCE & ROSTER
                </p>
                {governanceLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-900 hover:text-amber-300 rounded-lg transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Additional Resources */}
              <div className="p-3 space-y-0.5">
                <p className="text-[9px] font-extrabold tracking-wider text-amber-400/90 uppercase px-2 mb-1">
                  MEDIA & RESOURCES
                </p>
                {secondaryNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-slate-900 hover:text-amber-300 rounded-lg transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Details - PINNED AT BOTTOM */}
            <div className="shrink-0 p-4 border-t border-slate-800 bg-slate-900 text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-serif block">
                Yoruba Students&apos; Union (YOSU) FUD Chapter
              </span>
              <span className="text-[9px] text-amber-400 font-mono font-bold block">
                Federal University Dutse • Jigawa State
              </span>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </header>
  );
}
