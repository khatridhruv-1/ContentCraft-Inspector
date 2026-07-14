import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/marketing/siteUrl';

export const metadata: Metadata = {
  title: 'Pricing — BlogCreator',
  description:
    'BlogCreator is free for everyone. See what is included today and what Pro will add when it launches.',
  alternates: { canonical: absoluteUrl('/pricing') },
  robots: { index: true, follow: true },
};

export { default } from '@/app/pricing/PricingPageClient';
