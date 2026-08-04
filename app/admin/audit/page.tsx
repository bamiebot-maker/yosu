import React from 'react';
import { db } from '@/lib/db';
import { FileText, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminAuditPage() {
  const logs = await db.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <h2 className="font-serif font-bold text-xl text-slate-900">Security & Administrative Audit Logs</h2>
        <p className="text-xs text-slate-500">Immutable trail of system logins, content changes, and governance updates</p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-slate-700 font-bold border-b border-stone-200">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Action</th>
              <th className="p-4">User</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  System initialized. All subsequent administrative changes will be logged here.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/80">
                  <td className="p-4 font-mono text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-4 font-bold text-emerald-950">{log.action}</td>
                  <td className="p-4 font-medium text-slate-900">{log.user?.email || 'System'}</td>
                  <td className="p-4 text-slate-600">{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
