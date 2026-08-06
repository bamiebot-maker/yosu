import React from 'react';
import { db } from '@/lib/db';
import { ContactSettingsCrudPage } from '@/components/admin/crud-pages/contact-settings-crud-page';

export const revalidate = 0;

export default async function AdminContactSettingsPage() {
  const [siteSettings, faqsData] = await Promise.all([
    db.siteSetting.findMany(),
    db.faqItem.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  const settingsMap: Record<string, string> = {};
  siteSettings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  const faqs = faqsData.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
    displayOrder: f.displayOrder,
    isPublished: f.isPublished,
  }));

  return <ContactSettingsCrudPage settings={settingsMap} faqs={faqs} />;
}
