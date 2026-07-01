import {
  fetchScrapingHubSearch,
  isScrapingHubConfigured,
  type ScrapingHubSearchResult,
} from '@/lib/seo/scrapingHub';

export type TrendingSearchResult = ScrapingHubSearchResult;

/** Live web search results to ground "latest / trending" articles in real titles. */
export async function fetchTrendingSearchContext(
  query: string
): Promise<TrendingSearchResult[] | null> {
  if (!isScrapingHubConfigured()) return null;

  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    const results = await fetchScrapingHubSearch(trimmed, 6);
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
