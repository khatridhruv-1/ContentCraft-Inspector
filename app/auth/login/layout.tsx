import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in — BlogCreator',
  description:
    'Sign in to your BlogCreator workspace. Pick up drafts, SEO analysis, and platform-ready content where you left off.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
