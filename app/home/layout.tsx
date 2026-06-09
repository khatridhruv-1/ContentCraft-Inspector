import type { Metadata } from 'next';
import HomeShell from './HomeShell';
import { AuthSessionGate } from '@/components/loading/SessionLoadingGate';

export const metadata: Metadata = {
  title: 'Home — ContentCraft Inspector',
  description: 'Pick a workflow to generate, edit, analyze, or score your content.',
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <HomeShell>
      <AuthSessionGate>{children}</AuthSessionGate>
    </HomeShell>
  );
}
