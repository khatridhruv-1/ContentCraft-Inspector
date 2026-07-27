import { BRAND_ASSETS } from '@/lib/brand/assets';
import { LANDING_DESCRIPTION, LANDING_PATH, LANDING_TITLE } from '@/lib/marketing/landingSeo';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { WELCOME_FAQ_ITEMS } from '@/lib/marketing/welcomeContent';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function WelcomeStructuredData() {
  const siteUrl = absoluteUrl(LANDING_PATH);
  const logoUrl = absoluteUrl(BRAND_ASSETS.logoHeader);

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BlogCreator',
    url: siteUrl,
    logo: logoUrl,
    description: LANDING_DESCRIPTION,
  };

  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BlogCreator',
    url: siteUrl,
    description: LANDING_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: 'BlogCreator',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('/help')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    url: siteUrl,
    isPartOf: { '@type': 'WebSite', name: 'BlogCreator', url: siteUrl },
    about: [
      'humanized content',
      'content generator',
      'platform-based content generation',
      'SEO content analysis',
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BlogCreator',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Content Creation',
    operatingSystem: 'Web',
    url: siteUrl,
    description: LANDING_DESCRIPTION,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free for everyone',
    },
    featureList: [
      'Humanized content drafts',
      'Platform-based content generation',
      'Automatic keyword discovery',
      'Deep SEO and readability analysis',
      'Content outline and gap insights',
      'Export to Word and Markdown',
      'MCP tool for agents',
      'Cross-platform agent skill',
      'REST API for custom integrations',
    ],
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: WELCOME_FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={webSite} />
      <JsonLd data={webPage} />
      <JsonLd data={softwareApp} />
      <JsonLd data={faqPage} />
    </>
  );
}
