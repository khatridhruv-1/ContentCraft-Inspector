import { BRAND_ASSETS } from '@/lib/brand/assets';
import { absoluteUrl } from '@/lib/marketing/siteUrl';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function WelcomeStructuredData() {
  const siteUrl = absoluteUrl('/welcome');
  const logoUrl = absoluteUrl(BRAND_ASSETS.logoHeader);

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ContentCraft Inspector',
    url: siteUrl,
    logo: logoUrl,
    description:
      'AI content generation and SEO analysis platform with MCP tool, cross-platform agent skill, and REST API integrations for developers and content teams.',
  };

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ContentCraft Inspector',
    url: siteUrl,
    description:
      'Generate SEO-ready blog posts with automatic keyword discovery, run deep content analysis, and integrate via MCP, agent skill, or REST API.',
    publisher: {
      '@type': 'Organization',
      name: 'ContentCraft Inspector',
    },
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ContentCraft Inspector',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description:
      'AI content generator with automatic keyword discovery, readability scoring, SEO insights, outlines, content-gap analysis, and developer integrations (MCP, agent skill, REST API).',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free plan available — no credit card required',
    },
    featureList: [
      'AI blog post generation',
      'Automatic keyword discovery',
      'Deep SEO and readability analysis',
      'Content outline and gap insights',
      'Export to Word and Markdown',
      'MCP tool for Cursor and Claude Desktop',
      'Cross-platform agent skill for SEO workflows',
      'REST API for custom integrations',
      'CLI installer for one-command setup',
    ],
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={webSite} />
      <JsonLd data={softwareApp} />
    </>
  );
}
