'use client';

import React, { useState, useMemo } from 'react';
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Reply,
  Download,
  Eye,
  Archive,
  Clock,
  User,
  Phone,
  Building,
  MapPin,
  MessageSquare,
  FileSpreadsheet,
  X,
  Send,
  Loader2,
  Tag,
} from 'lucide-react';
import { DeleteConfirmModal } from '@/components/admin/crud-modals/delete-confirm-modal';
import {
  updateContactMessageStatusAction,
  replyContactMessageAction,
  deleteContactMessageAction,
} from '@/app/admin/actions';

export interface ContactMessageItem {
  id: string;
  referenceNo: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  state: string;
  subject: string;
  category: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  replyMessage: string | null;
  ipAddress: string | null;
  createdAt: string;
  readAt: string | null;
  repliedAt: string | null;
}

export function ContactMessagesCrudPage({ messages }: { messages: ContactMessageItem[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED'>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessageItem | null>(null);

  const searchLower = search.trim().toLowerCase();

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
      if (!searchLower) return true;
      const text = `${m.referenceNo} ${m.fullName} ${m.email} ${m.phone} ${m.subject} ${m.message} ${m.state} ${m.category}`.toLowerCase();
      return text.includes(searchLower);
    });
  }, [messages, statusFilter, searchLower]);

  const handleOpenMessage = async (msg: ContactMessageItem) => {
    setSelectedMessage(msg);
    setReplyText(msg.replyMessage || '');
    if (msg.status === 'UNREAD') {
      await updateContactMessageStatusAction(msg.id, 'READ');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;
    setSendingReply(true);
    try {
      await replyContactMessageAction(selectedMessage.id, replyText.trim());
      setSelectedMessage((prev) => (prev ? { ...prev, status: 'REPLIED', replyMessage: replyText.trim() } : null));
    } finally {
      setSendingReply(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Reference No', 'Full Name', 'Email', 'Phone', 'State', 'Category', 'Subject', 'Status', 'Date'];
    const rows = filteredMessages.map((m) => [
      `"${m.referenceNo}"`,
      `"${m.fullName}"`,
      `"${m.email}"`,
      `"${m.phone}"`,
      `"${m.state}"`,
      `"${m.category}"`,
      `"${m.subject.replace(/"/g, '""')}"`,
      `"${m.status}"`,
      `"${new Date(m.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YOSU_Contact_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
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
            SUPER ADMIN SECRETARIAT INBOX
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Contact Messages & Enquiries ({messages.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Review, reply to, and manage official enquiries submitted by students, alumni, and stakeholders.
          </p>
        </div>

        <button
          type="button"
          onClick={exportToCSV}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl shadow flex items-center gap-2 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* SEARCH & FILTERS TOOLBAR */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ref No, Name, Email, Subject..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['ALL', 'UNREAD', 'READ', 'REPLIED', 'ARCHIVED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-emerald-950 text-amber-300 shadow'
                  : 'bg-stone-100 hover:bg-stone-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGES LIST TABLE / CARDS */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-stone-200 text-center space-y-3">
            <Mail className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-slate-900">No Messages Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No contact enquiries match your search query or selected status filter.
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md cursor-pointer select-none ${
                msg.status === 'UNREAD' ? 'border-2 border-emerald-600 bg-emerald-50/20' : 'border-stone-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-extrabold bg-stone-100 text-slate-800 px-2 py-0.5 rounded border border-stone-200">
                      {msg.referenceNo}
                    </span>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                        msg.status === 'UNREAD'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : msg.status === 'REPLIED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : msg.status === 'ARCHIVED'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {msg.status}
                    </span>

                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      {msg.category}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900">{msg.subject}</h3>
                  <p className="text-xs text-slate-600 font-light line-clamp-1">{msg.message}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                  <div className="text-right">
                    <span className="font-bold text-slate-800 block">{msg.fullName}</span>
                    <span className="text-[11px] block">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMessageToDelete(msg);
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MESSAGE DETAIL & REPLY DRAWER MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                  {selectedMessage.referenceNo}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl text-slate-900">{selectedMessage.subject}</h2>
            </div>

            {/* Sender Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">SENDER</span>
                <span className="font-bold text-slate-900">{selectedMessage.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">EMAIL</span>
                <a href={`mailto:${selectedMessage.email}`} className="font-bold text-emerald-800 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">PHONE</span>
                <a href={`tel:${selectedMessage.phone}`} className="font-bold text-slate-900">
                  {selectedMessage.phone}
                </a>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">STATE</span>
                <span className="font-bold text-slate-900">{selectedMessage.state}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Enquiry Content</span>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm leading-relaxed text-slate-800 whitespace-pre-line font-light">
                {selectedMessage.message}
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-stone-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Official Secretariat Reply
              </span>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type official response to record in database..."
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-800 text-slate-900"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateContactMessageStatusAction(selectedMessage.id, 'ARCHIVED');
                      setSelectedMessage(null);
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Archive className="w-3.5 h-3.5" /> Archive
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={sendingReply}
                  className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow cursor-pointer"
                >
                  {sendingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-amber-400" />}
                  <span>{sendingReply ? 'Recording...' : 'Record Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <DeleteConfirmModal
          isOpen={!!messageToDelete}
          onClose={() => setMessageToDelete(null)}
          title="Delete Contact Enquiry"
          itemTitle={`Ref: ${messageToDelete.referenceNo} (${messageToDelete.fullName})`}
          onConfirm={async () => {
            await deleteContactMessageAction(messageToDelete.id);
          }}
        />
      )}
    </div>
  );
}
