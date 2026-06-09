'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUser } from '@/lib/user/appwrite';
import { clearAuthSession, getSessionToken } from '@/lib/user/session';
import { waitForMinDisplay } from '@/lib/loading/minDisplay';

export type SessionStatus = 'checking' | 'ready' | 'redirecting';

/**
 * Redirect unauthenticated users to login, preserving the current path as returnUrl.
 * Returns status so pages can show PageLoadingScreen while checking.
 */
export function useAuthGuard(): SessionStatus {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<SessionStatus>('checking');

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    async function checkSession() {
      setStatus('checking');
      const sessionToken = getSessionToken();
      if (!sessionToken) {
        await waitForMinDisplay(startedAt);
        if (!cancelled) setStatus('redirecting');
        router.replace(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        const user = await getUser(sessionToken);
        if (cancelled) return;

        if (!user) {
          clearAuthSession();
          await waitForMinDisplay(startedAt);
          if (!cancelled) setStatus('redirecting');
          router.replace(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
          return;
        }

        await waitForMinDisplay(startedAt);
        if (!cancelled) setStatus('ready');
      } catch {
        if (cancelled) return;
        clearAuthSession();
        await waitForMinDisplay(startedAt);
        if (!cancelled) setStatus('redirecting');
        router.replace(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  return status;
}

/**
 * Redirect already-authenticated users away from auth pages.
 * Returns status so auth forms can show AppLoader while checking.
 */
export function useGuestGuard(redirectTo = '/home'): SessionStatus {
  const router = useRouter();
  const [status, setStatus] = useState<SessionStatus>('checking');

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    async function checkSession() {
      setStatus('checking');
      const sessionToken = getSessionToken();
      if (!sessionToken) {
        await waitForMinDisplay(startedAt);
        if (!cancelled) setStatus('ready');
        return;
      }

      try {
        const user = await getUser(sessionToken);
        if (cancelled) return;

        if (user) {
          await waitForMinDisplay(startedAt);
          if (!cancelled) setStatus('redirecting');
          router.replace(redirectTo);
        } else {
          clearAuthSession();
          await waitForMinDisplay(startedAt);
          if (!cancelled) setStatus('ready');
        }
      } catch {
        if (cancelled) return;
        clearAuthSession();
        await waitForMinDisplay(startedAt);
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
