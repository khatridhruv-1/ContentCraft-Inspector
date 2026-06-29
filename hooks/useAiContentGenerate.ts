'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveContent, updateContent } from '@/lib/content/appwrite';
import { clearAuthSession } from '@/lib/user/session';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { DiscoveredKeyword } from '@/types/seo';
import type { ContentPlatformId } from '@/types/contentPlatform';

type GenerateOptions = {
  tone?: string;
  platform?: ContentPlatformId;
};

type GenerateResult = {
  content: string;
  keywords?: DiscoveredKeyword[];
};

export function useAiContentGenerate() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (brief: string, options: GenerateOptions = {}): Promise<GenerateResult> => {
      const title = brief.trim();
      if (!title) {
        throw new Error('Brief is required');
      }

      setError(null);
      setLoading(true);

      try {
        const requestData: Record<string, string> = {
          title,
        };
        if (options.tone) requestData.tone = options.tone;
        if (options.platform) requestData.platform = options.platform;

        const response = await fetch('/api/ai-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          const retryAfter = payload?.retryAfterSeconds;
          const apiError = payload?.error || 'Failed to generate content.';

          if (response.status === 429) {
            throw new Error(
              retryAfter
                ? `${apiError} Retry after ${retryAfter}s.`
                : `${apiError} Please try again in a minute.`
            );
          }
          throw new Error(apiError);
        }

        const payload = (await response.json().catch(() => ({}))) as {
          content?: unknown;
          keywords?: DiscoveredKeyword[];
        };

        const safeContent =
          typeof payload.content === 'string' ? payload.content : String(payload.content ?? '');

        if (!safeContent.trim()) {
          throw new Error('AI response was empty. Please try again.');
        }

        const discoveredKeywords = Array.isArray(payload.keywords) ? payload.keywords : undefined;

        const documentId = localStorage.getItem('documentId');
        if (documentId) {
          await updateContent(documentId, {
            input: title,
            analysis: safeContent,
          });
        } else {
          const sessionToken = localStorage.getItem('sessionToken');
          if (!sessionToken) {
            router.push('/auth/login');
            throw new Error('No session found');
          }
          if (!user?.$id) {
            clearAuthSession();
            router.push('/auth/login');
            throw new Error('Session expired');
          }

          const res = await saveContent(title, user.$id, safeContent, 'ai-generate');
          localStorage.setItem('documentId', res.$id);
        }

        return { content: safeContent, keywords: discoveredKeywords };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to generate content.';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router, user]
  );

  const clearError = useCallback(() => setError(null), []);

  return { generate, loading, error, clearError };
}
