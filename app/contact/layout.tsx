import { Suspense } from 'react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/marketing/siteUrl';

export const metadata: Metadata = {
  title: 'Contact — BlogCreator',
  description: 'Get in touch with the BlogCreator team for support, billing, or general inquiries.',
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    title: 'Contact — BlogCreator',
    description: 'Get in touch with the BlogCreator team for support, billing, or general inquiries.',
    url: absoluteUrl('/contact'),
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
