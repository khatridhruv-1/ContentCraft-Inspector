'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AppUser } from '@/lib/user/appwrite';
import type { BootstrapHistoryItem } from '@/lib/user/sessionBootstrap';

type SessionContextValue = {
  user: AppUser;
  recentHistory: BootstrapHistoryItem[];
  updateUser: (patch: Partial<Pick<AppUser, 'name' | 'email'>>) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  user: initialUser,
  recentHistory,
  children,
}: {
  user: AppUser;
  recentHistory: BootstrapHistoryItem[];
  children: ReactNode;
}) {
  const [user, setUser] = useState(initialUser);

  const updateUser = useCallback((patch: Partial<Pick<AppUser, 'name' | 'email'>>) => {
    setUser(prev => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(
    () => ({ user, recentHistory, updateUser }),
    [user, recentHistory, updateUser]
  );

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
