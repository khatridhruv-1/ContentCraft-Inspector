'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Redirect unauthenticated users to login, preserving the current path as returnUrl.
 */
export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      router.replace(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);
}

/**
 * Redirect already-authenticated users away from auth pages.
 */
export function useGuestGuard(redirectTo = '/home') {
  const router = useRouter();

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      router.replace(redirectTo);
    }
  }, [router, redirectTo]);
}
