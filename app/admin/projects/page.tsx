import React from 'react';
import { db } from '@/lib/db';
import { ProjectsCrudPage } from '@/components/admin/crud-pages/projects-crud-page';

export const revalidate = 0; // Dynamic server page

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return <ProjectsCrudPage projects={projects} />;
}
