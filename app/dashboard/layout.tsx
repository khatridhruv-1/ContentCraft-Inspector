import type { Metadata } from 'next';
import { AuthSessionGate } from '@/components/loading/SessionLoadingGate';

export const metadata: Metadata = {
  title: 'Dashboard — ContentCraft Inspector',
  description: 'Create, analyze, and score your content.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionGate label="Loading dashboard">
      {children}
    </AuthSessionGate>
  );
}
