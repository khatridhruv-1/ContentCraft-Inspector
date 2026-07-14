import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — BlogCreator',
  description:
    'How BlogCreator collects, uses, and protects your data when you use our AI content platform.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
