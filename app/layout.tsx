import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { BRAND_ASSETS } from '@/lib/brand/assets';
import { getSiteUrl } from '@/lib/marketing/siteUrl';
import RootCookieConsent from '@/components/marketing/RootCookieConsent';
import AppThemeProvider from '@/components/theme/AppThemeProvider';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'BlogCreator',
  description: 'Humanized, platform-ready content with keyword discovery and deep SEO analysis.',
  icons: {
    icon: BRAND_ASSETS.favicon,
    apple: BRAND_ASSETS.favicon,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={plusJakarta.variable} suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${plusJakarta.className} bg-background text-foreground antialiased dark:bg-slate-950`}
        suppressHydrationWarning={true}
      >
        <AppThemeProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <RootCookieConsent />
        </AppThemeProvider>
      </body>
    </html>
  );
}
