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
  const prefix = ")]}',";
  const jsonText = trimmed.startsWith(prefix) ? trimmed.slice(prefix.length) : trimmed;
  return JSON.parse(jsonText);
}

export async function fetchGoogleAutocomplete(topic: string): Promise<string[]> {
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

export async function fetchGoogleTrendsRelated(topic: string): Promise<string[]> {
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

  const terms: string[] = [];
  for (const list of widgetData.default?.rankedList ?? []) {
    for (const item of list.rankedKeyword ?? []) {
      if (item.query?.trim()) {
        terms.push(item.query.trim());
      }
    }
  }

  return terms;
}

/** Fallback when Trends explore API is unavailable (e.g. rate limited). */
async function fetchTrendStyleSuggestions(topic: string): Promise<string[]> {
  const variants = [`${topic} 2026`, `${topic} trends`, `${topic} ideas`];
  const batches = await Promise.all(
    variants.map(variant =>
      fetchSourceSafely('google_autocomplete', () => fetchGoogleAutocomplete(variant), [])
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
    console.warn(`Keyword source "${source}" failed:`, error);
    return fallback;
  }
}

export async function collectKeywordSignals(topic: string): Promise<KeywordSignals> {
  const seed = topic.trim();
  const [googleAutocomplete, duckDuckGo, googleTrendsRaw] = await Promise.all([
    fetchSourceSafely('google_autocomplete', () => fetchGoogleAutocomplete(seed), []),
    fetchSourceSafely('duckduckgo', () => fetchDuckDuckGoSuggest(seed), []),
    fetchSourceSafely('google_trends', () => fetchGoogleTrendsRelated(seed), []),
  ]);

  const googleTrends =
    googleTrendsRaw.length > 0
      ? googleTrendsRaw
      : await fetchTrendStyleSuggestions(seed);

  return { googleAutocomplete, duckDuckGo, googleTrends };
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
      ? `Google Trends related & rising:\n${signals.googleTrends.map(term => `- ${term}`).join('\n')}`
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
