import React from 'react';
import { db } from '@/lib/db';
import { MediaCrudPage } from '@/components/admin/crud-pages/media-crud-page';

export const revalidate = 0; // Dynamic server page

export default async function AdminMediaPage() {
  const mediaItems = await db.media.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <MediaCrudPage mediaItems={mediaItems} />;
}
