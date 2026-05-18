import type { Metadata } from 'next';
import type { ReactNode } from "react";
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ContentCraft-Inspector',
    template: '%s',
  },
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
