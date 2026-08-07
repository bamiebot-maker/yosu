'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  GraduationCap,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Printer,
  Copy,
  Check,
  Upload,
  Home,
  ChevronRight,
  Sparkles,
  Info,
  FileText,
  Camera,
  RefreshCw,
} from 'lucide-react';

export function InteractiveStudentRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: 'MALE',
    birthMonth: 'January',
    birthDay: '1',
    passportUrl: '',
    matricNumber: '',
    jambRegNumber: '',
    faculty: 'Faculty of Computing',
    department: 'Computer Science',
    programme: 'B.Sc. Computer Science',
    level: '100L',
    phone: '',
    whatsapp: '',
    email: '',
    stateOfOrigin: 'Oyo State',
    lga: '',
    homeTown: '',
    residenceType: 'On-Campus',
    hallOfResidence: 'Hall 1 (Dan Fodio)',
    roomNumber: '',
    residentialAddress: 'Federal University Dutse Main Campus',
    areaCouncil: 'Main Campus',
    membershipCategory: 'Undergraduate',
    emergencyContactName: '',
    emergencyContactRelationship: 'Parent / Guardian',
    emergencyContactPhone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadingPassport, setUploadingPassport] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [successResult, setSuccessResult] = useState<{
    regNumber: string;
    fullName: string;
    matricNumber: string;
    department: string;
    level: string;
    stateOfOrigin: string;
    passportUrl: string | null;
    createdAt: string;
  } | null>(null);

  const [copiedRef, setCopiedRef] = useState(false);

  const statesOfOrigin = [
    'Ekiti State',
    'Lagos State',
    'Ogun State',
    'Ondo State',
    'Osun State',
    'Oyo State',
    'Kwara State',
    'Kogi State (Okun)',
  ];

  const faculties = [
    'Faculty of Computing',
    'Faculty of Science',
    'Faculty of Management Sciences',
    'Faculty of Agriculture',
    'Faculty of Arts & Humanities',
    'Faculty of Social Sciences',
    'Faculty of Allied Health Sciences',
    'School of Postgraduate Studies',
  ];

  const levels = ['100L', '200L', '300L', '400L', '500L', 'Postgraduate', 'Diploma'];

  const monthsList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysList = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePassportFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPassport(true);
    setErrorMsg(null);

    try {
      const bodyData = new FormData();
      bodyData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: bodyData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to upload passport photograph.');
      }

      setFormData((prev) => ({ ...prev, passportUrl: data.url }));
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading passport file. Please try again.');
    } finally {
      setUploadingPassport(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to complete registration.');
      }

      setSuccessResult(data.data);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please verify your entries.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyRefToClipboard = (regNo: string) => {
    navigator.clipboard.writeText(regNo);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="space-y-10 font-sans pb-16">
      {/* BREADCRUMBS */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500 px-1 pt-2">
        <Link href="/" className="hover:text-emerald-700 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900">Student & Membership Registration</span>
      </nav>

      {/* HERO BANNER */}
      <header className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              CENTRAL MEMBER DATABASE
            </span>
            <span className="bg-emerald-950 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> OFFICIAL REGISTRATION PORTAL
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            YOSU Student & Membership Registration
          </h1>

          <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
            Register your information into the central digital repository of the Yoruba Students&apos; Union (YOSU), Federal University Dutse Chapter.
          </p>

          {/* Benefits Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">1. Official Union Record</span>
              <p className="text-slate-400 text-[11px] font-light">
                Ensures recognition under the Constitution across all 8 constituent states.
              </p>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">2. Welfare & Bursary Priority</span>
              <p className="text-slate-400 text-[11px] font-light">
                Qualifies members for academic support, emergency relief, and state bursaries.
              </p>
            </div>
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">3. Digital Registration Slip</span>
              <p className="text-slate-400 text-[11px] font-light">
                Generates a printable registration slip and unique membership ID number.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* REGISTRATION FORM OR SUCCESS SLIP */}
      {successResult ? (
        /* SUCCESS REGISTRATION SLIP EXPERIENCE */
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-xl space-y-8 max-w-3xl mx-auto font-sans print:p-0 print:border-none print:shadow-none">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-950 text-amber-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-emerald-800">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-serif font-bold text-3xl text-slate-900">Student Registration Successful!</h2>
            <p className="text-xs text-slate-500">
              Your information has been officially recorded in the YOSU Central Member Database.
            </p>
          </div>

          {/* PRINTABLE SLIP CONTAINER WITH PASSPORT PHOTOGRAPH & BRANDING */}
          <div id="printable-slip" className="p-6 sm:p-8 bg-white rounded-3xl border-2 border-emerald-800 space-y-6 shadow-md">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-emerald-950 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-white p-1 shadow border border-stone-200 shrink-0">
                  <Image src="/images/logo.png" alt="YOSU Logo" fill className="object-contain p-0.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block">
                    YORUBA STUDENTS&apos; UNION (YOSU) — FUD CHAPTER
                  </span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">Official Membership Identification Slip</h3>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">REGISTRATION NO.</span>
                <span className="font-mono text-lg font-extrabold text-emerald-950">{successResult.regNumber}</span>
              </div>
            </div>

            {/* Card Body: Passport Image + Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Passport Photograph */}
              <div className="shrink-0">
                {successResult.passportUrl ? (
                  <div className="relative w-28 h-32 rounded-2xl overflow-hidden border-2 border-emerald-900 shadow-md bg-stone-100">
                    <Image src={successResult.passportUrl} alt={successResult.fullName} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-28 h-32 rounded-2xl bg-emerald-950 text-amber-400 flex flex-col items-center justify-center font-bold text-2xl border-2 border-emerald-900 shadow-md">
                    <span>{successResult.fullName.charAt(0)}</span>
                    <span className="text-[9px] text-emerald-300 font-normal uppercase tracking-wider mt-1">YOSU MEMBER</span>
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs flex-1 w-full">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">FULL NAME</span>
                  <span className="font-bold text-slate-900 text-sm">{successResult.fullName}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">MATRICULATION NUMBER</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{successResult.matricNumber}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">DEPARTMENT & LEVEL</span>
                  <span className="font-semibold text-slate-800">{successResult.department} ({successResult.level})</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">STATE OF ORIGIN</span>
                  <span className="font-semibold text-slate-800">{successResult.stateOfOrigin}</span>
                </div>
              </div>
            </div>

            {/* Footer Status */}
            <div className="pt-3 border-t border-stone-200 text-[11px] text-slate-500 font-light flex justify-between items-center">
              <span>Date Registered: {new Date(successResult.createdAt).toLocaleDateString()}</span>
              <span className="font-bold text-emerald-950 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                STATUS: VERIFIED MEMBER
              </span>
            </div>
          </div>

          {/* PRINT-ONLY CSS TARGETING ONLY #printable-slip */}
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #printable-slip,
              #printable-slip * {
                visibility: visible !important;
              }
              #printable-slip {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 24px !important;
                border: 3px solid #064e3b !important;
                border-radius: 16px !important;
                background-color: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page {
                margin: 1cm;
                size: auto;
              }
            }
          `}</style>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
              type="button"
              onClick={() => copyRefToClipboard(successResult.regNumber)}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center gap-2 border border-stone-300 cursor-pointer"
            >
              {copiedRef ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
              <span>{copiedRef ? 'Copied to Clipboard!' : 'Copy Reg Number'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Official Slip</span>
            </button>

            <button
              type="button"
              onClick={() => setSuccessResult(null)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Register Another Student
            </button>
          </div>
        </div>
      ) : (
        /* REGISTRATION FORM */
        <main className="bg-white p-6 sm:p-12 rounded-3xl border border-stone-200 shadow-sm space-y-8 max-w-4xl mx-auto">
          <div className="border-b border-stone-100 pb-4">
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
              PUBLIC STUDENT REGISTRATION FORM
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">Member Data Capture</h2>
            <p className="text-xs text-slate-500 mt-1">
              Please complete all mandatory sections accurately. Upload your passport photograph directly from your phone or device.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* SECTION 1: PERSONAL INFORMATION & PASSPORT UPLOAD */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <User className="w-4 h-4 text-amber-500" />
                <h3 className="font-serif font-bold text-base text-slate-900">1. Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name (Surname First) *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Asiwaju Sunday Oluwaseun"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Birth Month</label>
                    <select
                      name="birthMonth"
                      value={formData.birthMonth}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                    >
                      {monthsList.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Birth Day</label>
                    <select
                      name="birthDay"
                      value={formData.birthDay}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                    >
                      {daysList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PASSPORT PHOTOGRAPH DIRECT FILE UPLOAD ZONE */}
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Passport Photograph *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-[11px] font-bold text-emerald-800 hover:underline"
                    >
                      {showUrlInput ? 'Switch to File Upload' : 'Or enter Image URL manually'}
                    </button>
                  </div>

                  {!showUrlInput ? (
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        id="passport-file-input"
                        onChange={handlePassportFileUpload}
                        className="hidden"
                      />

                      {formData.passportUrl ? (
                        /* PREVIEW CARD IF UPLOADED */
                        <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-600 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-emerald-800 shadow shrink-0">
                              <Image src={formData.passportUrl} alt="Passport Preview" fill className="object-cover" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-emerald-950 block flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Passport Photograph Uploaded
                              </span>
                              <span className="text-[10px] text-slate-500 block truncate max-w-xs">{formData.passportUrl}</span>
                            </div>
                          </div>

                          <label
                            htmlFor="passport-file-input"
                            className="px-3.5 py-2 bg-white hover:bg-stone-100 text-slate-900 text-xs font-bold rounded-xl border border-stone-300 shadow-sm cursor-pointer inline-flex items-center gap-1.5 shrink-0"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-emerald-800" />
                            <span>Change Photo</span>
                          </label>
                        </div>
                      ) : (
                        /* DROPZONE BUTTON */
                        <label
                          htmlFor="passport-file-input"
                          className="w-full p-6 border-2 border-dashed border-stone-300 hover:border-emerald-800 rounded-2xl bg-stone-50 hover:bg-emerald-50/50 flex flex-col sm:flex-row items-center justify-center gap-4 cursor-pointer transition-all text-center sm:text-left select-none"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center shrink-0 border border-emerald-800 shadow-md">
                            {uploadingPassport ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
                          </div>

                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {uploadingPassport ? 'Uploading Passport to Cloudinary...' : 'Click here to Upload Passport Photograph'}
                            </span>
                            <span className="text-[11px] text-slate-500 font-light block mt-0.5">
                              Supports JPG, PNG, or WEBP images (Maximum file size: 10MB)
                            </span>
                          </div>
                        </label>
                      )}
                    </div>
                  ) : (
                    /* MANUAL URL INPUT FALLBACK */
                    <input
                      type="url"
                      name="passportUrl"
                      value={formData.passportUrl}
                      onChange={handleChange}
                      placeholder="e.g. https://res.cloudinary.com/yosu/image/upload/v12345/passport.jpg"
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: ACADEMIC INFORMATION */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <h3 className="font-serif font-bold text-base text-slate-900">2. Academic Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Matriculation Number *</label>
                  <input
                    type="text"
                    name="matricNumber"
                    required
                    value={formData.matricNumber}
                    onChange={handleChange}
                    placeholder="e.g. FUD/2023/CS/1042"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">JAMB Reg Number (Optional)</label>
                  <input
                    type="text"
                    name="jambRegNumber"
                    value={formData.jambRegNumber}
                    onChange={handleChange}
                    placeholder="e.g. 202390123456AB"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Faculty *</label>
                  <select
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  >
                    {faculties.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Department *</label>
                  <input
                    type="text"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Programme</label>
                  <input
                    type="text"
                    name="programme"
                    value={formData.programme}
                    onChange={handleChange}
                    placeholder="e.g. B.Sc. Computer Science"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: CONTACT & ORIGIN INFORMATION */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif font-bold text-base text-slate-900">3. Contact & Origin Information</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">WhatsApp Number</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
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
                    placeholder="e.g. student@fud.edu.ng"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Yoruba State of Origin *</label>
                  <select
                    name="stateOfOrigin"
                    value={formData.stateOfOrigin}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  >
                    {statesOfOrigin.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Local Govt Area (LGA) *</label>
                  <input
                    type="text"
                    name="lga"
                    required
                    value={formData.lga}
                    onChange={handleChange}
                    placeholder="e.g. Ibadan North / Ado-Ekiti"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Home Town *</label>
                  <input
                    type="text"
                    name="homeTown"
                    required
                    value={formData.homeTown}
                    onChange={handleChange}
                    placeholder="e.g. Ado-Ekiti / Oyo"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: EMERGENCY CONTACT */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                <Phone className="w-4 h-4 text-emerald-800" />
                <h3 className="font-serif font-bold text-base text-slate-900">4. Emergency Contact</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Contact Name *</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    required
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="e.g. Mr. Emmanuel Oluwaseun"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Relationship *</label>
                  <input
                    type="text"
                    name="emergencyContactRelationship"
                    required
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    placeholder="e.g. Father / Guardian"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Emergency Phone *</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    required
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    placeholder="e.g. +234 802 000 1122"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end border-t border-stone-100">
              <button
                type="submit"
                disabled={submitting || uploadingPassport}
                className="px-8 py-3.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                )}
                <span>{submitting ? 'Registering...' : 'Complete Membership Registration'}</span>
              </button>
            </div>
          </form>
        </main>
      )}
    </div>
  );
}
