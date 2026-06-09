import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — ContentCraft Inspector',
  description: 'Get in touch with the ContentCraft Inspector team for support, billing, or general inquiries.',
};

import { InitialMountLoader } from '@/components/loading/InitialMountLoader';

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <InitialMountLoader>{children}</InitialMountLoader>;
}
