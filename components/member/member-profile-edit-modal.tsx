'use client';

import React, { useState, useActionState } from 'react';
import { UserCheck, X, Loader2, Save, CheckCircle2, AlertCircle, Phone, Building2, MapPin } from 'lucide-react';
import { updateMemberProfileSelfAction } from '@/lib/actions/member.actions';
import { ImageUploader } from '@/components/ui/image-uploader';

const YORUBA_STATES = [
  'Ekiti',
  'Kwara',
  'Oyo',
  'Osun',
  'Ondo',
  'Ogun',
  'Lagos',
  'Kogi',
];

const FACULTIES_AND_DEPARTMENTS: Record<string, string[]> = {
  'Faculty of Computing': [
    'Computer Science',
    'Cybersecurity',
    'Software Engineering',
    'Information Technology',
  ],
  'Faculty of Science': [
    'Biochemistry',
    'Microbiology',
    'Biotechnology',
    'Physics',
    'Chemistry',
    'Mathematics',
  ],
  'Faculty of Management Sciences': [
    'Accounting',
    'Business Administration',
    'Banking and Finance',
    'Public Administration',
  ],
  'Faculty of Agriculture': [
    'Agronomy',
    'Animal Science',
    'Agricultural Economics & Extension',
    'Fisheries and Aquaculture',
  ],
  'Faculty of Arts & Humanities': [
    'English Language',
    'History and International Studies',
    'Linguistics',
    'Islamic Studies',
  ],
  'Faculty of Social Sciences': [
    'Economics',
    'Political Science',
    'Sociology',
    'Criminology & Security Studies',
  ],
  'Faculty of Allied Health Sciences': [
    'Nursing Science',
    'Medical Laboratory Science',
    'Public Health',
  ],
};

interface StudentData {
  id: string;
  fullName: string;
  phone: string;
  whatsapp?: string | null;
  email: string;
  matricNumber: string;
  regNumber: string;
  faculty: string;
  department: string;
  level: string;
  stateOfOrigin: string;
  lga: string;
  homeTown: string;
  passportUrl?: string | null;
}

interface MemberProfileEditModalProps {
  student: StudentData;
  isOpen: boolean;
  onClose: () => void;
}

export function MemberProfileEditModal({ student, isOpen, onClose }: MemberProfileEditModalProps) {
  const [state, formAction, isPending] = useActionState(updateMemberProfileSelfAction, null);

  const [selectedFaculty, setSelectedFaculty] = useState(student.faculty || 'Faculty of Computing');
  const [selectedDepartment, setSelectedDepartment] = useState(student.department || 'Computer Science');

  if (!isOpen) return null;

  const departmentOptions = FACULTIES_AND_DEPARTMENTS[selectedFaculty] || [
    'Computer Science',
    'Cybersecurity',
    'Software Engineering',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-emerald-950 text-white p-6 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-300">Edit Member Profile Details</h3>
              <p className="text-xs text-slate-300">Update your student information on the official YOSU register</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900 hover:bg-emerald-800 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form action={formAction} className="p-6 space-y-6">
          {state?.error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {state?.success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name *</label>
              <input
                type="text"
                name="fullName"
                defaultValue={student.fullName}
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                defaultValue={student.phone}
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">WhatsApp Number</label>
              <input
                type="tel"
                name="whatsapp"
                defaultValue={student.whatsapp || ''}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
              />
            </div>

            {/* Faculty Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Faculty *</label>
              <select
                name="faculty"
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value);
                  const depts = FACULTIES_AND_DEPARTMENTS[e.target.value] || [];
                  if (depts.length > 0) setSelectedDepartment(depts[0]);
                }}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
              >
                {Object.keys(FACULTIES_AND_DEPARTMENTS).map((fac) => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            </div>

            {/* Department Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Department *</label>
              <select
                name="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
              >
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Academic Level */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Academic Level *</label>
              <select
                name="level"
                defaultValue={student.level || '100L'}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
              >
                <option value="100L">100 Level</option>
                <option value="200L">200 Level</option>
                <option value="300L">300 Level</option>
                <option value="400L">400 Level</option>
                <option value="500L">500 Level</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            {/* State of Origin */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">State of Origin *</label>
              <select
                name="stateOfOrigin"
                defaultValue={student.stateOfOrigin}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
              >
                {YORUBA_STATES.map((st) => (
                  <option key={st} value={st}>{st} State</option>
                ))}
              </select>
            </div>

            {/* LGA */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Local Government Area (LGA) *</label>
              <input
                type="text"
                name="lga"
                defaultValue={student.lga}
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
              />
            </div>

            {/* Home Town */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Home Town *</label>
              <input
                type="text"
                name="homeTown"
                defaultValue={student.homeTown}
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-950"
              />
            </div>

            {/* Passport Photo Upload Space */}
            <div className="space-y-1 sm:col-span-2">
              <ImageUploader
                name="passportUrl"
                defaultValue={student.passportUrl || ''}
                label="Passport / Profile Photograph Upload *"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-400" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
