'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Download,
  Calendar,
  Filter,
  DollarSign,
  ShieldCheck,
  Edit2,
  Save,
  X,
  Sliders,
} from 'lucide-react';
import { updateDuesSettingsAction } from '@/app/actions/payment-actions';

interface PaymentTransaction {
  id: string;
  reference: string;
  matricNumber: string;
  fullName: string;
  email: string;
  amount: number;
  academicSession: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'ABANDONED';
  paymentChannel?: string | null;
  receiptNumber?: string | null;
  paidAt?: string | Date | null;
  createdAt: string | Date;
}

interface DuesSettings {
  duesAmount: number;
  duesPaymentEnabled: boolean;
  academicSession: string;
}

interface PaymentsCrudPageProps {
  initialTransactions: PaymentTransaction[];
  initialSettings: DuesSettings;
}

export function PaymentsCrudPage({ initialTransactions, initialSettings }: PaymentsCrudPageProps) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(initialTransactions);
  const [settings, setSettings] = useState<DuesSettings>(initialSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.receiptNumber && t.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSuccessfulRevenue = transactions
    .filter((t) => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const successfulCount = transactions.filter((t) => t.status === 'SUCCESS').length;

  const handleUpdateSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateDuesSettingsAction(formData);
    setLoading(false);

    if (res.success) {
      const newAmount = parseFloat(formData.get('duesAmount') as string);
      const newSession = formData.get('academicSession') as string;
      const newEnabled = formData.get('duesPaymentEnabled') === 'true';

      setSettings({
        duesAmount: newAmount,
        academicSession: newSession,
        duesPaymentEnabled: newEnabled,
      });

      setIsSettingsModalOpen(false);
      setMessage({ type: 'success', text: 'Yearly dues settings updated successfully!' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update settings' });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 text-white p-6 rounded-3xl border border-emerald-900 shadow-lg">
        <div>
          <span className="bg-emerald-900 text-amber-300 font-extrabold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-400/30 inline-flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            FINANCIAL SECURITY & DUES DASHBOARD
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100 mt-2">
            Student Dues Revenue & Audit Transactions
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-light mt-1">
            Real-time audit log of student yearly dues payments verified via HMAC SHA-512 Paystack Gateway.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-md transition-all"
          >
            <Sliders className="w-4 h-4" />
            <span>Edit Dues Fee & Settings</span>
          </button>

          <div className="bg-stone-900 p-3 rounded-2xl border border-emerald-800 text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Revenue</div>
            <div className="font-serif text-xl font-extrabold text-amber-300">
              ₦{totalSuccessfulRevenue.toLocaleString()}.00
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK MESSAGE */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-500 hover:text-slate-900">
            ✕
          </button>
        </div>
      )}

      {/* METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase">Verified Payments</span>
          <div className="text-2xl font-extrabold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>{successfulCount} Members</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-extrabold uppercase">Pending Checkout</span>
          <div className="text-2xl font-extrabold text-amber-700 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-600" />
            <span>{transactions.filter((t) => t.status === 'PENDING').length} Initiated</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase">Official Dues Rate</span>
            <span
              className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                settings.duesPaymentEnabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}
            >
              {settings.duesPaymentEnabled ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <span>₦{settings.duesAmount.toLocaleString()}.00</span>
            </div>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="text-xs text-emerald-800 hover:underline font-bold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Session: {settings.academicSession}
          </div>
        </div>
      </div>

      {/* EDIT DUES SETTINGS MODAL */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <h2 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-800" />
                Edit Yearly Dues Configuration
              </h2>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Yearly Dues Fee (NGN ₦) *
                </label>
                <input
                  type="number"
                  name="duesAmount"
                  step="50"
                  required
                  defaultValue={settings.duesAmount}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Academic Session Title *
                </label>
                <input
                  type="text"
                  name="academicSession"
                  required
                  defaultValue={settings.academicSession}
                  placeholder="e.g. 2026/2027"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="duesPaymentEnabled"
                  name="duesPaymentEnabled"
                  value="true"
                  defaultChecked={settings.duesPaymentEnabled}
                  className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                />
                <label htmlFor="duesPaymentEnabled" className="text-xs font-bold text-slate-800">
                  Enable Dues Payment Collection Portal
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-emerald-900 hover:bg-emerald-800 text-amber-300 text-xs font-extrabold rounded-xl flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Updating...' : 'Save Dues Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Matric, Name, Ref, Receipt..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-2xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Verified (SUCCESS)</option>
            <option value="PENDING">Pending (PENDING)</option>
            <option value="FAILED">Failed (FAILED)</option>
          </select>
        </div>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-stone-50 border-b border-stone-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Student / Matric</th>
                <th className="px-5 py-3.5">Reference & Receipt</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Session</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Channel</th>
                <th className="px-5 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500 italic">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{t.fullName}</div>
                      <div className="text-[11px] text-emerald-800 font-mono">{t.matricNumber}</div>
                      <div className="text-[10px] text-slate-400">{t.email}</div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-mono text-[11px] text-slate-700">{t.reference}</div>
                      {t.receiptNumber ? (
                        <div className="font-mono text-[10px] font-bold text-emerald-900">
                          {t.receiptNumber}
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">No receipt generated</div>
                      )}
                    </td>

                    <td className="px-5 py-4 font-serif font-bold text-amber-700 text-sm">
                      ₦{t.amount.toLocaleString()}.00
                    </td>

                    <td className="px-5 py-4 text-slate-700 font-mono text-[11px]">
                      {t.academicSession}
                    </td>

                    <td className="px-5 py-4">
                      {t.status === 'SUCCESS' ? (
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                        </span>
                      ) : t.status === 'PENDING' ? (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" /> PENDING
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-red-300">
                          <XCircle className="w-3 h-3 text-red-600" /> FAILED
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-[11px] text-slate-600">
                      {t.paymentChannel || 'ONLINE'}
                    </td>

                    <td className="px-5 py-4 text-[11px] text-slate-500 font-mono">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
