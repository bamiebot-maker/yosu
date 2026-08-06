'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Share2, Copy, Check, Send, Mail, MessageCircle, Globe } from 'lucide-react';
import { likeArticleAction, shareArticleAction } from '@/app/admin/actions';

interface ArticleInteractionProps {
  articleId: string;
  title: string;
  summary: string | null;
  initialLikeCount: number;
  initialShareCount: number;
}

export function ArticleInteraction({
  articleId,
  title,
  summary,
  initialLikeCount,
  initialShareCount,
}: ArticleInteractionProps) {
  const [likes, setLikes] = useState(initialLikeCount);
  const [shares, setShares] = useState(initialShareCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const liked = localStorage.getItem(`yosu_liked_${articleId}`);
      if (liked === 'true') {
        setHasLiked(true);
      }
    }
  }, [articleId]);

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    setIsLiking(true);

    try {
      const res = await likeArticleAction(articleId);
      if (res.success && typeof res.likeCount === 'number') {
        setLikes(res.likeCount);
        setHasLiked(true);
        localStorage.setItem(`yosu_liked_${articleId}`, 'true');
      }
    } catch (err) {
      console.error('Failed to like article:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareClick = async () => {
    // Record share count in DB
    shareArticleAction(articleId).then((res) => {
      if (res.success && typeof res.shareCount === 'number') {
        setShares(res.shareCount);
      }
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary || title,
          url: currentUrl,
        });
        return;
      } catch (e) {
        // User cancelled or fallback needed
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
  const encodedTitle = encodeURIComponent(title);

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
    <div className="pt-6 border-t border-stone-200 flex items-center justify-between gap-4 font-sans">
      <div className="flex items-center gap-3">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={hasLiked || isLiking}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
            hasLiked
              ? 'bg-rose-50 text-rose-600 border-rose-200 cursor-default'
              : 'bg-stone-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-stone-200 hover:border-rose-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{hasLiked ? 'Liked' : 'Like'} ({likes})</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShareClick}
          className="px-4 py-2 bg-stone-50 hover:bg-stone-100 text-slate-700 text-xs font-bold rounded-xl border border-stone-200 transition-all flex items-center gap-2"
        >
          <Share2 className="w-4 h-4 text-emerald-800" />
          <span>Share Gazette ({shares})</span>
        </button>
      </div>

      <button
        onClick={copyToClipboard}
        className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
        <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
      </button>

      {/* Share Fallback Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-base text-slate-900">Share News Gazette</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {shareLinks.map((platform) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${platform.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{platform.name}</span>
                  </a>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Direct Gazette Link</span>
              <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="w-full text-[11px] font-mono bg-transparent focus:outline-none text-slate-700 truncate"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-[11px] rounded-lg shrink-0"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
