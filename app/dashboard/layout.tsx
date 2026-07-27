import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthSessionGate } from '@/components/loading/SessionLoadingGate';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';

export const metadata: Metadata = {
  title: 'Dashboard — BlogCreator',
  description: 'Draft humanized content and run deep analysis in your workspace.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionGate label="Loading dashboard">
      <Suspense fallback={<PageLoadingScreen label="Loading dashboard" />}>{children}</Suspense>
    </AuthSessionGate>
  );
}
