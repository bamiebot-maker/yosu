import React from 'react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { RegistrationSettingsCrudPage } from '@/components/admin/crud-pages/registration-settings-crud-page';

export const revalidate = 0;

export default async function AdminRegistrationSettingsPage() {
  const session = await getSession();
  if (!session || !session.roleCodes.includes('SUPER_ADMIN')) {
    redirect('/admin/unauthorized');
  }

  const [settings, totalRegistered] = await Promise.all([
    db.registrationSettings.findFirst({
      orderBy: { updatedAt: 'desc' },
    }),
    db.studentRegistration.count(),
  ]);

  const serializedSettings = settings
    ? {
        id: settings.id,
        registrationOpen: settings.registrationOpen,
        opensAt: settings.opensAt ? settings.opensAt.toISOString().split('T')[0] : '',
        closesAt: settings.closesAt ? settings.closesAt.toISOString().split('T')[0] : '',
        notice: settings.notice || '',
        closedMessage: settings.closedMessage || '',
        academicSession: settings.academicSession || '2026/2027',
        updatedAt: settings.updatedAt.toISOString(),
      }
    : null;

  return (
    <RegistrationSettingsCrudPage
      settings={serializedSettings}
      totalRegistered={totalRegistered}
    />
  );
}
