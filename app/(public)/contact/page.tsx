import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="emerald-gradient-bg text-white rounded-2xl p-8 sm:p-12 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded border border-amber-400/30 uppercase tracking-wider">
            OFFICIAL CORRESPONDENCE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Contact YOSU Headquarters</h1>
          <p className="text-stone-200 text-sm sm:text-base font-light">
            Send official inquiries, petitions, or welfare concerns directly to the Executive Council.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-slate-900">Headquarters Address</h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>Yoruba Students' Union (YOSU), Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria.</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-600 shrink-0" />
              <span>info@yosu.fud.edu.ng</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-amber-600 shrink-0" />
              <span>+234 801 234 5678</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-slate-900">Send an Official Message</h2>
          <form className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Subject</label>
              <input
                type="text"
                placeholder="Message subject or petition title"
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Message Content</label>
              <textarea
                rows={5}
                placeholder="Type your message here..."
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>

            <button
              type="button"
              className="px-6 py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Submit Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
