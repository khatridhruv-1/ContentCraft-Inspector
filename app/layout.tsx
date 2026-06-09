import type { ReactNode } from 'react';
import { Suspense } from 'react';
import './globals.css';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <title>ContentCraft-Inspector</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100" suppressHydrationWarning={true}>
        <Suspense fallback={<PageLoadingScreen label="Loading page" />}>{children}</Suspense>
      </body>
    </html>
  );
}
