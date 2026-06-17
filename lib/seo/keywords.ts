import { resolveBriefIntent, type ResolvedBrief } from '@/lib/ai/briefIntent';
import { groqChat, parseGroqJson } from '@/lib/ai/groq';
import {
  collectKeywordSignals,
  formatSignalsForPrompt,
  hasAnySignals,
  type CollectKeywordSignalsOptions,
  type KeywordSignals,
} from '@/lib/seo/keywordSources';
import type { DiscoveredKeyword } from '@/types/seo';

type ExtractedKeywords = {
  keywords?: string[];
};

const TOPIC_STOP_WORDS = new Set([
  'write',
  'create',
  'draft',
  'generate',
  'blog',
  'post',
  'article',
  'about',
  'for',
  'the',
  'and',
  'with',
  'seo',
  'friendly',
]);

const META_BLOG_KEYWORD =
  /\b(blog\s*(post\s*)?generat|generat(e|or|ing)\s+blog|blog\s+ideas?|ai\s+blog|automatic\s+(blog|content)|content\s+generation|writing\s+services?|optimized\s+content\s+writing)\b/i;

function topicTokens(searchTopic: string): string[] {
  return searchTopic
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(token => token.length > 2 && !TOPIC_STOP_WORDS.has(token));
}

function isRelevantToTopic(keyword: string, searchTopic: string): boolean {
  const tokens = topicTokens(searchTopic);
  if (tokens.length === 0) return true;

  const lower = keyword.toLowerCase();
  return tokens.some(token => lower.includes(token));
}

function filterSignalList(terms: string[], searchTopic: string): string[] {
  return terms.filter(
    term => !META_BLOG_KEYWORD.test(term) && isRelevantToTopic(term, searchTopic)
  );
}

function filterKeywordSignals(signals: KeywordSignals, searchTopic: string): KeywordSignals {
  return {
    googleAutocomplete: filterSignalList(signals.googleAutocomplete, searchTopic),
    duckDuckGo: filterSignalList(signals.duckDuckGo, searchTopic),
    googleTrends: filterSignalList(signals.googleTrends, searchTopic),
    risingTrendScores: signals.risingTrendScores,
  };
}

function filterKeywords(keywords: string[], resolved: ResolvedBrief): string[] {
  const withoutMeta = keywords.filter(keyword => !META_BLOG_KEYWORD.test(keyword));
  const onTopic = withoutMeta.filter(keyword => isRelevantToTopic(keyword, resolved.searchTopic));

  const withoutListMeta =
    resolved.articleType === 'trending_list' || resolved.articleType === 'canonical_list'
      ? onTopic.filter(keyword => !isMetaListQueryPhrase(keyword))
      : onTopic;

  if (withoutListMeta.length >= 4) return withoutListMeta.slice(0, 12);
  if (onTopic.length >= 4) return onTopic.slice(0, 12);
  if (withoutMeta.length >= 4) return withoutMeta.slice(0, 12);
  return keywords.slice(0, 12);
}

const META_LIST_QUERY_PATTERN =
  /\b(latest|trending|top|best|most|newest|new|popular|recent)\b/i;

function isMetaListQueryPhrase(keyword: string): boolean {
  const lower = keyword.toLowerCase();
  const wordCount = lower.split(/\s+/).filter(Boolean).length;
  if (wordCount < 4) return false;
  return META_LIST_QUERY_PATTERN.test(lower) && /\b(movies?|films?|songs?|shows?|bollywood|hindi)\b/i.test(lower);
}

async function extractKeywordsFromSignals(
  resolved: ResolvedBrief,
  signalText: string
): Promise<string[]> {
  const entityFocus =
    resolved.articleType === 'trending_list' || resolved.articleType === 'canonical_list'
      ? ' For list-style topics: prefer specific entity NAMES (movie titles, show names, albums, products) from the signals. Do NOT return generic SEO query strings like "latest trending hindi movies" or "best hindi movie in bollywood history".'
      : '';

  const text = await groqChat({
    messages: [
      {
        role: 'system',
        content:
          `You extract SEO keywords from search suggestion data. Return JSON only: { "keywords": ["keyword one", "keyword two"] }. Return 8-12 terms people search for about the SUBJECT TOPIC. Mix short-head and long-tail phrases. Prefer rising terms when present. No duplicates. NEVER return keywords about blog generators, AI writing tools, content automation, or generic "write a blog" phrases unless the subject topic itself is about those tools.${entityFocus}`,
      },
      {
        role: 'user',
        content: [
          `Subject topic (extract keywords about THIS): ${resolved.topic}`,
          `Search focus: ${resolved.searchTopic}`,
          resolved.rawBrief !== resolved.topic
            ? `Original user input (ignore the writing instruction — only the subject matters): ${resolved.rawBrief}`
            : '',
          resolved.topicNote ?? '',
          signalText
            ? `\nSearch signals:\n${signalText}`
            : '\nNo live search signals were returned. Infer 8-12 realistic keywords about the subject topic only.',
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ],
    temperature: 0.25,
    maxTokens: 512,
  });

  const parsed = parseGroqJson<ExtractedKeywords>(text);
  return filterKeywords(
    (parsed.keywords ?? []).map(keyword => keyword.trim()).filter(Boolean),
    resolved
  );
}

export async function discoverKeywordsForTopic(
  rawInput: string,
  options: CollectKeywordSignalsOptions = {}
): Promise<DiscoveredKeyword[]> {
  const resolved = resolveBriefIntent(rawInput.trim());
  if (!resolved.rawBrief) {
    throw new Error('Topic is required for keyword discovery.');
  }

  const rawSignals = await collectKeywordSignals(resolved.searchTopic, options);
  const signals = filterKeywordSignals(rawSignals, resolved.searchTopic);
  const signalText = hasAnySignals(signals) ? formatSignalsForPrompt(signals) : '';
  const keywords = await extractKeywordsFromSignals(resolved, signalText);

  if (!keywords.length) {
    return [
      {
        keyword: resolved.topic.slice(0, 80),
        searchVolume: null,
        competition: null,
        trendScore: 0,
      },
    ];
  }

  return keywords.map((keyword, index) => ({
    keyword,
    searchVolume: null,
    competition: null,
    trendScore: trendScoreForKeyword(keyword, index, signals.risingTrendScores),
  }));
}

function trendScoreForKeyword(
  keyword: string,
  index: number,
  risingTrendScores: Record<string, number>
): number {
  const rising = risingTrendScores[keyword.toLowerCase()];
  if (rising && rising > 0) {
    return Math.min(1, rising / 5_000);
  }
  return Math.max(0, 1 - index * 0.08);
}

export function formatKeywordsForPrompt(keywords: DiscoveredKeyword[]): string {
  return keywords.map(item => item.keyword).join(', ');
}

export function keywordDiscoveryErrorResponse(error: unknown) {
  return {
    status: 502,
    body: {
      error: error instanceof Error ? error.message : 'Keyword discovery failed',
    },
  };
}
