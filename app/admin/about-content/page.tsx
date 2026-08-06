import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { AboutContentCrudPage } from '@/components/admin/crud-pages/about-content-crud-page';

export const revalidate = 0;

export default async function AdminAboutContentPage() {
  const session = await getSession();
  const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN') ?? false;

  const aboutSections = await db.aboutContent.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <AboutContentCrudPage
      aboutSections={aboutSections}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
