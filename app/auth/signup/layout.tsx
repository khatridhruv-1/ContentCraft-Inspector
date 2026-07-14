import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up — BlogCreator',
  description:
    'Create your free BlogCreator account. Generate platform-ready drafts with keyword discovery and SEO analysis — no credit card required.',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
