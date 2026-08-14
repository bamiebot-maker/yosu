'use client';

import React, { useActionState, useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, AlertCircle, HelpCircle, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { submitMemberFeedbackAction } from '@/lib/actions/member.actions';

export interface MemberFeedbackItem {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  adminNotes?: string | null;
  createdAt: Date | string;
}

interface FeedbackCentreProps {
  feedbacks: MemberFeedbackItem[];
}

export function FeedbackCentre({ feedbacks }: FeedbackCentreProps) {
  const [state, formAction, isPending] = useActionState(submitMemberFeedbackAction, null);
  const [subjectInput, setSubjectInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('SUGGESTION');
  const [messageInput, setMessageInput] = useState('');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Member Governance Communication</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Feedback & Suggestion Centre
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
            Voice your suggestions, welfare complaints, or recommendations directly to the YOSU Executive President & Secretariat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Submission Form */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-800" />
              <span>Submit New Entry</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Your input is reviewed directly by leadership.</p>
          </div>

          {state?.error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {state?.success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Submission Received!</p>
                <p className="mt-0.5 text-emerald-800">{state.message}</p>
              </div>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Category Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Submission Category
              </label>
              <select
                name="category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 transition-all font-medium"
              >
                <option value="SUGGESTION">💡 General Suggestion</option>
                <option value="COMPLAINT">⚠️ Welfare or Campus Complaint</option>
                <option value="RECOMMENDATION">📜 Academic / Constitutional Recommendation</option>
              </select>
            </div>

            {/* Subject Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Subject Line
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="e.g. Welfare Support Request for 100L Orientation"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 transition-all"
              />
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Detailed Message
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Provide complete context, recommendations, or details..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Submitting Entry...</span>
                </>
              ) : (
                <>
                  <span>Send to Executive Council</span>
                  <Send className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: Previously Submitted History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-800" />
              <span>Your Submission History ({feedbacks.length})</span>
            </h3>
          </div>

          {feedbacks.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-serif text-base font-bold text-slate-800">No Submissions Yet</h4>
              <p className="text-xs text-slate-500">
                You haven't submitted any suggestions or complaints. Use the form to reach out to the Executive Council.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3 hover:border-emerald-800/40 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-100 text-emerald-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {fb.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(fb.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        fb.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : fb.status === 'REVIEWED'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-100 text-slate-700 border border-stone-300'
                      }`}
                    >
                      {fb.status === 'RESOLVED' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-700" />
                      )}
                      <span>{fb.status}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-base font-bold text-slate-900">{fb.subject}</h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">
                      {fb.message}
                    </p>
                  </div>

                  {/* Admin Response Note */}
                  {fb.adminNotes && (
                    <div className="mt-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                      <p className="font-bold flex items-center gap-1 text-emerald-900">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Executive Secretariat Response:
                      </p>
                      <p className="text-slate-800 leading-relaxed italic">{fb.adminNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
