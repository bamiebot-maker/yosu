'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Share2, Copy, Check, Send, Mail, MessageCircle, Globe, X } from 'lucide-react';

interface LeaderStoryInteractionProps {
  storyId: string;
  title: string;
  summary: string;
  initialLikeCount: number;
  initialShareCount: number;
}

export function LeaderStoryInteraction({
  storyId,
  title,
  summary,
  initialLikeCount,
  initialShareCount,
}: LeaderStoryInteractionProps) {
  const [likes, setLikes] = useState(initialLikeCount);
  const [shares, setShares] = useState(initialShareCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const liked = localStorage.getItem(`yosu_leader_liked_${storyId}`);
      if (liked === 'true') {
        setHasLiked(true);
      }
      const savedShares = localStorage.getItem(`yosu_leader_shares_${storyId}`);
      if (savedShares) {
        setShares(parseInt(savedShares, 10));
      }
      const savedLikes = localStorage.getItem(`yosu_leader_likecount_${storyId}`);
      if (savedLikes) {
        setLikes(parseInt(savedLikes, 10));
      }
    }
  }, [storyId]);

  const handleLike = () => {
    if (hasLiked) {
      // Toggle unlike
      const newCount = Math.max(0, likes - 1);
      setLikes(newCount);
      setHasLiked(false);
      localStorage.removeItem(`yosu_leader_liked_${storyId}`);
      localStorage.setItem(`yosu_leader_likecount_${storyId}`, newCount.toString());
    } else {
      // Like
      const newCount = likes + 1;
      setLikes(newCount);
      setHasLiked(true);
      localStorage.setItem(`yosu_leader_liked_${storyId}`, 'true');
      localStorage.setItem(`yosu_leader_likecount_${storyId}`, newCount.toString());
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareClick = async () => {
    const newShares = shares + 1;
    setShares(newShares);
    localStorage.setItem(`yosu_leader_shares_${storyId}`, newShares.toString());

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} | YOSU FUD Gazette`,
          text: summary,
          url: currentUrl,
        });
        return;
      } catch (e) {
        // Fallback to modal
      }
    }

    setIsShareModalOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(`${title} — YOSU FUD Historical Gazette`);

  const shareLinks = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Globe,
      color: 'bg-slate-900 hover:bg-black text-white',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: Globe,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
      icon: Mail,
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
  ];

  return (
    <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-3 font-sans">
      {/* Like Button */}
      <button
        onClick={handleLike}
        className={`px-2 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
          hasLiked
            ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-sm'
            : 'bg-stone-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-stone-200 hover:border-rose-200'
        }`}
        aria-label={hasLiked ? 'Liked' : 'Like article'}
      >
        <Heart className={`w-3.5 h-3.5 shrink-0 transition-transform ${hasLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
        <span>{hasLiked ? 'Liked' : 'Like'} ({likes})</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShareClick}
        className="px-2 sm:px-4 py-2 bg-stone-50 hover:bg-stone-100 text-slate-700 text-[11px] sm:text-xs font-bold rounded-xl border border-stone-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:border-emerald-800"
        aria-label="Share article"
      >
        <Share2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
        <span>Share ({shares})</span>
      </button>

      {/* Copy Link Direct Button */}
      <button
        onClick={copyToClipboard}
        className="px-2 sm:px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-[11px] sm:text-xs font-semibold rounded-xl border border-stone-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        aria-label="Copy link to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-emerald-700 font-bold truncate">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">Copy Link</span>
          </>
        )}
      </button>

      {/* Share Modal Dialog */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-[100000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-800" />
                <h3 className="font-serif font-bold text-slate-900 text-lg">Share Presidential Gazette</h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Share &ldquo;{title}&rdquo; with fellow students, alumni, and historical researchers across social networks:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {shareLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 p-3 rounded-xl font-bold text-xs transition-all shadow-sm ${item.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Direct Copy Bar */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-slate-700">Or copy direct link:</span>
              <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-xl border border-stone-200">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="bg-transparent text-xs text-slate-600 px-2 py-1 flex-1 outline-none font-mono truncate select-all"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
