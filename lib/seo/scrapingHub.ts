const DEFAULT_BASE_URL = 'https://fire.yamlcreator.dev/api';
const API_TIMEOUT_MS = 45_000;

export type ScrapingHubSearchResult = {
  title: string;
  url: string;
  snippet: string;
};

type TrendingTopicRequest = {
  topic: string;
  country?: string;
  sources?: string[];
  limit?: number;
};

type SearchRequest = {
  query: string;
  limit?: number;
};

export function isScrapingHubConfigured(): boolean {
  return Boolean(process.env.SCRAPING_HUB_API_KEY?.trim());
}

export function countryForTopic(topic: string): string {
  if (/\b(bollywood|hindi|india|telugu|tamil|kollywood|mumbai|delhi)\b/i.test(topic)) {
    return 'IN';
  }
  if (/\b(uk|britain|london|england)\b/i.test(topic)) {
    return 'GB';
  }
  return 'US';
}

function getApiKey(): string {
  const apiKey = process.env.SCRAPING_HUB_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Missing SCRAPING_HUB_API_KEY environment variable');
  }
  return apiKey;
}

function getBaseUrl(): string {
  return process.env.SCRAPING_HUB_API_URL?.trim().replace(/\/$/, '') || DEFAULT_BASE_URL;
}

