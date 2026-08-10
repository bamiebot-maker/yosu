'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Globe,
  Share2,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Home,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export interface ContactSettingsMap {
  contact_address?: string;
  contact_email?: string;
  contact_support_email?: string;
  contact_phone?: string;
  contact_phone_alt?: string;
  contact_whatsapp?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
  social_telegram?: string;
  social_linkedin?: string;
  social_youtube?: string;
  social_website?: string;
  contact_map_url?: string;
  office_hours_weekday?: string;
  office_hours_saturday?: string;
  office_hours_sunday?: string;
  office_hours_holidays?: string;
  contact_intro_title?: string;
  contact_intro_subtitle?: string;
}

export interface FaqItemClient {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
}

interface InteractiveContactCentreProps {
  settings: ContactSettingsMap;
  faqs: FaqItemClient[];
}

export function InteractiveContactCentre({ settings, faqs }: InteractiveContactCentreProps) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: 'Federal University Dutse',
    state: 'Oyo State',
    category: 'GENERAL',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    referenceNo: string;
    estimatedResponse: string;
  } | null>(null);

  const [copiedRef, setCopiedRef] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(faqs[0]?.id || null);

  const stateOptions = [
    'Oyo State',
    'Osun State',
    'Ondo State',
    'Ogun State',
    'Lagos State',
    'Ekiti State',
    'Kwara State',
    'Kogi State (Okun)',
    'Other / Diaspora',
  ];

  const categoryOptions = [
    { value: 'GENERAL', label: 'General Enquiry' },
    { value: 'ACADEMIC', label: 'Academic & Educational Support' },
    { value: 'WELFARE', label: 'Student Welfare & Assistance' },
    { value: 'SPONSORSHIP', label: 'Sponsorship & Partnerships' },
    { value: 'CONSTITUTION', label: 'Constitution & CRC Petitions' },
    { value: 'MEDIA', label: 'Media & Press Inquiries' },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setSuccessResult({
        referenceNo: data.referenceNo,
        estimatedResponse: data.estimatedResponse || '24 to 48 business hours',
      });

      // Reset Form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        institution: 'Federal University Dutse',
        state: 'Oyo State',
        category: 'GENERAL',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyRefToClipboard = (refNo: string) => {
    navigator.clipboard.writeText(refNo);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  // Social Links List
  const socialLinks = [
    { name: 'Facebook', url: settings.social_facebook, color: 'bg-blue-600' },
    { name: 'Instagram', url: settings.social_instagram, color: 'bg-pink-600' },
    { name: 'X (Twitter)', url: settings.social_twitter, color: 'bg-slate-900' },
    { name: 'WhatsApp Hotline', url: settings.contact_whatsapp ? `https://wa.me/${settings.contact_whatsapp.replace(/[^0-9]/g, '')}` : null, color: 'bg-emerald-600' },
    { name: 'Telegram', url: settings.social_telegram, color: 'bg-sky-500' },
    { name: 'LinkedIn', url: settings.social_linkedin, color: 'bg-blue-700' },
    { name: 'YouTube', url: settings.social_youtube, color: 'bg-rose-600' },
  ].filter((s) => Boolean(s.url));

  return (
    <div className="space-y-12 font-sans pb-16">
      {/* BREADCRUMBS */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500 px-1 pt-2">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Contact & Communication Centre</span>
      </nav>

      {/* HERO BANNER (TASK 5 - COMPACT MOBILE HEADER CARD) */}
      <header className="bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 shadow-xl relative overflow-hidden border border-slate-800 font-sans">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              OFFICIAL SECRETARIAT CHANNEL
            </span>
            <span className="bg-emerald-950 text-emerald-300 text-[10px] sm:text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" /> 24-48 HR RESPONSE GUARANTEE
            </span>
          </div>

          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-snug">
            {settings.contact_intro_title || 'Official Communication & Enquiry Portal'}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-2 sm:line-clamp-none">
            {settings.contact_intro_subtitle ||
              'Connect directly with the Executive Council, Secretariat, or House of Representatives of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">SECRETARIAT STATUS</span>
              <span className="text-xs font-bold text-emerald-400">OPERATIONAL</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">OFFICIAL EMAIL</span>
              <span className="text-xs font-bold text-amber-300 truncate block">{settings.contact_email || 'info@yosufud.org.ng'}</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">HELPLINE</span>
              <span className="text-xs font-bold text-white truncate block">{settings.contact_phone || '+234 803 123 4567'}</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">LOCATION</span>
              <span className="text-xs font-bold text-white truncate block">FUD Campus, Dutse</span>
            </div>
          </div>
        </div>
      </header>

      {/* OFFICIAL CONTACT CARDS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Address Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center border border-emerald-800 shadow-md">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            SECRETARIAT ADDRESS
          </span>
          <h3 className="font-serif font-bold text-lg text-slate-900">Physical Secretariat Office</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-light">
            {settings.contact_address ||
              'Yoruba Students\' Union (YOSU) Secretariat, Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria.'}
          </p>
        </div>

        {/* Email Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center border border-slate-800 shadow-md">
            <Mail className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            DIGITAL CORRESPONDENCE
          </span>
          <h3 className="font-serif font-bold text-lg text-slate-900">Official Email Inquiries</h3>
          <div className="space-y-1 text-xs">
            <p className="text-slate-600 font-medium">
              General: <a href={`mailto:${settings.contact_email || 'info@yosufud.org.ng'}`} className="text-emerald-800 font-bold hover:underline">{settings.contact_email || 'info@yosufud.org.ng'}</a>
            </p>
            <p className="text-slate-600 font-medium">
              Support: <a href={`mailto:${settings.contact_support_email || 'support@yosufud.org.ng'}`} className="text-emerald-800 font-bold hover:underline">{settings.contact_support_email || 'support@yosufud.org.ng'}</a>
            </p>
          </div>
        </div>

        {/* Phone & WhatsApp Card */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center border border-amber-400 shadow-md">
            <Phone className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            HELPLINE & WHATSAPP
          </span>
          <h3 className="font-serif font-bold text-lg text-slate-900">Direct Telephone Hotlines</h3>
          <div className="space-y-1 text-xs">
            <p className="text-slate-600 font-medium">
              Main Hotline: <a href={`tel:${settings.contact_phone || '+2348031234567'}`} className="text-emerald-800 font-bold hover:underline">{settings.contact_phone || '+234 803 123 4567'}</a>
            </p>
            {settings.contact_whatsapp && (
              <p className="text-slate-600 font-medium">
                WhatsApp: <a href={`https://wa.me/${settings.contact_whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-800 font-bold hover:underline">{settings.contact_whatsapp}</a>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* MAIN FORM & SIDEBAR LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INTERACTIVE CONTACT FORM (lg:col-span-7) */}
        <main className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              OFFICIAL MESSAGE DISPATCH
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Submit an Official Enquiry</h2>
            <p className="text-xs text-slate-500 mt-1">
              Fill out this verified form to lodge complaints, petitions, welfare requests, or partnership proposals.
            </p>
          </div>

          {/* SUCCESS MODAL / EXPERIENCE */}
          {successResult ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-600 text-center space-y-4 shadow-sm animate-fade-in">
              <div className="w-16 h-16 bg-emerald-950 text-amber-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-emerald-800">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-2xl text-emerald-950">Message Successfully Dispatched!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Your enquiry has been logged into the YOSU Secretariat Database.
                </p>
              </div>

              {/* Reference Box */}
              <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-1.5 max-w-sm mx-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">OFFICIAL TRACKING REFERENCE</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-extrabold text-slate-900">{successResult.referenceNo}</span>
                  <button
                    type="button"
                    onClick={() => copyRefToClipboard(successResult.referenceNo)}
                    className="p-1 text-slate-400 hover:text-emerald-700 transition-colors"
                    title="Copy Reference Number"
                  >
                    {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-600 font-light">
                Estimated Secretariat Response Time: <strong className="text-emerald-900">{successResult.estimatedResponse}</strong>
              </div>

              <button
                type="button"
                onClick={() => setSuccessResult(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
              >
                Submit Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Asiwaju Sunday Oluwaseun"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. sunday.asiwaju@student.fud.edu.ng"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Telephone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +234 803 000 1122"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">State of Origin</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  >
                    {stateOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Institution / Department</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science, FUD"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Enquiry concerning membership verification and orientation"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Message Content *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please state your enquiry, complaint, or proposal in detail..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{submitting ? 'Dispatching Message...' : 'Dispatch Official Message'}</span>
                </button>
              </div>
            </form>
          )}
        </main>

        {/* OFFICE HOURS & SOCIAL MEDIA SIDEBAR (lg:col-span-5) */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Office Hours Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">Secretariat Operating Hours</h3>
                <span className="text-[10px] text-slate-500 font-semibold">Standard Working Hours</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Weekdays:</span>
                <span className="font-semibold text-emerald-800">{settings.office_hours_weekday || 'Monday – Friday: 8:00 AM – 5:00 PM'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Saturdays:</span>
                <span className="font-semibold text-slate-800">{settings.office_hours_saturday || 'Saturday: 10:00 AM – 2:00 PM'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Sundays:</span>
                <span className="font-semibold text-slate-500">{settings.office_hours_sunday || 'Closed (Emergency Hotline Active)'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Public Holidays:</span>
                <span className="font-semibold text-slate-500">{settings.office_hours_holidays || 'Public Holidays: Closed'}</span>
              </div>
            </div>
          </div>

          {/* Social Platforms Hub */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <Share2 className="w-5 h-5 text-emerald-700" />
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">Official Social Media Hub</h3>
                <span className="text-[10px] text-slate-500 font-semibold">Verified Digital Channels</span>
              </div>
            </div>

            {socialLinks.length === 0 ? (
              <p className="text-xs text-slate-500">No social media links configured yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {socialLinks.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-bold text-slate-900 flex items-center justify-between transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${soc.color}`} />
                      <span>{soc.name}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* INTERACTIVE GOOGLE MAP EMBED */}
      {settings.contact_map_url && (
        <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-lg text-slate-900">Secretariat Campus Map Location</h3>
          </div>
          <div className="w-full h-96 rounded-2xl overflow-hidden border border-stone-200 shadow-inner">
            <iframe
              src={settings.contact_map_url}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="YOSU Secretariat Map Location"
            />
          </div>
        </section>
      )}

      {/* DYNAMIC FAQ ACCORDION SECTION */}
      {faqs.length > 0 && (
        <section className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">Enquiry Help & FAQ</h2>
            <p className="text-xs text-slate-500 mt-1">
              Find instant answers to common questions regarding YOSU membership, constitution, and support.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-stone-200 overflow-hidden transition-all bg-stone-50/50"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left font-serif font-bold text-sm sm:text-base text-slate-900 flex justify-between items-center gap-4 hover:bg-stone-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 font-light leading-relaxed border-t border-stone-200/60 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
