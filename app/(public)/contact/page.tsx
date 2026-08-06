import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import {
  InteractiveContactCentre,
  ContactSettingsMap,
  FaqItemClient,
} from '@/components/contact/interactive-contact-centre';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Official Contact & Communication Centre | Yoruba Students\' Union (YOSU) FUD',
  description:
    'Connect directly with the Executive Council, Secretariat, or House of Representatives of YOSU FUD Chapter. Submit official enquiries, petitions, or welfare requests.',
  openGraph: {
    title: 'Contact YOSU Secretariat — Federal University Dutse',
    description:
      'Official Secretariat Communication Portal for student enquiries, welfare complaints, sponsorships, and petitions.',
    url: 'https://yosufud.org.ng/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact YOSU Secretariat — FUD Chapter',
    description: 'Official Secretariat Communication Portal for student enquiries and support.',
  },
};

export default async function ContactPage() {
  const [siteSettings, faqsData] = await Promise.all([
    db.siteSetting.findMany(),
    db.faqItem.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  const settingsMap: ContactSettingsMap = {};
  siteSettings.forEach((s) => {
    settingsMap[s.key as keyof ContactSettingsMap] = s.value;
  });

  const faqs: FaqItemClient[] = faqsData.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category,
    displayOrder: f.displayOrder,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <InteractiveContactCentre settings={settingsMap} faqs={faqs} />
    </div>
  );
}
