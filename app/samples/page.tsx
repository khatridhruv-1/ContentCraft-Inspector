import type { Metadata } from 'next';
import SamplesPageClient from '@/app/samples/SamplesPageClient';
import { absoluteUrl } from '@/lib/marketing/siteUrl';

export const metadata: Metadata = {
  title: 'Sample Outputs — BlogCreator',
  description:
    'Read real sample blog and LinkedIn drafts generated with BlogCreator — see output quality before you sign up.',
  alternates: { canonical: absoluteUrl('/samples') },
  robots: { index: true, follow: true },
};

export default function SamplesPage() {
  return <SamplesPageClient />;
}
