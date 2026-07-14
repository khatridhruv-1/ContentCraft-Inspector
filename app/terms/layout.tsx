import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — BlogCreator',
  description:
    'Terms and conditions for using BlogCreator, including accounts, content ownership, and acceptable use.',
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
