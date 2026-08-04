import React from 'react';
import Link from 'next/link';
import { searchAllDomains } from '@/src/features/search/search-service';
import { Search, BookOpen, Newspaper, Users, Building2, ArrowRight } from 'lucide-react';

export const revalidate = 0; // Dynamic search

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const results = await searchAllDomains(query);

  const getDomainBadge = (domain: string) => {
    switch (domain) {
      case 'CONSTITUTION':
        return <span className="bg-[#E5A91A] text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]">CONSTITUTION</span>;
      case 'NEWS':
        return <span className="bg-emerald-900 text-white font-bold px-2 py-0.5 rounded text-[10px]">NEWSROOM</span>;
      case 'LEADERSHIP':
        return <span className="bg-emerald-800 text-white font-bold px-2 py-0.5 rounded text-[10px]">GOVERNANCE</span>;
      case 'PROJECTS':
        return <span className="bg-blue-900 text-white font-bold px-2 py-0.5 rounded text-[10px]">PROJECT</span>;
      default:
        return <span className="bg-stone-200 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">{domain}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-emerald-950">
          Unified Institutional Search Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Search across the 2026 Constitution, Newsroom Gazettes, Executive Leadership, Projects, and Downloads.
        </p>

        {/* Search Input Form */}
        <form action="/search" method="GET" className="max-w-2xl mx-auto flex gap-2">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search Constitution, Leaders, News, Projects..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-sm font-medium text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search Results */}
      {query && (
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
            <span>Search query: "<strong className="text-slate-900">{query}</strong>"</span>
            <span>{results.length} results found</span>
          </div>

          {results.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 text-center text-slate-500 text-sm">
              No matching records found. Try searching for terms like "Constitution", "President", "Executive", "Name Change", or "Article".
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((res) => (
                <Link
                  key={res.id}
                  href={res.url}
                  className="block bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all space-y-2 group"
                >
                  <div className="flex items-center gap-2">
                    {getDomainBadge(res.domain)}
                    {res.subtitle && <span className="text-xs text-slate-500 font-medium">{res.subtitle}</span>}
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-emerald-900 transition-colors flex items-center justify-between">
                    <span>{res.title}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{res.snippet}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
