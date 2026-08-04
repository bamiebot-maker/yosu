import React from 'react';
import Image from 'next/image';
import { db } from '@/lib/db';
import { Users, Plus, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AdminExecutivesPage() {
  const appointments = await db.officeAppointment.findMany({
    include: { person: { include: { avatarMedia: true } }, office: true },
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-xl text-slate-900">Executive Council & Office Appointments</h2>
          <p className="text-xs text-slate-500">Manage tenure appointments, positions, and profile details</p>
        </div>
        <button className="px-4 py-2 bg-emerald-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add New Appointment</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-slate-700 font-bold border-b border-stone-200">
            <tr>
              <th className="p-4">Office Position</th>
              <th className="p-4">Officer Name</th>
              <th className="p-4">State of Origin</th>
              <th className="p-4">Department & Level</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {appointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-stone-50/80">
                <td className="p-4 font-bold text-emerald-950">{appt.office.title}</td>
                <td className="p-4 font-medium text-slate-900">{appt.person.fullName}</td>
                <td className="p-4 text-amber-800 font-semibold">{appt.person.stateOfOrigin}</td>
                <td className="p-4 text-slate-600">{appt.person.department || 'N/A'}</td>
                <td className="p-4">
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    {appt.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-xs font-bold text-emerald-900 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
