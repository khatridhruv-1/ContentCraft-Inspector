import { resolveBriefIntent, type ResolvedBrief } from '@/lib/ai/briefIntent';
import { buildContentGenerationPrompt } from '@/lib/ai/contentPrompts';
import { ollamaChat, type OllamaMessage } from '@/lib/ai/ollama';
import { countPlaceholderLines, stripPlaceholderLines } from '@/lib/ai/sanitizeContent';
import {
  countWords,
  maxTokensForReadingTarget,
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

function normalizeHtmlEntities(text: string): string {
  return text
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

const OLLAMA_BASE_OPTS = { temperature: 0.35, topP: 0.85 } as const;

const PLACEHOLDER_RETRY_MESSAGE =
  'Your draft contained $1 placeholder lines. Rewrite the full article with complete sentences in every bullet and numbered step — no $1, $2, or any other $N placeholders.';

function ollamaOptsForTarget(target: ReadingTarget) {
  return {
    ...OLLAMA_BASE_OPTS,
    maxTokens: maxTokensForReadingTarget(target),
  };
}

function lengthRetryMessage(wordCount: number, target: ReadingTarget): string {
  return [
    `Your draft is ${wordCount} words but must be ${target.minWords}–${target.maxWords} words (${target.label}).`,
    `Shorten it now: remove repetition, tighten paragraphs, and keep only the strongest points.`,
    `Do not exceed ${target.maxWords} words. Keep the same structure, platform formatting, and key facts.`,
  ].join(' ');
}

async function ollamaChatForTarget(
  messages: OllamaMessage[],
  target: ReadingTarget
): Promise<string> {
  return ollamaChat({ messages, ...ollamaOptsForTarget(target) });
}

async function generateWithPlaceholderGuard(
  messages: OllamaMessage[],
  target: ReadingTarget
): Promise<string> {
  const first = await ollamaChatForTarget(messages, target);

  if (countPlaceholderLines(first) === 0) return first;

  const retryMessages: OllamaMessage[] = [
    ...messages,
    { role: 'assistant', content: first },
    { role: 'user', content: PLACEHOLDER_RETRY_MESSAGE },
  ];

  const second = await ollamaChatForTarget(retryMessages, target);
  return stripPlaceholderLines(second);
}

async function generateWithLengthGuard(
  messages: OllamaMessage[],
  target: ReadingTarget
): Promise<string> {
  let content = await generateWithPlaceholderGuard(messages, target);
  let wordCount = countWords(content);

  if (wordCount <= target.maxWords) {
    return content;
  }

  const retryMessages: OllamaMessage[] = [
    ...messages,
    { role: 'assistant', content },
    { role: 'user', content: lengthRetryMessage(wordCount, target) },
  ];

  content = await generateWithPlaceholderGuard(retryMessages, target);
  wordCount = countWords(content);

  if (wordCount <= target.maxWords) {
    return content;
  }

  console.warn(
    `Generated content still exceeds target after retry (${wordCount}/${target.maxWords} words).`
  );
  return content;
}

/** List-style articles ground titles in live organic search. */
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

  if (usesSearchGrounding(brief.articleType)) {
    const [searchResults, discovered] = await Promise.all([
      fetchTrendingSearchContext(brief.searchTopic),
      discoverKeywordsForTopic(rawBrief),
    ]);

    const keywordLine = formatKeywordsForPrompt(discovered);
    const searchContext = searchResults ? formatTrendingSearchContext(searchResults) : null;

    const { system, user } = buildContentGenerationPrompt({
      brief,
      keywords: keywordLine,
      tone,
      platform,
      searchContext,
    });

    const content = await generateWithLengthGuard(
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

  const discovered = await discoverKeywordsForTopic(rawBrief);
  const keywordLine = formatKeywordsForPrompt(discovered);

  const { system, user } = buildContentGenerationPrompt({
    brief,
    keywords: keywordLine,
    tone,
    platform,
    searchContext: null,
  });

  const content = await generateWithLengthGuard(
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
