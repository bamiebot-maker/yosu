'use client';

import React, { useState } from 'react';
import { Users, Plus, Lock, Search, Trash2, AlertTriangle, X } from 'lucide-react';
import { UserModal } from '@/components/admin/crud-modals/user-modal';
import { toggleUserStatusAction, resetUserPasswordAction, deleteUserAction } from '@/app/admin/actions';

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

export function UsersCrudPage({
  users,
  isSuperAdmin = false,
  currentUserId,
}: {
  users: UserItem[];
  isSuperAdmin?: boolean;
  currentUserId?: string | null;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User Deletion Modal State
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.person && u.person.fullName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setMessage(null);
    setErrorMessage(null);

    const res = await deleteUserAction(userToDelete.id);
    setIsDeleting(false);
    setUserToDelete(null);

    if (res.success) {
      setMessage(res.message || 'User deleted successfully.');
      setTimeout(() => setMessage(null), 4000);
    } else {
      setErrorMessage(res.error || 'Failed to delete user.');
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
            USER GOVERNANCE & ACCESS CONTROL
          </span>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            User Accounts & Role Permissions ({users.length})
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage administrative user accounts, assign system roles, suspend access, and reset credentials.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Provision User</span>
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-2xl">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold rounded-2xl">
          {errorMessage}
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
        {filteredUsers.map((u) => {
          const isSelf = currentUserId === u.id;
          return (
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
                        {isSelf && (
                          <span className="ml-2 text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-extrabold">
                            YOU
                          </span>
                        )}
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const res = await toggleUserStatusAction(u.id);
                      if (res.success) {
                        setMessage(res.message || 'Status updated');
                        setTimeout(() => setMessage(null), 3000);
                      } else {
                        setErrorMessage(res.error || 'Failed to update status');
                        setTimeout(() => setErrorMessage(null), 3000);
                      }
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
                      if (res.success) {
                        setMessage(res.message || 'Password reset');
                        setTimeout(() => setMessage(null), 4000);
                      } else {
                        setErrorMessage(res.error || 'Failed to reset password');
                        setTimeout(() => setErrorMessage(null), 4000);
                      }
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-lg border border-stone-200 transition-colors flex items-center gap-1"
                  >
                    <Lock className="w-3 h-3 text-slate-500" /> Reset
                  </button>
                </div>

                {/* Completely remove Delete button if current user is NOT Super Admin */}
                {isSuperAdmin && !isSelf && (
                  <button
                    onClick={() => setUserToDelete(u)}
                    title="Delete Account"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete User Safety Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">Confirm Account Deletion</h3>
                  <p className="text-xs text-slate-500 font-mono">{userToDelete.email}</p>
                </div>
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-rose-50/80 p-4 rounded-2xl border border-rose-200 text-rose-900">
              <p className="text-xs font-bold leading-relaxed">
                This action permanently deletes this account.
              </p>
              <p className="text-[11px] text-rose-700">
                All associated system access permissions, assigned roles, and credentials for{' '}
                <strong>{userToDelete.person?.fullName || userToDelete.email}</strong> will be erased.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold text-xs rounded-xl border border-stone-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {isDeleting ? 'Deleting Account...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provision User Modal */}
      <UserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
