'use client';

import type { ReactNode } from 'react';
import { useAuthGuard, useGuestGuard } from '@/hooks/useAuthRedirect';
import { PageLoadingScreen } from '@/components/loading/PageLoadingScreen';

type GateProps = {
  children: ReactNode;
  label?: string;
};

/** Blocks protected pages until session is validated — fullscreen GIF loader only */
export function AuthSessionGate({
  children,
  label = 'Loading your workspace',
}: GateProps) {
  const status = useAuthGuard();

  if (status !== 'ready') {
    return (
      <PageLoadingScreen
        label={status === 'redirecting' ? 'Redirecting' : label}
      />
    );
  }

  return <>{children}</>;
}

/** Blocks auth forms until guest session check completes — fullscreen GIF loader only */
export function GuestSessionGate({
  children,
  label = 'Loading sign in',
}: GateProps) {
  const status = useGuestGuard();

  if (status !== 'ready') {
    return (
      <PageLoadingScreen
        label={status === 'redirecting' ? 'Redirecting' : label}
      />
    );
  }

  return <>{children}</>;
}
