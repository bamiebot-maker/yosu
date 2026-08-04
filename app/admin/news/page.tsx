import React from 'react';
import { db } from '@/lib/db';
import { Newspaper, Plus } from 'lucide-react';

export const revalidate = 0;

export default async function AdminNewsPage() {
  const articles = await db.newsArticle.findMany({
    include: { category: true, author: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-xl text-slate-900">Newsroom & Press Release Management</h2>
          <p className="text-xs text-slate-500">Draft, publish, and schedule official announcements</p>
        </div>
        <button className="px-4 py-2 bg-emerald-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>New Gazette Article</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-slate-700 font-bold border-b border-stone-200">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Published Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-stone-50/80">
                <td className="p-4 font-bold text-slate-900">{art.title}</td>
                <td className="p-4 font-medium text-amber-800">{art.category.name}</td>
                <td className="p-4">
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    {art.status}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : 'Draft'}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="font-bold text-emerald-900 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
