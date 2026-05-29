import type { ReactNode } from "react";
import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'ContentCraft Inspector — AI-Powered Content Intelligence',
  description: 'Generate, analyze, score, and humanize content with AI. Deep readability analysis, plagiarism detection, realness scoring, and more.',
  keywords: 'AI content generation, content analysis, plagiarism detection, readability score, content intelligence',
  openGraph: {
    title: 'ContentCraft Inspector',
    description: 'AI-powered content generation, analysis, and scoring platform.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lora:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning={true} className="grain">
        {children}
        <Toaster
          position="bottom-right"
          theme="light"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },
          }}
        />
      </body>
    </html>
  );
}
