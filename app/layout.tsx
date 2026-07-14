import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import './globals.css';
import { BRAND_ASSETS } from '@/lib/brand/assets';
import { getSiteUrl } from '@/lib/marketing/siteUrl';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'BlogCreator',
  description: 'AI content generation and deep analysis in one workspace.',
  icons: {
    icon: BRAND_ASSETS.favicon,
    apple: BRAND_ASSETS.favicon,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100" suppressHydrationWarning={true}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
