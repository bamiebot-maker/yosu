'use client';

import React, { useState } from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      id: '1',
      title: '2026 Constitution Ratified',
      message: 'House of Reps Speaker signed Unification Constitution PDF',
      time: '10m ago',
      type: 'success',
    },
    {
      id: '2',
      title: 'Digital Platform Project Progress',
      message: 'Milestone 2 completed. Progress updated to 85%',
      time: '1h ago',
      type: 'info',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 hover:text-emerald-950 bg-stone-100 hover:bg-amber-50 rounded-xl transition-colors relative"
        title="System Notifications"
      >
        <Bell className="w-4 h-4 text-slate-700" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 pb-2 border-b border-stone-100 flex justify-between items-center">
              <span className="font-serif font-bold text-xs text-slate-900">System Alerts</span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                2 New
              </span>
            </div>

            <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
              {notifications.map((item) => (
                <div key={item.id} className="p-3 hover:bg-stone-50 transition-colors flex gap-2.5">
                  {item.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-600 leading-snug">{item.message}</p>
                    <p className="text-[9px] text-slate-400 font-semibold">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 px-4 border-t border-stone-100 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-bold text-emerald-900 hover:underline"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
