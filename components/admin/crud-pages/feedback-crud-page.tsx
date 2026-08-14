'use client';

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  Send,
  Loader2,
  X,
  Sparkles,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';
import { updateFeedbackStatusAction } from '@/lib/actions/member.actions';

export interface MemberFeedbackAdminItem {
  id: string;
  studentId: string;
  studentName: string;
  studentRegNumber: string;
  studentMatricNumber: string;
  studentDepartment: string;
  studentEmail: string;
  studentPhone: string;
  subject: string;
  category: string;
  message: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  adminNotes?: string | null;
  createdAt: string;
}

export function FeedbackCrudPage({ feedbacks }: { feedbacks: MemberFeedbackAdminItem[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'REVIEWED' | 'RESOLVED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedFeedback, setSelectedFeedback] = useState<MemberFeedbackAdminItem | null>(null);
  const [adminNotesText, setAdminNotesText] = useState('');
  const [newStatus, setNewStatus] = useState<'PENDING' | 'REVIEWED' | 'RESOLVED'>('REVIEWED');
  const [isUpdating, setIsUpdating] = useState(false);

  const searchLower = search.trim().toLowerCase();

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && f.category !== categoryFilter) return false;
      if (!searchLower) return true;
      const text = `${f.studentName} ${f.studentRegNumber} ${f.studentMatricNumber} ${f.subject} ${f.message} ${f.category}`.toLowerCase();
      return text.includes(searchLower);
    });
  }, [feedbacks, statusFilter, categoryFilter, searchLower]);

  const handleOpenFeedback = (fb: MemberFeedbackAdminItem) => {
    setSelectedFeedback(fb);
    setAdminNotesText(fb.adminNotes || '');
    setNewStatus(fb.status === 'PENDING' ? 'REVIEWED' : fb.status);
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedback) return;
    setIsUpdating(true);
    try {
      const res = await updateFeedbackStatusAction(selectedFeedback.id, newStatus, adminNotesText);
      if (res.success) {
        setSelectedFeedback((prev) =>
          prev ? { ...prev, status: newStatus, adminNotes: adminNotesText } : null
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Student Name', 'Reg No', 'Matric No', 'Category', 'Subject', 'Status', 'Date'];
    const rows = filteredFeedbacks.map((f) => [
      `"${f.studentName}"`,
      `"${f.studentRegNumber}"`,
      `"${f.studentMatricNumber}"`,
      `"${f.category}"`,
      `"${f.subject.replace(/"/g, '""')}"`,
      `"${f.status}"`,
      `"${new Date(f.createdAt).toLocaleDateString()}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YOSU_Member_Feedback_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Executive Governance Desk</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">Member Feedback & Welfare Inbox</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review suggestions, complaints, and recommendations submitted by verified YOSU members.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border border-stone-300 self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-800" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Filters */}
          <div className="flex bg-stone-100 p-1 rounded-xl gap-1">
            {(['ALL', 'PENDING', 'REVIEWED', 'RESOLVED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? 'bg-emerald-900 text-amber-300 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, reg no, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Feedbacks Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Member Student</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No member feedback submissions match the active filters.
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-slate-900">{fb.studentName}</p>
                        <p className="text-[11px] font-mono text-emerald-800">{fb.studentRegNumber} ({fb.studentMatricNumber})</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                        {fb.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-xs truncate">
                      {fb.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          fb.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : fb.status === 'REVIEWED'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-stone-100 text-slate-700 border border-stone-300'
                        }`}
                      >
                        {fb.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(fb.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenFeedback(fb)}
                        className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs rounded-xl transition-all shadow-sm"
                      >
                        Review & Reply
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {selectedFeedback.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-1">
                  {selectedFeedback.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-stone-100 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Member Info Card */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Member Name</span>
                <p className="font-bold text-slate-900">{selectedFeedback.studentName}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Registration Number</span>
                <p className="font-mono font-bold text-emerald-800">{selectedFeedback.studentRegNumber}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Department</span>
                <p className="font-semibold text-slate-800">{selectedFeedback.studentDepartment}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Contact Phone / Email</span>
                <p className="font-semibold text-slate-800">{selectedFeedback.studentPhone} • {selectedFeedback.studentEmail}</p>
              </div>
            </div>

            {/* Submission Message */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Submitted Message Content
              </label>
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                {selectedFeedback.message}
              </div>
            </div>

            {/* Update Status & Reply Form */}
            <form onSubmit={handleSaveStatus} className="space-y-4 pt-2 border-t border-stone-100">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Update Governance Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-900"
                >
                  <option value="PENDING">⏳ PENDING (Awaiting Executive Action)</option>
                  <option value="REVIEWED">👁️ REVIEWED (Under Consideration)</option>
                  <option value="RESOLVED">✅ RESOLVED (Action Taken & Closed)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Executive Response / Notes (Visible to Member)
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter response or resolution notes for the member..."
                  value={adminNotesText}
                  onChange={(e) => setAdminNotesText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFeedback(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 disabled:opacity-70"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Saving Response...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Response & Status</span>
                      <Send className="w-4 h-4 text-amber-400" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
