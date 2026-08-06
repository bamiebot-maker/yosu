import React from 'react';
import { db } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export const revalidate = 0;

export default async function AdminAuditPage() {
  await requireRole(['SUPER_ADMIN']);

  const logs = await db.auditLog.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
          SUPER ADMIN GOVERNANCE & TELEMETRY
        </span>
        <h2 className="font-serif font-bold text-2xl text-slate-900">Security & Administrative Audit Logs</h2>
        <p className="text-xs text-slate-500 mt-1">
          Immutable trail of user logins, role assignments, content deletions, and governance updates (Super Admin Exclusive)
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-slate-700 font-bold border-b border-stone-200">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Action</th>
              <th className="p-4">User</th>
              <th className="p-4">Details</th>
              <th className="p-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500 font-medium">
                  System initialized. All subsequent administrative changes will be logged here.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-4 font-mono text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-950 bg-amber-200/80 px-2 py-0.5 rounded text-[10px] font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-900">{log.user?.email || 'System'}</td>
                  <td className="p-4 text-slate-600 font-mono text-[11px] max-w-md">{log.details}</td>
                  <td className="p-4 text-slate-400 font-mono text-[10px]">{log.ipAddress || '127.0.0.1'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
