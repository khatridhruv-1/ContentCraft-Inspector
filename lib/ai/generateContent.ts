import { resolveBriefIntent, type ResolvedBrief } from '@/lib/ai/briefIntent';
import { buildContentGenerationPrompt } from '@/lib/ai/contentPrompts';
import { ollamaChat } from '@/lib/ai/ollama';
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

    const content = await ollamaChat({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.35,
      topP: 0.85,
      maxTokens: 4096,
    });

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

  const content = await ollamaChat({
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.35,
    topP: 0.85,
    maxTokens: 4096,
  });

  return {
    content: normalizeHtmlEntities(content),
    keywords: discovered,
    topic: brief.topic,
  };
}
