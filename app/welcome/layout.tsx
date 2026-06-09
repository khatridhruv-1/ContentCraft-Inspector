import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ContentCraft Inspector — AI Content Platform',
  description:
    'The all-in-one AI workspace to generate, edit, analyze, and perfect every piece of content. Create content that converts — built for speed, clarity, and creative impact.',
  openGraph: {
    title: 'ContentCraft Inspector — AI Content Platform',
    description:
      'Generate, edit, analyze, and humanize content with AI. Get started free — no credit card required.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContentCraft Inspector — AI Content Platform',
    description: 'Create content that converts with AI-powered generation, editing, and analysis.',
  },
};

import { InitialMountLoader } from '@/components/loading/InitialMountLoader';

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return <InitialMountLoader>{children}</InitialMountLoader>;
}
