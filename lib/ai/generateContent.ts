import { resolveBriefIntent, type ResolvedBrief } from '@/lib/ai/briefIntent';
import { buildContentGenerationPrompt } from '@/lib/ai/contentPrompts';
import { ollamaChat } from '@/lib/ai/ollama';
import { countPlaceholderLines, stripPlaceholderLines } from '@/lib/ai/sanitizeContent';
import {
  discoverKeywordsForTopic,
  formatKeywordsForPrompt,
} from '@/lib/seo/keywords';
import {
  fetchTrendingSearchContext,
  formatTrendingSearchContext,
  keywordsFromSearchResults,
} from '@/lib/seo/trendingContext';
import type { DiscoveredKeyword } from '@/types/seo';

export type GenerateContentInput = {
  rawBrief: string;
  tone?: string;
};

export type GenerateContentResult = {
  content: string;
  keywords: DiscoveredKeyword[];
  topic: string;
};

function normalizeHtmlEntities(text: string): string {
  return text
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

type OllamaMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const OLLAMA_CALL_OPTS = { temperature: 0.35, topP: 0.85, maxTokens: 4096 } as const;

const PLACEHOLDER_RETRY_MESSAGE =
  'Your draft contained $1 placeholder lines. Rewrite the full article with complete sentences in every bullet and numbered step — no $1, $2, or any other $N placeholders.';

async function generateWithPlaceholderGuard(messages: OllamaMessage[]): Promise<string> {
  const first = await ollamaChat({ messages, ...OLLAMA_CALL_OPTS });

  if (countPlaceholderLines(first) === 0) return first;

  const retryMessages: OllamaMessage[] = [
    ...messages,
    { role: 'assistant', content: first },
    { role: 'user', content: PLACEHOLDER_RETRY_MESSAGE },
  ];

  const second = await ollamaChat({ messages: retryMessages, ...OLLAMA_CALL_OPTS });
  return stripPlaceholderLines(second);
}

/** Google Trends via SerpAPI is slow and often times out — autocomplete is enough for generation. */
const KEYWORD_OPTIONS = { includeTrends: false } as const;

/** List-style articles ground titles in live organic search. */
function usesSearchGrounding(articleType: ResolvedBrief['articleType']): boolean {
  return articleType === 'trending_list' || articleType === 'canonical_list';
}

export async function generateContentFromTopic({
  rawBrief,
  tone,
}: GenerateContentInput): Promise<GenerateContentResult> {
  const brief = resolveBriefIntent(rawBrief);

  if (usesSearchGrounding(brief.articleType)) {
    const searchResults = await fetchTrendingSearchContext(brief.searchTopic);
    const discovered =
      searchResults && searchResults.length > 0
        ? keywordsFromSearchResults(searchResults)
        : await discoverKeywordsForTopic(rawBrief, KEYWORD_OPTIONS);

    const keywordLine = formatKeywordsForPrompt(discovered);
    const searchContext = searchResults ? formatTrendingSearchContext(searchResults) : null;

    const { system, user } = buildContentGenerationPrompt({
      brief,
      keywords: keywordLine,
      tone,
      searchContext,
    });

    const content = await generateWithPlaceholderGuard([
      { role: 'system', content: system },
      { role: 'user', content: user },
    ]);

    return {
      content: normalizeHtmlEntities(content),
      keywords: discovered,
      topic: brief.topic,
    };
  }

  const discovered = await discoverKeywordsForTopic(rawBrief, KEYWORD_OPTIONS);
  const keywordLine = formatKeywordsForPrompt(discovered);

  const { system, user } = buildContentGenerationPrompt({
    brief,
    keywords: keywordLine,
    tone,
    searchContext: null,
  });

  const content = await generateWithPlaceholderGuard([
    { role: 'system', content: system },
    { role: 'user', content: user },
  ]);

  return {
    content: normalizeHtmlEntities(content),
    keywords: discovered,
    topic: brief.topic,
  };
}
