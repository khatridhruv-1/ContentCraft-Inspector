import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — BlogCreator',
  description: 'Get in touch with the BlogCreator team for support, billing, or general inquiries.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
