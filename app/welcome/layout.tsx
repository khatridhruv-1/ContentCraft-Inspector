import type { Metadata } from 'next';
import WelcomeStructuredData from '@/components/marketing/WelcomeStructuredData';
import { InitialMountLoader } from '@/components/loading/InitialMountLoader';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { WELCOME_SEO_KEYWORDS } from '@/lib/marketing/welcomeContent';

const TITLE = 'ContentCraft Inspector — AI Content Generator & SEO Analysis Tool';
const DESCRIPTION =
  'Generate SEO-ready blog posts with automatic keyword discovery, then analyze readability, structure, and content gaps in one AI workspace. Free to start — no credit card required.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [...WELCOME_SEO_KEYWORDS],
  alternates: {
    canonical: '/welcome',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    url: absoluteUrl('/welcome'),
    siteName: 'ContentCraft Inspector',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WelcomeStructuredData />
      <InitialMountLoader>{children}</InitialMountLoader>
    </>
  );
}
