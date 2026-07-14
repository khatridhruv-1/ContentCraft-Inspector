import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/marketing/siteUrl';

/** Primary landing URL — homepage is canonical (not /welcome). */
export const LANDING_PATH = '/';

export const LANDING_TITLE =
  'BlogCreator — Free AI Blog Generator, Content Generator & SEO Tool';

export const LANDING_DESCRIPTION =
  'Free AI blog generator and content generator. Pick a platform — website, LinkedIn, Quora, Medium, or Substack — and create format-ready drafts with keyword discovery and SEO analysis.';

export const LANDING_KEYWORDS = [
  'blog generator',
  'AI blog generator',
  'free blog generator',
  'content generator',
  'AI content generator',
  'article generator',
  'SEO content generator',
  'AI writing tool',
  'blog post generator',
  'keyword discovery tool',
  'content marketing AI',
  'readability checker',
  'content gap analysis',
  'LinkedIn post generator',
  'Medium article generator',
  'platform-based content generator',
  'MCP content generation',
  'AI content API',
] as const;

export const LANDING_OPEN_GRAPH = {
  title: LANDING_TITLE,
  description: LANDING_DESCRIPTION,
  type: 'website' as const,
  locale: 'en_US',
  siteName: 'BlogCreator',
};

const OG_IMAGE_PATH = '/opengraph-image';

export function buildLandingMetadata(): Metadata {
  const url = absoluteUrl(LANDING_PATH);
  const ogImage = absoluteUrl(OG_IMAGE_PATH);

  return {
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    keywords: [...LANDING_KEYWORDS],
    alternates: {
      canonical: LANDING_PATH,
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
      ...LANDING_OPEN_GRAPH,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: LANDING_TITLE,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: LANDING_TITLE,
      description: LANDING_DESCRIPTION,
      images: [ogImage],
    },
    verification: {
      google: 'My38ZtvxrHM9e9S9bO58PbVeREwT6asGCoeWZziYE_U',
    },
  };
}

/** Public marketing routes included in sitemap.xml */
export const PUBLIC_MARKETING_PATHS = [
  '/',
  '/help',
  '/integrate',
  '/contact',
  '/samples',
  '/pricing',
  '/newsletter/sample',
  '/privacy',
  '/terms',
  '/auth/login',
  '/auth/signup',
] as const;
