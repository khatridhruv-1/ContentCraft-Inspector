import type { Metadata } from 'next';
import { AuthSessionGate } from '@/components/loading/SessionLoadingGate';

export const metadata: Metadata = {
  title: 'History — ContentCraft Inspector',
  description: 'View and resume your saved content drafts.',
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionGate label="Loading history">
      {children}
    </AuthSessionGate>
  );
}
