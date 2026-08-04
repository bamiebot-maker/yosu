'use client';

import React, { useState } from 'react';
import { Users, Plus, Lock, Search } from 'lucide-react';
import { UserModal } from '@/components/admin/crud-modals/user-modal';
import { toggleUserStatusAction, resetUserPasswordAction } from '@/app/admin/actions';

interface UserItem {
  id: string;
  email: string;
  isActive: boolean;
  userRoles: {
    role: {
      code: string;
      name: string;
    };
  }[];
  person: {
    fullName: string;
    department: string | null;
    stateOfOrigin: string | null;
  } | null;
}

export function UsersCrudPage({ users }: { users: UserItem[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.person && u.person.fullName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block">
            USER GOVERNANCE & ACCESS CONTROL
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            User Accounts & Role Permissions ({users.length})
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage administrative user accounts, assign system roles, suspend access, and reset credentials.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Provision New User</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl">
          {message}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search accounts by name or email..."
          className="w-full text-xs font-medium bg-transparent focus:outline-none text-slate-900"
        />
      </div>

      {/* Users Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-400/40">
                    {u.person?.fullName?.charAt(0) || u.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-slate-900 leading-tight">
                      {u.person?.fullName || 'System Account'}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono truncate max-w-[180px]">{u.email}</p>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                    u.isActive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {u.isActive ? 'ACTIVE' : 'SUSPENDED'}
                </span>
              </div>

              {/* Roles Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {u.userRoles.length === 0 ? (
                  <span className="bg-stone-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">
                    MEMBER
                  </span>
                ) : (
                  u.userRoles.map((ur) => (
                    <span
                      key={ur.role.code}
                      className="bg-slate-100 text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border border-stone-200"
                    >
                      {ur.role.code}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                onClick={async () => {
                  const res = await toggleUserStatusAction(u.id);
                  setMessage(res.message || 'Status updated');
                  setTimeout(() => setMessage(null), 3000);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                  u.isActive
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {u.isActive ? 'Suspend' : 'Reactivate'}
              </button>

              <button
                onClick={async () => {
                  const res = await resetUserPasswordAction(u.id);
                  setMessage(res.message || 'Password reset');
                  setTimeout(() => setMessage(null), 4000);
                }}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-lg border border-stone-200 transition-colors flex items-center gap-1"
              >
                <Lock className="w-3 h-3 text-slate-500" /> Reset Credentials
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Provision User Modal */}
      <UserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
