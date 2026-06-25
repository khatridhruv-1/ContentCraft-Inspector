import type { Metadata } from 'next';
import { InitialMountLoader } from '@/components/loading/InitialMountLoader';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { WELCOME_SEO_KEYWORDS } from '@/lib/marketing/welcomeContent';

const TITLE = 'Integrations — ContentCraft Inspector';
const DESCRIPTION =
  'Add ContentCraft content generation to Cursor, Claude Desktop, or any project via CLI. Install the MCP tool or Cursor skill in one command.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    ...WELCOME_SEO_KEYWORDS,
    'ContentCraft MCP',
    'Cursor skill',
    'AI content API',
    'CLI integration',
  ],
  alternates: {
    canonical: '/integrate',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: absoluteUrl('/integrate'),
    siteName: 'ContentCraft Inspector',
  },
};

export default function IntegrateLayout({ children }: { children: React.ReactNode }) {
  return <InitialMountLoader>{children}</InitialMountLoader>;
}
