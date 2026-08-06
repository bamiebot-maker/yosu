import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { UsersCrudPage } from '@/components/admin/crud-pages/users-crud-page';

export const revalidate = 0;

export default async function AdminUsersPage() {
  const session = await getSession();
  const isSuperAdmin = session?.roleCodes.includes('SUPER_ADMIN') ?? false;
  const currentUserId = session?.userId || null;

  const users = await db.user.findMany({
    include: {
      person: true,
      userRoles: {
        include: { role: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <UsersCrudPage users={users} isSuperAdmin={isSuperAdmin} currentUserId={currentUserId} />;
}
