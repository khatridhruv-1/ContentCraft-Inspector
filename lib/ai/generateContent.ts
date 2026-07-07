import { resolveBriefIntent, type ResolvedBrief } from '@/lib/ai/briefIntent';
import { buildContentGenerationPrompt } from '@/lib/ai/contentPrompts';
import { ollamaChat, type OllamaMessage } from '@/lib/ai/ollama';
import { countPlaceholderLines, extractPublishableContent, humanizePunctuation, isMetaLeak, stripPlaceholderLines } from '@/lib/ai/sanitizeContent';
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

function normalizeHtmlEntities(text: string): string {
  return text
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

const OLLAMA_BASE_OPTS = { temperature: 0.28, topP: 0.8 } as const;

const PLACEHOLDER_RETRY_MESSAGE =
  'Your draft contained $1 placeholder lines. Rewrite the full article with complete sentences in every bullet and numbered step — no $1, $2, or any other $N placeholders.';

const META_RETRY_MESSAGE =
  'You returned planning notes instead of the article. Rewrite now and output ONLY the finished publish-ready piece. Start with the title or opening line. No "We need to...", no word-count math, no meta commentary, no quoted script lines, no "(sentence 1)" labels.';

function tooShortRetryMessage(wordCount: number, target: ReadingTarget): string {
  return [
    `Your draft is only ${wordCount} words but must be ${target.minWords}–${target.maxWords} words (${target.label}).`,
    'Write the full finished article now. Start with the title or hook. No planning notes.',
    `Target ${target.minWords}–${target.maxWords} words. Short paragraphs. No em-dashes (—).`,
  ].join(' ');
}

function ollamaOptsForTarget(target: ReadingTarget) {
  return {
    ...OLLAMA_BASE_OPTS,
    maxTokens: maxTokensForReadingTarget(target),
  };
}

function lengthRetryMessage(wordCount: number, target: ReadingTarget): string {
  return [
    `Your draft is ${wordCount} words but must be ${target.minWords}–${target.maxWords} words (${target.label}).`,
    `Rewrite shorter: fewer sections, shorter paragraphs, 1–2 sentences per point.`,
    `Hard max ${target.maxWords} words. Remove filler and repetition. No em-dashes (—).`,
  ].join(' ');
}

function finalizeGeneratedContent(content: string, target: ReadingTarget): string {
  const publishable = extractPublishableContent(content);
  const humanized = humanizePunctuation(publishable);
  const trimmed = truncateToWordLimit(humanized, target.maxWords);
  if (isMetaLeak(trimmed)) {
    const salvaged = extractPublishableContent(trimmed);
    return truncateToWordLimit(humanizePunctuation(salvaged), target.maxWords);
  }
  return trimmed;
}

function looksTruncated(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;
  return !/[.!?]["']?$/.test(trimmed) && !/^#\w+/.test(trimmed.split('\n').pop()?.trim() ?? '');
}

async function generateWithMetaLeakGuard(
  messages: OllamaMessage[],
  target: ReadingTarget
): Promise<string> {
  let content: string;
  try {
    content = await generateWithPlaceholderGuard(messages, target);
  } catch (error) {
    throw error;
  }

  if (!isMetaLeak(content)) {
    return finalizeGeneratedContent(content, target);
  }

  const retryMessages: OllamaMessage[] = [
    ...messages,
    { role: 'assistant', content },
    { role: 'user', content: META_RETRY_MESSAGE },
  ];

  try {
    const retry = await generateWithPlaceholderGuard(retryMessages, target);
    if (!isMetaLeak(retry)) {
      return finalizeGeneratedContent(retry, target);
    }

    console.warn('Generated content still contains planning/meta text after retry; extracting publishable block.');
    const extracted = finalizeGeneratedContent(retry, target);
    if (extracted.trim()) return extracted;
  } catch (retryError) {
    console.warn('Meta-leak retry failed; extracting publishable block from first draft.', retryError);
  }

  const fallback = finalizeGeneratedContent(content, target);
  if (fallback.trim()) return fallback;

  return content;
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
  let content = await generateWithMetaLeakGuard(messages, target);
  let wordCount = countWords(content);

  for (let attempt = 0; attempt < 2 && wordCount > target.maxWords; attempt += 1) {
    const retryMessages: OllamaMessage[] = [
      ...messages,
      { role: 'assistant', content },
      { role: 'user', content: lengthRetryMessage(wordCount, target) },
    ];

    content = await generateWithMetaLeakGuard(retryMessages, target);
    wordCount = countWords(content);
  }

  if (wordCount > target.maxWords) {
    console.warn(
      `Generated content exceeded target after retries (${wordCount}/${target.maxWords} words); truncating.`
    );
  }

  content = finalizeGeneratedContent(content, target);
  wordCount = countWords(content);

  for (let attempt = 0; attempt < 2 && wordCount < target.minWords; attempt += 1) {
    const truncated = looksTruncated(content);
    if (!truncated && wordCount >= Math.floor(target.minWords * 0.85)) break;

    const retryMessages: OllamaMessage[] = [
      ...messages,
      { role: 'assistant', content },
      { role: 'user', content: tooShortRetryMessage(wordCount, target) },
    ];
    try {
      const retry = await generateWithMetaLeakGuard(retryMessages, target);
      const finalized = finalizeGeneratedContent(retry, target);
      const retryWords = countWords(finalized);
      if (retryWords > wordCount) {
        content = finalized;
        wordCount = retryWords;
      }
    } catch (retryError) {
      console.warn('Too-short retry failed; returning best available draft.', retryError);
      break;
    }
  }

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
