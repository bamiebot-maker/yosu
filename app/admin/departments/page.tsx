import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getDepartmentsConfigAction } from '@/app/admin/actions';
import { DepartmentsCrudPage } from '@/components/admin/crud-pages/departments-crud-page';

export const dynamic = 'force-dynamic';

export default async function AdminDepartmentsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const initialConfig = await getDepartmentsConfigAction();

  return <DepartmentsCrudPage initialConfig={initialConfig} />;
}
