import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — BlogCreator',
  description:
    'How BlogCreator collects, uses, and protects your data when you use our content workspace.',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
