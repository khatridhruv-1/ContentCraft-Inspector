'use server';

import { fetchHistory } from '@/lib/content/appwrite';
import { getUser, type AppUser } from '@/lib/user/appwrite';

const RECENT_HISTORY_LIMIT = 2;

export type BootstrapHistoryItem = {
  $id: string;
  content: string;
  mode?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SessionBootstrap = {
  user: AppUser;
  recentHistory: BootstrapHistoryItem[];
};

/** Validates session and loads user context in a single server round-trip. */
export async function bootstrapSession(
  sessionToken: string
): Promise<SessionBootstrap | null> {
  const user = await getUser(sessionToken);
  if (!user) return null;

  const history = await fetchHistory(user.$id, 1, RECENT_HISTORY_LIMIT);

  return {
    user,
    recentHistory: history.documents as BootstrapHistoryItem[],
  };
}
