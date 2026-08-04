import React from 'react';
import { db } from '@/lib/db';
import { AnnouncementsCrudPage } from '@/components/admin/crud-pages/announcements-crud-page';

export const revalidate = 0; // Dynamic server page

export default async function AdminAnnouncementsPage() {
  const announcements = await db.announcement.findMany({
    orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
  });

  return <AnnouncementsCrudPage announcements={announcements} />;
}
