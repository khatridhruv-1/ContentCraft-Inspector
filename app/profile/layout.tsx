import type { Metadata } from 'next';
import HomeShell from '../home/HomeShell';
import { AuthSessionGate } from '@/components/loading/SessionLoadingGate';

export const metadata: Metadata = {
  title: 'Profile — BlogCreator',
  description: 'Manage your display name, account details, and session.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <HomeShell>
      <AuthSessionGate label="Loading profile">{children}</AuthSessionGate>
    </HomeShell>
  );
}
