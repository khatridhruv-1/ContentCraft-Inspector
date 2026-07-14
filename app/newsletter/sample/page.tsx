import { Suspense } from 'react';
import type { Metadata } from 'next';
import NewsletterSampleClient from './NewsletterSampleClient';
import { absoluteUrl } from '@/lib/marketing/siteUrl';

export const metadata: Metadata = {
  title: 'Sample Issue — BlogCreator Daily',
  description:
    'Read sample BlogCreator Daily newsletter issues — trending topics written in a clear practitioner voice.',
  alternates: { canonical: absoluteUrl('/newsletter/sample') },
  robots: { index: true, follow: true },
};

export default function NewsletterSamplePage() {
  return (
    <Suspense fallback={null}>
      <NewsletterSampleClient />
    </Suspense>
  );
}
