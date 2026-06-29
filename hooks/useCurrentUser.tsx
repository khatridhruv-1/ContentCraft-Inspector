'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { AppUser } from '@/lib/user/appwrite';
import type { BootstrapHistoryItem } from '@/lib/user/sessionBootstrap';

type SessionContextValue = {
  user: AppUser;
  recentHistory: BootstrapHistoryItem[];
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  user,
  recentHistory,
  children,
}: {
  user: AppUser;
  recentHistory: BootstrapHistoryItem[];
  children: ReactNode;
}) {
  const value = useMemo(() => ({ user, recentHistory }), [user, recentHistory]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Authenticated user from AuthSessionGate — avoids redundant getUser server actions. */
export function useCurrentUser(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useCurrentUser must be used within SessionProvider');
  }
  return ctx;
}