async function scrapingHubRequest<T>(
  path: string,
  init: RequestInit & { searchParams?: Record<string, string> } = {}
): Promise<T> {
  const { searchParams, ...fetchInit } = init;
  const url = new URL(`${getBaseUrl()}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await fetch(url.toString(), {
    ...fetchInit,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-Key': getApiKey(),
      ...fetchInit.headers,
    },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  const payload = (await response.json().catch(() => null)) as
    | (T & { detail?: string; error?: string })
    | null;

  if (!response.ok) {
    const message =
      payload?.detail ||
      payload?.error ||
      `Scraping Hub request failed (HTTP ${response.status}).`;
    throw new Error(message);
  }

  if (!payload) {
    throw new Error('Scraping Hub returned an empty response.');
  }

  return payload;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function extractKeywordFromItem(item: unknown): string {
  if (typeof item === 'string') return item.trim();
  const record = asRecord(item);
  if (!record) return '';

  return (
    readString(record.keyword) ||
    readString(record.word) ||
    readString(record.term) ||
    readString(record.phrase) ||
    readString(record.query) ||
    readString(record.title) ||
    readString(record.text)
  );
}

function extractScoreFromItem(item: unknown): number | null {
  const record = asRecord(item);
  if (!record) return null;

  const relevance = readString(record.relevance).toLowerCase();
  if (relevance === 'high') return 100;
  if (relevance === 'medium') return 50;
  if (relevance === 'low') return 5;

  const candidates = [record.score, record.trend_score, record.frequency, record.count];
  for (const value of candidates) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return null;
}

function collectStringsFromPayload(payload: unknown, keys: string[]): string[] {
  const record = asRecord(payload);
  if (!record) return [];

  const terms: string[] = [];
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        const term = extractKeywordFromItem(item);
        if (term) terms.push(term);
      }
    } else if (typeof value === 'string' && value.trim()) {
      terms.push(value.trim());
    }
  }

  const mergedTop = record.merged_top;
  if (Array.isArray(mergedTop)) {
    for (const item of mergedTop) {
      const term = extractKeywordFromItem(item);
      if (term) terms.push(term);
    }
  }

  return terms;
}

function collectScoredTerms(payload: unknown): Array<{ keyword: string; score: number | null }> {
  const record = asRecord(payload);
  if (!record) return [];

  const scored: Array<{ keyword: string; score: number | null }> = [];
  const arrayKeys = [
    'topic_keywords',
    'content_ideas',
    'keywords',
    'related_keywords',
    'phrases',
    'words',
    'trending_words',
    'results',
    'items',
    'trends',
    'data',
  ];

  for (const key of arrayKeys) {
    const value = record[key];
    if (!Array.isArray(value)) continue;
    for (const item of value) {
      const keyword = extractKeywordFromItem(item);
      if (!keyword) continue;
      scored.push({ keyword, score: extractScoreFromItem(item) });
    }
  }

  const mergedTop = record.merged_top;
  if (Array.isArray(mergedTop)) {
    for (const item of mergedTop) {
      const keyword = extractKeywordFromItem(item);
      if (!keyword) continue;
      scored.push({ keyword, score: extractScoreFromItem(item) });
    }
  }

  return scored;
}

function dedupeTerms(
  terms: Array<{ keyword: string; score: number | null }>
): Array<{ keyword: string; score: number | null }> {
  const seen = new Set<string>();
  const result: Array<{ keyword: string; score: number | null }> = [];

  for (const term of terms) {
    const key = term.keyword.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(term);
  }

  return result;
}

/** Trending content and related keywords for a topic — POST /trending/topic */
export async function fetchTrendingByTopic(
  topic: string,
  options: { country?: string; limit?: number } = {}
): Promise<Array<{ keyword: string; score: number | null }>> {
  const body: TrendingTopicRequest = {
    topic: topic.trim(),
    country: options.country ?? countryForTopic(topic),
    sources: ['google_trends', 'web_search'],
    limit: options.limit ?? 20,
  };

  const payload = await scrapingHubRequest<unknown>('/trending/topic', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return dedupeTerms(collectScoredTerms(payload));
}

/** Trending words filtered by topic — GET /trending/words */
export async function fetchTrendingWords(
  topic: string,
  options: { country?: string; top?: number } = {}
): Promise<Array<{ keyword: string; score: number | null }>> {
  const payload = await scrapingHubRequest<unknown>('/trending/words', {
    method: 'GET',
    searchParams: {
      country: options.country ?? countryForTopic(topic),
      topic: topic.trim(),
      top: String(options.top ?? 20),
    },
  });

  const terms = collectScoredTerms(payload);
  if (terms.length > 0) {
    return dedupeTerms(terms);
  }

  return dedupeTerms(
    collectStringsFromPayload(payload, ['words', 'trending_words', 'results', 'items']).map(
      keyword => ({ keyword, score: null })
    )
  );
}

function mapSearchRows(batch: unknown): ScrapingHubSearchResult[] {
  if (!Array.isArray(batch)) return [];

  const results: ScrapingHubSearchResult[] = [];
  for (const item of batch) {
    const row = asRecord(item);
    if (!row) continue;
    const title = readString(row.title) || readString(row.name);
    const url = readString(row.url) || readString(row.link);
    const snippet =
      readString(row.description) ||
      readString(row.snippet) ||
      readString(row.summary) ||
      readString(row.content);
    if (title && url) {
      results.push({ title, url, snippet });
    }
  }

  return results;
}

async function fetchTrendingTopicSearchResults(
  query: string,
  limit: number
): Promise<ScrapingHubSearchResult[]> {
  const body: TrendingTopicRequest = {
    topic: query.trim(),
    country: countryForTopic(query),
    sources: ['google_trends', 'web_search'],
    limit,
  };

  const payload = await scrapingHubRequest<unknown>('/trending/topic', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const record = asRecord(payload);
  return mapSearchRows(record?.results).slice(0, limit);
}

/** Web search by keyword — POST /search */
export async function fetchScrapingHubSearch(
  query: string,
  limit = 6
): Promise<ScrapingHubSearchResult[]> {
  const body: SearchRequest = {
    query: query.trim(),
    limit,
  };

  const payload = await scrapingHubRequest<unknown>('/search', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const record = asRecord(payload);
  const candidates = [
    record?.results,
    record?.data,
    record?.items,
    Array.isArray(payload) ? payload : null,
  ];

  const results: ScrapingHubSearchResult[] = [];
  for (const batch of candidates) {
    results.push(...mapSearchRows(batch));
  }

  if (results.length > 0) {
    return results.slice(0, limit);
  }

  return fetchTrendingTopicSearchResults(query, limit);
}

export function scrapingHubErrorResponse(error: unknown) {
  return {
    status: 502,
    body: {
      error: error instanceof Error ? error.message : 'Scraping Hub request failed',
    },
  };
}
