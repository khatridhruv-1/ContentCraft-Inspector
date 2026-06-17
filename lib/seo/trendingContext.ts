import { fetchSerpGoogleOrganic, isSerpApiConfigured } from '@/lib/seo/serpapi';
import type { DiscoveredKeyword } from '@/types/seo';

export type TrendingSearchResult = {
  title: string;
  url: string;
  snippet: string;
};

function serpGeoForTopic(topic: string): string {
  if (/\b(bollywood|hindi|india|telugu|tamil|kollywood)\b/i.test(topic)) {
    return 'in';
  }
  return 'us';
}

/** Live Google organic results to ground "latest / trending" articles in real titles. */
export async function fetchTrendingSearchContext(
  query: string
): Promise<TrendingSearchResult[] | null> {
  if (!isSerpApiConfigured()) return null;

  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    const results = await fetchSerpGoogleOrganic(trimmed, 6, serpGeoForTopic(trimmed));
    return results.length > 0 ? results : null;
  } catch (error) {
    console.warn('Trending search context fetch failed:', error);
    return null;
  }
}

export function formatTrendingSearchContext(results: TrendingSearchResult[]): string {
  return results
    .map(
      (item, index) =>
        `${index + 1}. ${item.title}\n   Snippet: ${item.snippet || '(no snippet)'}\n   Source: ${item.url}`
    )
    .join('\n\n');
}

/** Build SEO keywords from organic titles/snippets — avoids a second keyword API round-trip. */
export function keywordsFromSearchResults(results: TrendingSearchResult[]): DiscoveredKeyword[] {
  const seen = new Set<string>();
  const keywords: DiscoveredKeyword[] = [];

  for (const result of results) {
    const candidates = [result.title, ...result.snippet.split(/[,;]/)]
      .map(value => value.trim())
      .filter(Boolean);

    for (const raw of candidates) {
      const label = raw.split(/\s*[|\-–:]\s*/)[0]?.trim() ?? '';
      if (label.length < 3 || label.length > 80) continue;
      const key = label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      keywords.push({
        keyword: label,
        searchVolume: null,
        competition: null,
        trendScore: Math.max(0, 1 - keywords.length * 0.08),
      });
      if (keywords.length >= 10) return keywords;
    }
  }

  return keywords;
}
