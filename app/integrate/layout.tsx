import type { Metadata } from 'next';
import { InitialMountLoader } from '@/components/loading/InitialMountLoader';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { WELCOME_SEO_KEYWORDS } from '@/lib/marketing/welcomeContent';

const TITLE = 'Integrations — BlogCreator';
const DESCRIPTION =
  'Add BlogCreator to your AI assistant in one CLI command. MCP tools or cross-platform agent skill — no API keys required.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    ...WELCOME_SEO_KEYWORDS,
    'BlogCreator MCP',
    'agent skill',
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
    siteName: 'BlogCreator',
  },
};

export default function IntegrateLayout({ children }: { children: React.ReactNode }) {
  return <InitialMountLoader>{children}</InitialMountLoader>;
}
