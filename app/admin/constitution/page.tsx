import React from 'react';
import { db } from '@/lib/db';
import { ConstitutionCrudPage } from '@/components/admin/crud-pages/constitution-crud-page';

export const revalidate = 0; // Dynamic server page

export default async function AdminConstitutionPage() {
  const versions = await db.constitutionVersion.findMany({
    orderBy: { effectiveDate: 'desc' },
  });

  return <ConstitutionCrudPage versions={versions} />;
}
