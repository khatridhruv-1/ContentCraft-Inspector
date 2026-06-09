import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — ContentCraft Inspector',
  description:
    'Terms and conditions for using ContentCraft Inspector, including accounts, content ownership, and acceptable use.',
};

import { InitialMountLoader } from '@/components/loading/InitialMountLoader';

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <InitialMountLoader>{children}</InitialMountLoader>;
}
