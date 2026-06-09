import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — ContentCraft Inspector',
  description:
    'How ContentCraft Inspector collects, uses, and protects your data when you use our AI content platform.',
};

import { InitialMountLoader } from '@/components/loading/InitialMountLoader';

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <InitialMountLoader>{children}</InitialMountLoader>;
}
