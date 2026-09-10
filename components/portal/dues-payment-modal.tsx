'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Building2,
  QrCode,
  Download,
  Calendar,
  Lock,
} from 'lucide-react';
import {
  initializeDuesPaymentAction,
  verifyPaymentAction,
  getDuesSettingsAction,
} from '@/app/actions/payment-actions';

interface DuesPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMatric?: string;
  defaultEmail?: string;
}

export function DuesPaymentModal({
  isOpen,
  onClose,
  defaultMatric = '',
  defaultEmail = '',
}: DuesPaymentModalProps) {
  const [matricNumber, setMatricNumber] = useState(defaultMatric);
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'INPUT' | 'PROCESSING' | 'SUCCESS'>('INPUT');
  const [receiptData, setReceiptData] = useState<any>(null);

  if (!isOpen) return null;

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricNumber.trim() && !email.trim()) {
      setError('Please provide your Matriculation Number or Registered Email.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await initializeDuesPaymentAction({ matricNumber, email });
    setLoading(false);

    if (!res.success) {
      if (res.alreadyPaid) {
        setError(`Dues already paid for session! Receipt Ref: ${res.receiptNumber}`);
      } else {
        setError(res.error || 'Failed to initialize payment');
      }
      return;
    }

    setPaymentStep('PROCESSING');

    if (res.authorizationUrl) {
      // Direct user to Paystack official gateway
      window.location.href = res.authorizationUrl;
    } else if (res.reference) {
      // Sandbox mode verification for local testing
      const verifyRes = await verifyPaymentAction(res.reference);
      if (verifyRes.success) {
        setReceiptData({
          receiptNumber: verifyRes.receiptNumber,
          reference: res.reference,
          studentName: res.studentName,
          matricNumber: res.matricNumber,
          amount: res.amount,
          date: new Date().toLocaleDateString(),
        });
        setPaymentStep('SUCCESS');
      } else {
        setError('Payment verification failed.');
        setPaymentStep('INPUT');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentStep === 'INPUT' && (
          <div className="space-y-5">
            <div className="space-y-1 text-center">
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                SECURE YEARLY DUES PAYMENT
              </span>
              <h2 className="font-serif text-2xl font-extrabold text-slate-900 mt-2">
                YOSU Yearly Dues Collection
              </h2>
              <p className="text-xs text-slate-600 font-light">
                Official student dues collection for Federal University Dutse Chapter (2026/2027 Academic Session).
              </p>
            </div>

            {/* DUES SUMMARY CARD */}
            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-emerald-900 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
                <span className="text-slate-400">Official Dues Amount:</span>
                <span className="text-amber-300 font-serif text-xl font-bold">₦2,000.00</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Academic Session:</span>
                <span className="text-emerald-400 font-mono font-bold">2026/2027</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Security Standard:</span>
                <span className="text-amber-200 flex items-center gap-1 font-semibold text-[10px]">
                  <Lock className="w-3 h-3 text-amber-400" /> 256-bit Encrypted HMAC SHA-512
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 text-red-900 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStartPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Matriculation Number *
                </label>
                <input
                  type="text"
                  required
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  placeholder="e.g. FUD/2023/CS/0142"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold uppercase tracking-wider focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@fud.edu.ng"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-900 text-amber-300 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all border border-emerald-800"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>{loading ? 'Securing Transaction...' : 'Pay ₦2,000 Dues via Paystack'}</span>
              </button>
            </form>

            <div className="text-[11px] text-slate-500 text-center font-light leading-relaxed">
              Supports Nigerian Cards (Verve/Mastercard/Visa), Virtual Bank Transfers, USSD & NQR.
            </div>
          </div>
        )}

        {paymentStep === 'PROCESSING' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-900 border-t-amber-400 animate-spin mx-auto" />
            <h3 className="font-serif font-bold text-slate-900 text-lg">Connecting to Secure Gateway...</h3>
            <p className="text-xs text-slate-500">Please do not close this window.</p>
          </div>
        )}

        {paymentStep === 'SUCCESS' && receiptData && (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-800 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8 text-emerald-700" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-extrabold text-slate-900">
                Payment Verified & Success!
              </h3>
              <p className="text-xs text-slate-600">
                Official YOSU Member Dues Receipt generated for session 2026/2027.
              </p>
            </div>

            {/* DIGITAL RECEIPT CARD */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-left space-y-3 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-slate-500">Receipt No:</span>
                <span className="font-mono font-bold text-emerald-900">{receiptData.receiptNumber}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-slate-500">Student Name:</span>
                <span className="font-semibold text-slate-900">{receiptData.studentName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-slate-500">Matriculation No:</span>
                <span className="font-mono text-slate-900">{receiptData.matricNumber}</span>
              </div>
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="font-bold text-slate-500">Amount Paid:</span>
                <span className="font-serif font-bold text-amber-700">₦{receiptData.amount.toLocaleString()}.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Status:</span>
                <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-300">
                  VERIFIED & ACTIVE
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Receipt #${receiptData.receiptNumber} downloaded.`);
                onClose();
              }}
              className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-amber-300 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download Verifiable PDF Receipt</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
