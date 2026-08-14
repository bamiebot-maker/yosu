import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ConditionalLayout } from '@/components/layout/conditional-layout';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://yosu.fud.edu.ng'),
  title: 'Yoruba Students\' Union (YOSU) — Federal University Dutse',
  description:
    'Official Portal and Digital Headquarters of the Yoruba Students\' Union (YOSU), Federal University Dutse Chapter. Motto: Ìpínlẹ̀ Ọmọ Oòduà: Ìfẹ̀ Sówapọ.',
  keywords: [
    'YOSU',
    'YORUBA STUDENTS UNION',
    'Federal University Dutse',
    'FUD',
    'YOSU FUD',
    'NAKOLES',
    'Yoruba Students',
    'Dutse',
    'Jigawa State',
    'Nigeria',
  ],
  authors: [{ name: 'Yoruba Students\' Union (YOSU) Federal University Dutse Chapter' }],
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'Yoruba Students\' Union (YOSU) — Federal University Dutse Chapter',
    description: 'Official digital platform, constitution, press releases, leadership, and student welfare.',
    url: 'https://yosu.fud.edu.ng',
    siteName: 'YOSU FUD Official Platform',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 800,
        alt: 'YOSU Official Seal',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yoruba Students\' Union (YOSU) — Federal University Dutse',
    description: 'Official Digital Portal and Governance Platform.',
    images: ['/images/logo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Yoruba Students\' Union (YOSU), Federal University Dutse Chapter',
  alternateName: 'YOSU FUD',
  url: 'https://yosu.fud.edu.ng',
  logo: 'https://yosu.fud.edu.ng/images/logo.png',
  sameAs: [],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dutse',
    addressRegion: 'Jigawa State',
    addressCountry: 'NG',
  },
  description: 'Official Digital Platform, Student Welfare, Governance and Cultural Preservation Headquarters of YOSU FUD.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="max-w-full overflow-x-hidden scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-amber-300 selection:text-emerald-950 flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

