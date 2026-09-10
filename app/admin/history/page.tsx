import React from 'react';
import { getAllHistoryChaptersAdminAction } from '@/app/admin/history-actions';
import { HistoryCrudPage } from '@/components/admin/crud-pages/history-crud-page';

export const dynamic = 'force-dynamic';

export default async function AdminHistoryPage() {
  const result = await getAllHistoryChaptersAdminAction();
  const chapters = result.success && result.chapters ? (result.chapters as any[]) : [];

  return <HistoryCrudPage initialChapters={chapters} />;
}
