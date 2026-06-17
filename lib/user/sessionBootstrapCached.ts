'use client';

import {
  bootstrapSession,
  type SessionBootstrap,
} from '@/lib/user/sessionBootstrap';

let cache: { token: string; session: SessionBootstrap | null } | null = null;
let inflight: Promise<SessionBootstrap | null> | null = null;
let inflightToken: string | null = null;

/** Deduplicates concurrent bootstrapSession server-action calls. */
export async function bootstrapSessionCached(
  sessionToken: string
): Promise<SessionBootstrap | null> {
  if (cache?.token === sessionToken) {
    return cache.session;
  }

  if (inflight && inflightToken === sessionToken) {
    return inflight;
  }

  inflightToken = sessionToken;
  inflight = bootstrapSession(sessionToken)
    .then(session => {
      cache = { token: sessionToken, session };
      return session;
    })
    .finally(() => {
      inflight = null;
      inflightToken = null;
    });

  return inflight;
}

export function clearSessionBootstrapCache() {
  cache = null;
  inflight = null;
  inflightToken = null;
}
