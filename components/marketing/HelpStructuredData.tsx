import { BRAND_ASSETS } from '@/lib/brand/assets';
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

export default function HelpStructuredData() {
  const helpUrl = absoluteUrl('/help');

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: helpUrl,
    mainEntity: WELCOME_FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={faqPage} />;
}
