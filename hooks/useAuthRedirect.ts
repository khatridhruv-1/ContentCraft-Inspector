'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { AppUser } from '@/lib/user/appwrite';
import type { BootstrapHistoryItem } from '@/lib/user/sessionBootstrap';
import { bootstrapSessionCached } from '@/lib/user/sessionBootstrapCached';
import { clearAuthSession, getSessionToken } from '@/lib/user/session';
import { waitForMinDisplay, GUEST_GUARD_MIN_MS } from '@/lib/loading/minDisplay';

export type SessionStatus = 'checking' | 'ready' | 'redirecting';

export type AuthGuardState = {
  status: SessionStatus;
  user: AppUser | null;
  recentHistory: BootstrapHistoryItem[];
};

/**
 * Redirect unauthenticated users to login, preserving the current path as returnUrl.
 * Returns status and validated user so pages can show PageLoadingScreen while checking.
 */
export function useAuthGuard(): AuthGuardState {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<SessionStatus>('checking');
  const [user, setUser] = useState<AppUser | null>(null);
  const [recentHistory, setRecentHistory] = useState<BootstrapHistoryItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    async function checkSession() {
      setStatus('checking');
      const sessionToken = getSessionToken();
      if (!sessionToken) {
        await waitForMinDisplay(startedAt);
        if (!cancelled) {
          setUser(null);
          setRecentHistory([]);
          setStatus('redirecting');
        }
        router.replace(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        const session = await bootstrapSessionCached(sessionToken);
        if (cancelled) return;

        if (!session) {
          clearAuthSession();
          await waitForMinDisplay(startedAt);
          if (!cancelled) {
            setUser(null);
            setRecentHistory([]);
            setStatus('redirecting');
          }
          router.replace(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
          return;
        }

        await waitForMinDisplay(startedAt);
        if (!cancelled) {
          setUser(session.user);
          setRecentHistory(session.recentHistory);
          setStatus('ready');
        }
      } catch {
        if (cancelled) return;
        clearAuthSession();
        await waitForMinDisplay(startedAt);
        if (!cancelled) {
          setUser(null);
          setRecentHistory([]);
          setStatus('redirecting');
        }
        router.replace(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  return { status, user, recentHistory };
}

/**
 * Redirect already-authenticated users away from auth pages.
 * Returns status so auth forms can show AppLoader while checking.
 */
export function useGuestGuard(redirectTo = '/home'): SessionStatus {
  const router = useRouter();
  const [status, setStatus] = useState<SessionStatus>(() =>
    typeof window !== 'undefined' && getSessionToken() ? 'checking' : 'ready'
  );

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    async function checkSession() {
      setStatus('checking');
      const sessionToken = getSessionToken();
      if (!sessionToken) {
        if (!cancelled) setStatus('ready');
        return;
      }

      try {
        const session = await bootstrapSessionCached(sessionToken);
        if (cancelled) return;

        if (session) {
          await waitForMinDisplay(startedAt, GUEST_GUARD_MIN_MS);
          if (!cancelled) setStatus('redirecting');
          router.replace(redirectTo);
        } else {
          clearAuthSession();
          await waitForMinDisplay(startedAt, GUEST_GUARD_MIN_MS);
          if (!cancelled) setStatus('ready');
        }
      } catch {
        if (cancelled) return;
        clearAuthSession();
        await waitForMinDisplay(startedAt, GUEST_GUARD_MIN_MS);
        if (!cancelled) setStatus('ready');
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [router, redirectTo]);

  return status;
}
