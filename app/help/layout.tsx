import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center — ContentCraft Inspector',
  description:
    'Getting started guides and answers about AI content generation, SEO analysis, pricing, privacy, and more.',
};

import { InitialMountLoader } from '@/components/loading/InitialMountLoader';

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <InitialMountLoader>{children}</InitialMountLoader>;
}
