'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Newspaper, Users, FolderGit2, Layers, Megaphone, Image as ImageIcon, X, Command } from 'lucide-react';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = Router();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) return null;

  const quickLinks = [
    { name: 'News Gazettes & Statements', href: '/admin/news', icon: Newspaper, category: 'CMS' },
    { name: 'Executive Leadership Roster', href: '/admin/executives', icon: Users, category: 'ROSTER' },
    { name: 'Development Projects Tracker', href: '/admin/projects', icon: FolderGit2, category: 'PROJECTS' },
    { name: 'Administration Sessions', href: '/admin/sessions', icon: Layers, category: 'GOVERNANCE' },
    { name: 'Announcements & Alerts', href: '/admin/announcements', icon: Megaphone, category: 'BROADCAST' },
    { name: 'Central Media Library', href: '/admin/media', icon: ImageIcon, category: 'ASSETS' },
  ];

  const filteredLinks = quickLinks.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-950 font-serif font-bold text-lg">
            <Command className="w-5 h-5 text-amber-500" />
            <span>YOSU Admin Global Command Search</span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 ml-1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search module (e.g., News, Executives, Projects)..."
            className="w-full text-sm font-medium bg-transparent focus:outline-none text-slate-900"
          />
        </div>

        {/* Results */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredLinks.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No matching module found.</p>
          ) : (
            filteredLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => navigateTo(item.href)}
                  className="w-full p-3 rounded-xl hover:bg-amber-50/50 hover:border-amber-300 border border-transparent flex items-center justify-between text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 text-amber-400 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-slate-900">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Route: {item.href}</span>
                    </div>
                  </div>

                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded uppercase bg-stone-100 text-slate-700 border border-stone-200">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Press ESC to close</span>
          <span>Tip: Ctrl + K anywhere in admin</span>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return useRouter();
}
