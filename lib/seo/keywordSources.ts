import {
  fetchSerpGoogleAutocomplete,
  fetchSerpGoogleTrendsRelated,
  isSerpApiConfigured,
} from '@/lib/seo/serpapi';

const FETCH_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
};

const SOURCE_TIMEOUT_MS = 8_000;

export type KeywordSignalSource = 'google_autocomplete' | 'duckduckgo' | 'google_trends';

export type KeywordSignals = {
  googleAutocomplete: string[];
  duckDuckGo: string[];
  googleTrends: string[];
  /** Rising-query growth scores from Google Trends (query lowercase → %) */
  risingTrendScores: Record<string, number>;
};

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    headers: { ...FETCH_HEADERS, ...init?.headers },
    signal: AbortSignal.timeout(SOURCE_TIMEOUT_MS),
  });

  if (response.status === 429) {
    await new Promise(resolve => setTimeout(resolve, 1_500));
    return fetch(url, {
      ...init,
      headers: { ...FETCH_HEADERS, ...init?.headers },
      signal: AbortSignal.timeout(SOURCE_TIMEOUT_MS),
    });
  }

  return response;
}

function parseGoogleTrendsJson(text: string): unknown {
  const trimmed = text.trim();
  const jsonText = trimmed.replace(/^\)\]\}'?,?\s*/, '');
  return JSON.parse(jsonText);
}

async function fetchGoogleAutocompleteDirect(topic: string): Promise<string[]> {
  const url = new URL('https://suggestqueries.google.com/complete/search');
  url.searchParams.set('client', 'firefox');
  url.searchParams.set('q', topic);

  const response = await fetchWithTimeout(url.toString());
  if (!response.ok) {
    throw new Error(`Google Autocomplete failed (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[1])) {
    return [];
  }

  return data[1]
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean);
}

export async function fetchDuckDuckGoSuggest(topic: string): Promise<string[]> {
  const url = new URL('https://duckduckgo.com/ac/');
  url.searchParams.set('q', topic);

  const response = await fetchWithTimeout(url.toString());
  if (!response.ok) {
    throw new Error(`DuckDuckGo suggest failed (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as unknown;
  if (!Array.isArray(data)) {
    return [];
  }

  // `type=list` returns [query, string[]]; default returns { phrase } objects.
  if (data.length >= 2 && Array.isArray(data[1])) {
    return data[1]
      .filter((item): item is string => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean);
  }

  return data
    .map(item => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object' && 'phrase' in item) {
        const phrase = (item as { phrase?: unknown }).phrase;
        return typeof phrase === 'string' ? phrase.trim() : '';
      }
      return '';
    })
    .filter(Boolean);
}

type TrendsWidget = {
  id?: string;
  token?: string;
  request?: Record<string, unknown>;
};

type TrendsRankedKeyword = {
  query?: string;
};

async function fetchGoogleTrendsRelatedDirect(topic: string): Promise<string[]> {
  const exploreReq = {
    comparisonItem: [{ keyword: topic, geo: '', time: 'today 12-m' }],
    category: 0,
    property: '',
  };

  const exploreUrl = new URL('https://trends.google.com/trends/api/explore');
  exploreUrl.searchParams.set('hl', 'en-US');
  exploreUrl.searchParams.set('tz', '360');
  exploreUrl.searchParams.set('req', JSON.stringify(exploreReq));

  const exploreResponse = await fetchWithTimeout(exploreUrl.toString(), {
    headers: { Referer: 'https://trends.google.com/trends/explore?geo=US' },
  });
  if (!exploreResponse.ok) {
    throw new Error(`Google Trends explore failed (HTTP ${exploreResponse.status}).`);
  }

  const exploreData = parseGoogleTrendsJson(await exploreResponse.text()) as {
    widgets?: TrendsWidget[];
  };

  const relatedWidget = exploreData.widgets?.find(widget => widget.id === 'RELATED_QUERIES');
  if (!relatedWidget?.token || !relatedWidget.request) {
    return [];
  }

  const widgetUrl = new URL('https://trends.google.com/trends/api/widgetdata/relatedsearches');
  widgetUrl.searchParams.set('hl', 'en-US');
  widgetUrl.searchParams.set('tz', '360');
  widgetUrl.searchParams.set('req', JSON.stringify(relatedWidget.request));
  widgetUrl.searchParams.set('token', relatedWidget.token);

  const widgetResponse = await fetchWithTimeout(widgetUrl.toString(), {
    headers: { Referer: 'https://trends.google.com/trends/explore?geo=US' },
  });
  if (!widgetResponse.ok) {
    throw new Error(`Google Trends related queries failed (HTTP ${widgetResponse.status}).`);
  }

  const widgetData = parseGoogleTrendsJson(await widgetResponse.text()) as {
    default?: { rankedList?: { rankedKeyword?: TrendsRankedKeyword[] }[] };
  };

  const rankedList = widgetData.default?.rankedList ?? [];
  const rising = (rankedList[1]?.rankedKeyword ?? [])
    .map(item => item.query?.trim())
    .filter((query): query is string => Boolean(query));
  const top = (rankedList[0]?.rankedKeyword ?? [])
    .map(item => item.query?.trim())
    .filter((query): query is string => Boolean(query));

  const seen = new Set<string>();
  const terms: string[] = [];
  for (const query of [...rising, ...top]) {
    const key = query.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      terms.push(query);
    }
  }

  return terms;
}

