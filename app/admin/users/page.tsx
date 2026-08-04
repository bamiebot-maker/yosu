import React from 'react';
import { db } from '@/lib/db';
import { UsersCrudPage } from '@/components/admin/crud-pages/users-crud-page';

export const revalidate = 0; // Dynamic server page

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: {
      person: true,
      userRoles: {
        include: { role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <UsersCrudPage users={users} />;
}
