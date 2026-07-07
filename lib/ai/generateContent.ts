import { resolveBriefIntent, type ResolvedBrief } from '@/lib/ai/briefIntent';
import { buildContentGenerationPrompt } from '@/lib/ai/contentPrompts';
import { ollamaChat, type OllamaMessage } from '@/lib/ai/ollama';
import { cleanGeneratedContent, getRegenerationReason } from '@/lib/ai/sanitizeContent';
import {
  countWords,
  maxTokensForReadingTarget,
  truncateToWordLimit,
  type ReadingTarget,
} from '@/lib/content/readingTarget';
import {
  discoverKeywordsForTopic,
  formatKeywordsForPrompt,
} from '@/lib/seo/keywords';
import { fetchTrendingSearchContext, formatTrendingSearchContext } from '@/lib/seo/trendingContext';
import type { DiscoveredKeyword } from '@/types/seo';
import { resolveGenerationPlatform } from '@/lib/content/platformFromText';
import type { ContentPlatformId } from '@/types/contentPlatform';

export type GenerateContentInput = {
  rawBrief: string;
  tone?: string;
  platform?: ContentPlatformId;
};

export type GenerateContentResult = {
  content: string;
  keywords: DiscoveredKeyword[];
  topic: string;
  platform: ContentPlatformId;
};

const OLLAMA_OPTS = { temperature: 0.35, topP: 0.85 } as const;

function normalizeHtmlEntities(text: string): string {
  return text
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

function finalizeContent(content: string, target: ReadingTarget): string {
  return truncateToWordLimit(cleanGeneratedContent(content), target.maxWords);
}

async function generateArticle(
  messages: OllamaMessage[],
  target: ReadingTarget
): Promise<string> {
  const opts = { ...OLLAMA_OPTS, maxTokens: maxTokensForReadingTarget(target) };

  let draft = await ollamaChat({ messages, ...opts });
  let reason = getRegenerationReason(draft, target);

  if (reason) {
    try {
      const retry = await ollamaChat({
        messages: [
          ...messages,
          { role: 'assistant', content: draft },
          { role: 'user', content: reason },
        ],
        ...opts,
      });
      if (countWords(retry) >= countWords(draft) * 0.75) {
        draft = retry;
      }
    } catch (error) {
      console.warn('Content regeneration retry failed; using first draft.', error);
    }
  }

  return finalizeContent(draft, target);
}

function usesSearchGrounding(articleType: ResolvedBrief['articleType']): boolean {
  return articleType === 'trending_list' || articleType === 'canonical_list';
}

export async function generateContentFromTopic({
  rawBrief,
  tone,
  platform: platformInput,
}: GenerateContentInput): Promise<GenerateContentResult> {
  const brief = resolveBriefIntent(rawBrief);
  const platform = resolveGenerationPlatform({ platform: platformInput, rawBrief });

  const needsSearch = usesSearchGrounding(brief.articleType);
  const [discovered, searchResults] = await Promise.all([
    discoverKeywordsForTopic(rawBrief),
    needsSearch ? fetchTrendingSearchContext(brief.searchTopic) : Promise.resolve(null),
  ]);

  const { system, user } = buildContentGenerationPrompt({
    brief,
    keywords: formatKeywordsForPrompt(discovered),
    tone,
    platform,
    searchContext: searchResults ? formatTrendingSearchContext(searchResults) : null,
  });

  const content = await generateArticle(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    brief.readingTarget
  );

  return {
    content: normalizeHtmlEntities(content),
    keywords: discovered,
    topic: brief.topic,
    platform,
  };
}
