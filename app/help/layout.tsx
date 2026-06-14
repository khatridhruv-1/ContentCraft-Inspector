import type { Metadata } from 'next';
import HelpStructuredData from '@/components/marketing/HelpStructuredData';
import { InitialMountLoader } from '@/components/loading/InitialMountLoader';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { WELCOME_SEO_KEYWORDS } from '@/lib/marketing/welcomeContent';

const TITLE = 'Help Center — ContentCraft Inspector';
const DESCRIPTION =
  'Setup guides, SEO keyword workflow, product overview, and FAQs for ContentCraft Inspector — AI content generation and deep SEO analysis.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [...WELCOME_SEO_KEYWORDS, 'ContentCraft help', 'AI content FAQ'],
  alternates: {
    canonical: '/help',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: absoluteUrl('/help'),
    siteName: 'ContentCraft Inspector',
  },
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HelpStructuredData />
      <InitialMountLoader>{children}</InitialMountLoader>
    </>
  );
}
