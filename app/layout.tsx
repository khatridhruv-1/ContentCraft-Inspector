import type { Metadata, ReactNode } from 'next';
import { Suspense } from 'react';
import './globals.css';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import { BRAND_ASSETS } from '@/lib/brand/assets';
import { getSiteUrl } from '@/lib/marketing/siteUrl';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'ContentCraft Inspector',
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
        <Suspense fallback={<PageLoadingScreen label="Loading page" />}>{children}</Suspense>
      </body>
    </html>
  );
}
