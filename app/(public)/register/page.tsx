import React from 'react';
import { Metadata } from 'next';
import { InteractiveStudentRegistration } from '@/components/students/interactive-student-registration';

export const metadata: Metadata = {
  title: 'Official Student & Membership Registration | Yoruba Students\' Union (YOSU) FUD',
  description:
    'Register into the central digital student and membership database of YOSU Federal University Dutse Chapter. Obtain your official membership registration number and slip.',
  openGraph: {
    title: 'YOSU Student & Membership Registration Portal — FUD Chapter',
    description:
      'Official YOSU Student Database Registration for all Yoruba students at Federal University Dutse across all 8 constituent states.',
    url: 'https://yosufud.org.ng/register',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YOSU Student Registration Portal — FUD',
    description: 'Central student database registration for Yoruba Students\' Union FUD Chapter.',
  },
};

export default function RegisterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      <InteractiveStudentRegistration />
    </div>
  );
}
