import React from 'react';
import { getAllPaymentTransactionsAction, getDuesSettingsAction } from '@/app/actions/payment-actions';
import { PaymentsCrudPage } from '@/components/admin/crud-pages/payments-crud-page';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const result = await getAllPaymentTransactionsAction();
  const transactions = result.success && result.transactions ? (result.transactions as any[]) : [];

  const settingsRes = await getDuesSettingsAction();
  const settings = {
    duesAmount: settingsRes.duesAmount || 2000.0,
    duesPaymentEnabled: settingsRes.duesPaymentEnabled !== false,
    academicSession: settingsRes.academicSession || '2026/2027',
  };

  return <PaymentsCrudPage initialTransactions={transactions} initialSettings={settings} />;
}
