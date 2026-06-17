'use client';

import { clearSessionBootstrapCache } from '@/lib/user/sessionBootstrapCached';

export const SESSION_TOKEN_KEY = 'sessionToken';

/** Remove client-side auth artifacts after logout or expired session */
export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  clearSessionBootstrapCache();
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem('documentId');
  localStorage.removeItem('dashboardState');
}

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_TOKEN_KEY);
}
