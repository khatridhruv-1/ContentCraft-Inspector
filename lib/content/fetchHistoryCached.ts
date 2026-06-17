'use client';

import { fetchHistory } from '@/lib/content/appwrite';

type HistoryResult = Awaited<ReturnType<typeof fetchHistory>>;

const inflight = new Map<string, Promise<HistoryResult>>();

function cacheKey(userId: string, page: number, limit: number) {
  return `${userId}:${page}:${limit}`;
}

/** Deduplicates concurrent fetchHistory server-action calls (e.g. React Strict Mode). */
export async function fetchHistoryCached(
  userId: string,
  page: number,
  limit: number
): Promise<HistoryResult> {
  const key = cacheKey(userId, page, limit);
  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = fetchHistory(userId, page, limit).finally(() => {
    inflight.delete(key);
  });
  inflight.set(key, promise);
  return promise;
}
