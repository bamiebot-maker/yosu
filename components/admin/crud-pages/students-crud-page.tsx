'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  FileSpreadsheet,
  Eye,
  Calendar,
  X,
  Loader2,
  Cake,
  Sparkles,
  Gift,
  Download,
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import {
  updateStudentStatusAction,
  deleteStudentRegistrationAction,
} from '@/app/admin/actions';

export interface StudentItem {
  id: string;
  regNumber: string;
  fullName: string;
  gender: string;
  birthMonth: string | null;
  birthDay: string | null;
  passportUrl: string | null;
  matricNumber: string;
  jambRegNumber: string | null;
  faculty: string;
  department: string;
  programme: string;
  level: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  stateOfOrigin: string;
  lga: string;
  homeTown: string;
  residenceType: string;
  hallOfResidence: string | null;
  roomNumber: string | null;
  residentialAddress: string | null;
  areaCouncil: string;
  membershipCategory: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  notes: string | null;
  createdAt: string;
}

export function StudentsCrudPage({
  students,
  stats,
}: {
  students: StudentItem[];
  stats: {
    totalStudents: number;
    maleCount: number;
    femaleCount: number;
    verifiedCount: number;
    pendingCount: number;
    todayCount: number;
  };
}) {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');

  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentItem | null>(null);

  const searchLower = search.trim().toLowerCase();

  const currentCalendarMonth = useMemo(() => {
    return new Date().toLocaleString('en-US', { month: 'long' });
  }, []);

  const statesList = [
    'Ekiti State',
    'Lagos State',
    'Ogun State',
    'Ondo State',
    'Osun State',
    'Oyo State',
    'Kwara State',
    'Kogi State (Okun)',
  ];

  const levelsList = ['100L', '200L', '300L', '400L', '500L', 'Postgraduate', 'Diploma'];

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

  // Birthday Distribution Counts per Month
  const monthlyBirthdayCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    monthsList.forEach((m) => {
      counts[m] = students.filter((s) => s.birthMonth === m).length;
    });
    return counts;
  }, [students]);

  // Multi-Dimensional Filtering Logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (stateFilter !== 'ALL' && s.stateOfOrigin !== stateFilter) return false;
      if (levelFilter !== 'ALL' && s.level !== levelFilter) return false;
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
      if (genderFilter !== 'ALL' && s.gender !== genderFilter) return false;
      if (monthFilter !== 'ALL' && s.birthMonth !== monthFilter) return false;
      if (!searchLower) return true;
      const text =
        `${s.regNumber} ${s.fullName} ${s.matricNumber} ${s.email} ${s.phone} ${s.department} ${s.faculty} ${s.lga} ${s.homeTown} ${s.birthMonth || ''} ${s.birthDay || ''}`.toLowerCase();
      return text.includes(searchLower);
    });
  }, [students, stateFilter, levelFilter, statusFilter, genderFilter, monthFilter, searchLower]);

  const handleOpenStudent = (s: StudentItem) => {
    setSelectedStudent(s);
    setAdminNotes(s.notes || '');
  };

  const handleUpdateStatus = async (status: 'VERIFIED' | 'REJECTED') => {
    if (!selectedStudent) return;
    setUpdatingStatus(true);
    try {
      await updateStudentStatusAction(selectedStudent.id, status, adminNotes);
      setSelectedStudent((prev) => (prev ? { ...prev, status, notes: adminNotes } : null));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const exportFilteredCSV = () => {
    const headers = [
      'Registration No',
      'Full Name',
      'Gender',
      'Birth Month',
      'Birth Day',
      'Matric Number',
      'Faculty',
      'Department',
      'Level',
      'State of Origin',
      'LGA',
      'Home Town',
      'Phone',
      'Email',
      'Status',
      'Date Registered',
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.regNumber}"`,
      `"${s.fullName}"`,
      `"${s.gender}"`,
      `"${s.birthMonth || 'N/A'}"`,
      `"${s.birthDay || 'N/A'}"`,
      `"${s.matricNumber}"`,
      `"${s.faculty}"`,
      `"${s.department}"`,
      `"${s.level}"`,
      `"${s.stateOfOrigin}"`,
      `"${s.lga}"`,
      `"${s.homeTown}"`,
      `"${s.phone}"`,
      `"${s.email}"`,
      `"${s.status}"`,
      `"${new Date(s.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YOSU_Students_${monthFilter === 'ALL' ? 'Database' : monthFilter + '_Birthdays'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            SUPER ADMIN MEMBER DATABASE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Central Student & Member Database ({filteredStudents.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Centralized searchable repository of registered YOSU members, including monthly birthday rosters and state demographics.
          </p>
        </div>

        <button
          type="button"
          onClick={exportFilteredCSV}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export {monthFilter !== 'ALL' ? `${monthFilter} Birthdays` : 'Filtered CSV'} ({filteredStudents.length})</span>
        </button>
      </div>

      {/* STATS ANALYTICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-sm">
          <span className="text-2xl font-extrabold font-serif text-slate-900">{stats.totalStudents}</span>
          <span className="text-xs text-slate-500 block font-medium">Total Registered</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-sm">
          <span className="text-2xl font-extrabold font-serif text-emerald-700">{stats.verifiedCount}</span>
          <span className="text-xs text-slate-500 block font-medium">Verified Members</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-sm">
          <span className="text-2xl font-extrabold font-serif text-amber-600">{stats.pendingCount}</span>
          <span className="text-xs text-slate-500 block font-medium">Pending Review</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-sm">
          <span className="text-2xl font-extrabold font-serif text-blue-700">{stats.maleCount}</span>
          <span className="text-xs text-slate-500 block font-medium">Male Students</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-sm">
          <span className="text-2xl font-extrabold font-serif text-pink-700">{stats.femaleCount}</span>
          <span className="text-xs text-slate-500 block font-medium">Female Students</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
          <span className="text-2xl font-extrabold font-serif text-amber-700">
            {monthlyBirthdayCounts[currentCalendarMonth] || 0}
          </span>
          <span className="text-xs text-amber-900 block font-bold flex items-center gap-1">
            <Cake className="w-3.5 h-3.5 text-amber-600" /> {currentCalendarMonth} Birthdays
          </span>
        </div>
      </div>

      {/* DEDICATED MONTHLY BIRTHDAY ROSTER BOARD */}
      <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block">
                BIRTHDAY ROSTER SYSTEM
              </span>
              <h2 className="font-serif font-bold text-lg text-white">
                Monthly Student Birthday Celebrants
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMonthFilter(currentCalendarMonth)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                monthFilter === currentCalendarMonth
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700'
              }`}
            >
              <Cake className="w-3.5 h-3.5" />
              <span>Current Month ({currentCalendarMonth}: {monthlyBirthdayCounts[currentCalendarMonth] || 0})</span>
            </button>

            {monthFilter !== 'ALL' && (
              <button
                type="button"
                onClick={() => setMonthFilter('ALL')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
              >
                Clear Month Filter
              </button>
            )}
          </div>
        </div>

        {/* 12 Month Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {monthsList.map((m) => {
            const count = monthlyBirthdayCounts[m] || 0;
            const isSelected = monthFilter === m;
            const isCurrentMonth = m === currentCalendarMonth;

            return (
              <button
                key={m}
                type="button"
                onClick={() => setMonthFilter(m)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-900 border-amber-400 text-amber-300 shadow-lg ring-2 ring-amber-400/50'
                    : isCurrentMonth
                    ? 'bg-slate-900 border-amber-400/60 text-white hover:bg-slate-800'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-bold truncate">{m}</span>
                  {isCurrentMonth && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-light">Celebrants</span>
                  <span
                    className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-full ${
                      count > 0 ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MULTI-DIMENSIONAL SEARCH & FILTERING BAR */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Name, Matric, Reg No, Month..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-800 text-slate-900"
            />
          </div>

          {/* Month Filter Dropdown */}
          <div>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
            >
              <option value="ALL">All Birth Months</option>
              {monthsList.map((m) => (
                <option key={m} value={m}>
                  🎂 {m} ({monthlyBirthdayCounts[m] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
            >
              <option value="ALL">All Yoruba States</option>
              {statesList.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
            >
              <option value="ALL">All Academic Levels</option>
              {levelsList.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="PENDING">PENDING</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* STUDENT RECORDS LIST TABLE */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-slate-900">No Student Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No registered students match your active filters or selected birth month ({monthFilter}).
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Reg Number</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">🎂 Birthday</th>
                  <th className="py-3.5 px-4">Matric No</th>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Department & Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{s.regNumber}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        {s.passportUrl ? (
                          <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-stone-300">
                            <Image src={s.passportUrl} alt={s.fullName} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                            {s.fullName.charAt(0)}
                          </div>
                        )}
                        <span>{s.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {s.birthMonth ? (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-[11px] border border-amber-300">
                          <Cake className="w-3 h-3 text-amber-700" />
                          {s.birthMonth} {s.birthDay}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{s.matricNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{s.stateOfOrigin}</td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {s.department} <span className="font-bold text-emerald-800">({s.level})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          s.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : s.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenStudent(s)}
                        className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-slate-900 font-bold rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-800" /> View Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => setStudentToDelete(s)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STUDENT DETAILED PROFILE MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-stone-100 pb-4">
              {selectedStudent.passportUrl ? (
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-800 shadow-md shrink-0">
                  <Image src={selectedStudent.passportUrl} alt={selectedStudent.fullName} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-amber-400 flex items-center justify-center font-bold text-xl shrink-0 border border-emerald-800 shadow-md">
                  {selectedStudent.fullName.charAt(0)}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {selectedStudent.regNumber}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      selectedStudent.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-900'
                        : selectedStudent.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>
                <h2 className="font-serif font-bold text-2xl text-slate-900">{selectedStudent.fullName}</h2>
                <p className="text-xs text-slate-500">
                  Matric: <strong className="text-slate-800 font-mono">{selectedStudent.matricNumber}</strong> • {selectedStudent.department} ({selectedStudent.level})
                </p>
              </div>
            </div>

            {/* Academic & Contact Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              <div className="bg-amber-100/60 p-2.5 rounded-xl border border-amber-300">
                <span className="text-[10px] font-bold text-amber-900 uppercase block">🎂 BIRTHDAY</span>
                <span className="font-bold text-amber-950 text-sm flex items-center gap-1 mt-0.5">
                  {selectedStudent.birthMonth ? `${selectedStudent.birthMonth} ${selectedStudent.birthDay}` : 'Not Specified'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">STATE OF ORIGIN</span>
                <span className="font-bold text-slate-900">{selectedStudent.stateOfOrigin}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">LGA & TOWN</span>
                <span className="font-bold text-slate-900">{selectedStudent.lga} ({selectedStudent.homeTown})</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">FACULTY</span>
                <span className="font-bold text-slate-900">{selectedStudent.faculty}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">PHONE</span>
                <a href={`tel:${selectedStudent.phone}`} className="font-bold text-emerald-800 hover:underline">
                  {selectedStudent.phone}
                </a>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">EMAIL</span>
                <a href={`mailto:${selectedStudent.email}`} className="font-bold text-emerald-800 hover:underline truncate block">
                  {selectedStudent.email}
                </a>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-xs space-y-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">EMERGENCY CONTACT</span>
              <p className="font-bold text-slate-900">
                {selectedStudent.emergencyContactName} ({selectedStudent.emergencyContactRelationship}) —{' '}
                <a href={`tel:${selectedStudent.emergencyContactPhone}`} className="text-emerald-800 hover:underline">
                  {selectedStudent.emergencyContactPhone}
                </a>
              </p>
            </div>

            {/* Admin Verification Controls */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Super Admin Verification & Notes
              </span>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Optional verification notes..."
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleUpdateStatus('REJECTED')}
                    className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject Record
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus('VERIFIED')}
                  className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow cursor-pointer"
                >
                  {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  <span>Verify Student Member</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <DeleteConfirmModal
          isOpen={!!studentToDelete}
          onClose={() => setStudentToDelete(null)}
          title="Delete Student Registration Record"
          itemTitle={`${studentToDelete.fullName} (${studentToDelete.regNumber})`}
          onConfirm={async () => {
            await deleteStudentRegistrationAction(studentToDelete.id);
          }}
        />
      )}
    </div>
  );
}
