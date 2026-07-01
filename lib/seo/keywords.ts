import { resolveBriefIntent, type ResolvedBrief } from '@/lib/ai/briefIntent';
import {
  fetchTrendingByTopic,
  fetchTrendingWords,
  isScrapingHubConfigured,
} from '@/lib/seo/scrapingHub';
import type { DiscoveredKeyword } from '@/types/seo';

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

const META_LIST_QUERY_PATTERN =
  /\b(latest|trending|top|best|most|newest|new|popular|recent)\b/i;

function isMetaListQueryPhrase(keyword: string): boolean {
  const lower = keyword.toLowerCase();
  const wordCount = lower.split(/\s+/).filter(Boolean).length;
  if (wordCount < 4) return false;
  return (
    META_LIST_QUERY_PATTERN.test(lower) &&
    /\b(movies?|films?|songs?|shows?|bollywood|hindi)\b/i.test(lower)
  );
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

function normalizeTrendScore(score: number | null, index: number): number {
  if (score === null) {
    return Math.max(0, 1 - index * 0.08);
  }
  if (score > 1) {
    return Math.min(1, score / 100);
  }
  return Math.max(0, Math.min(1, score));
}

export async function discoverKeywordsForTopic(rawInput: string): Promise<DiscoveredKeyword[]> {
  if (!isScrapingHubConfigured()) {
    throw new Error('SCRAPING_HUB_API_KEY is not set');
  }

  const resolved = resolveBriefIntent(rawInput.trim());
  if (!resolved.rawBrief) {
    throw new Error('Topic is required for keyword discovery.');
  }

  const topicTrends = await fetchTrendingByTopic(resolved.searchTopic);

  let trendingWords: Array<{ keyword: string; score: number | null }> = [];
  if (topicTrends.length < 8) {
    try {
      trendingWords = await fetchTrendingWords(resolved.searchTopic);
    } catch (error) {
      console.warn('Scraping Hub trending words fallback failed:', error);
    }
  }

  const merged = [...topicTrends, ...trendingWords];
  const seen = new Set<string>();
  const keywords: Array<{ keyword: string; score: number | null }> = [];

  for (const item of merged) {
    const key = item.keyword.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    keywords.push(item);
  }

  const filtered = filterKeywords(
    keywords.map(item => item.keyword),
    resolved
  );

  if (!filtered.length) {
    return [
      {
        keyword: resolved.topic.slice(0, 80),
        searchVolume: null,
        competition: null,
        trendScore: 0,
      },
    ];
  }

  const scoreByKeyword = new Map(
    keywords.map(item => [item.keyword.toLowerCase(), item.score] as const)
  );

  return filtered.map((keyword, index) => ({
    keyword,
    searchVolume: null,
    competition: null,
    trendScore: normalizeTrendScore(scoreByKeyword.get(keyword.toLowerCase()) ?? null, index),
  }));
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