async function fetchGoogleAutocomplete(topic: string): Promise<string[]> {
  if (isSerpApiConfigured()) {
    try {
      return await fetchSerpGoogleAutocomplete(topic);
    } catch (error) {
      console.warn('SerpAPI Google Autocomplete failed, using direct fallback:', error);
    }
  }
  return fetchGoogleAutocompleteDirect(topic);
}

type GoogleTrendsFetchResult = {
  terms: string[];
  risingTrendScores: Record<string, number>;
};

async function fetchGoogleTrendsRelated(topic: string): Promise<GoogleTrendsFetchResult> {
  if (isSerpApiConfigured()) {
    try {
      const result = await fetchSerpGoogleTrendsRelated(topic);
      return { terms: result.terms, risingTrendScores: result.risingScores };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`SerpAPI Google Trends unavailable: ${message}`);
      return { terms: [], risingTrendScores: {} };
    }
  }

  try {
    const terms = await fetchGoogleTrendsRelatedDirect(topic);
    return { terms, risingTrendScores: {} };
  } catch (error) {
    console.warn('Direct Google Trends unavailable:', error);
    return { terms: [], risingTrendScores: {} };
  }
}

/** Fallback when Trends is unavailable — uses free autocomplete to avoid extra SerpAPI calls. */
async function fetchTrendStyleSuggestions(topic: string): Promise<string[]> {
  const autocomplete = isSerpApiConfigured()
    ? fetchGoogleAutocompleteDirect
    : fetchGoogleAutocomplete;
  const variants = [`${topic} 2026`, `${topic} trends`, `${topic} ideas`];
  const batches = await Promise.all(
    variants.map(variant =>
      fetchSourceSafely('google_autocomplete', () => autocomplete(variant), [])
    )
  );

  const terms = new Set<string>();
  const topicLower = topic.toLowerCase();
  for (const batch of batches) {
    for (const term of batch) {
      if (term.toLowerCase() !== topicLower) {
        terms.add(term);
      }
    }
  }

  return [...terms];
}

async function fetchSourceSafely<T>(
  source: KeywordSignalSource,
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fetcher();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Keyword source "${source}" failed: ${message}`);
    return fallback;
  }
}

export type CollectKeywordSignalsOptions = {
  /** When false, skips Google Trends (saves SerpAPI quota during live preview). */
  includeTrends?: boolean;
};

export async function collectKeywordSignals(
  topic: string,
  options: CollectKeywordSignalsOptions = {}
): Promise<KeywordSignals> {
  const { includeTrends = true } = options;
  const seed = topic.trim();
  const emptyTrends = { terms: [] as string[], risingTrendScores: {} as Record<string, number> };

  const [googleAutocomplete, duckDuckGo, googleTrendsResult] = await Promise.all([
    fetchSourceSafely('google_autocomplete', () => fetchGoogleAutocomplete(seed), []),
    fetchSourceSafely('duckduckgo', () => fetchDuckDuckGoSuggest(seed), []),
    includeTrends
      ? fetchSourceSafely('google_trends', () => fetchGoogleTrendsRelated(seed), emptyTrends)
      : Promise.resolve(emptyTrends),
  ]);

  const googleTrends =
    includeTrends && googleTrendsResult.terms.length > 0
      ? googleTrendsResult.terms
      : includeTrends
        ? await fetchTrendStyleSuggestions(seed)
        : [];

  return {
    googleAutocomplete,
    duckDuckGo,
    googleTrends,
    risingTrendScores: googleTrendsResult.risingTrendScores,
  };
}

export function formatSignalsForPrompt(signals: KeywordSignals): string {
  const sections = [
    signals.googleAutocomplete.length
      ? `Google Autocomplete:\n${signals.googleAutocomplete.map(term => `- ${term}`).join('\n')}`
      : '',
    signals.duckDuckGo.length
      ? `DuckDuckGo suggestions:\n${signals.duckDuckGo.map(term => `- ${term}`).join('\n')}`
      : '',
    signals.googleTrends.length
      ? `Google Trends (rising first, then related):\n${signals.googleTrends
          .map(term => {
            const rising = signals.risingTrendScores[term.toLowerCase()];
            return rising ? `- ${term} (+${rising}% rising)` : `- ${term}`;
          })
          .join('\n')}`
      : '',
  ].filter(Boolean);

  return sections.join('\n\n');
}

export function hasAnySignals(signals: KeywordSignals): boolean {
  return (
    signals.googleAutocomplete.length > 0 ||
    signals.duckDuckGo.length > 0 ||
    signals.googleTrends.length > 0
  );
}
