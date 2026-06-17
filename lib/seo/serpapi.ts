const SERPAPI_BASE_URL = 'https://serpapi.com/search.json';
const SERPAPI_TIMEOUT_MS = 10_000;

type SerpApiSuggestion = {
  value?: string;
};

type SerpApiTrendQuery = {
  query?: string;
  extracted_value?: number;
  value?: string;
};

type SerpApiAutocompleteResponse = {
  error?: string;
  suggestions?: SerpApiSuggestion[];
};

type SerpApiTrendsResponse = {
  error?: string;
  related_queries?: {
    rising?: SerpApiTrendQuery[];
    top?: SerpApiTrendQuery[];
  };
};

export type SerpApiTrendTerms = {
  terms: string[];
  risingScores: Record<string, number>;
};

export function isSerpApiConfigured(): boolean {
  return Boolean(process.env.SERPAPI_API_KEY?.trim());
}

function getSerpApiKey(): string {
  const apiKey = process.env.SERPAPI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('SERPAPI_API_KEY is not set');
  }
  return apiKey;
}

async function serpApiGet<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(SERPAPI_BASE_URL);
  url.searchParams.set('api_key', getSerpApiKey());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(SERPAPI_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`SerpAPI request failed (HTTP ${response.status}).`);
  }

  const data = (await response.json()) as T & { error?: string };
  if (data.error) {
    // SerpAPI returns this when a topic has no Trends data — not a hard failure.
    if (/hasn't returned any results|no results/i.test(data.error)) {
      return data;
    }
    throw new Error(data.error);
  }

  return data;
}

function dedupeTerms(terms: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const term of terms) {
    const trimmed = term.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

export async function fetchSerpGoogleAutocomplete(topic: string): Promise<string[]> {
  const data = await serpApiGet<SerpApiAutocompleteResponse>({
    engine: 'google_autocomplete',
    q: topic,
    hl: 'en',
    gl: 'us',
  });

  return dedupeTerms(
    (data.suggestions ?? [])
      .map(item => item.value?.trim() ?? '')
      .filter(Boolean)
  );
}

export async function fetchSerpGoogleTrendsRelated(topic: string): Promise<SerpApiTrendTerms> {
  const data = await serpApiGet<SerpApiTrendsResponse>({
    engine: 'google_trends',
    q: topic,
    data_type: 'RELATED_QUERIES',
    date: 'today 12-m',
    hl: 'en',
    geo: 'US',
  });

  const rising = data.related_queries?.rising ?? [];
  const top = data.related_queries?.top ?? [];
  const risingScores: Record<string, number> = {};

  for (const item of rising) {
    const query = item.query?.trim();
    if (!query) continue;
    const score = item.extracted_value ?? parseTrendPercent(item.value);
    if (score > 0) {
      risingScores[query.toLowerCase()] = score;
    }
  }

  const terms = dedupeTerms([
    ...rising.map(item => item.query?.trim() ?? ''),
    ...top.map(item => item.query?.trim() ?? ''),
  ]);

  return { terms, risingScores };
}

function parseTrendPercent(value?: string): number {
  if (!value) return 0;
  const digits = value.replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

type SerpOrganicResult = {
  title?: string;
  link?: string;
  snippet?: string;
};

type SerpOrganicResponse = {
  organic_results?: SerpOrganicResult[];
};

export async function fetchSerpGoogleOrganic(
  query: string,
  num = 5,
  geo = 'us'
): Promise<Array<{ title: string; url: string; snippet: string }>> {
  const data = await serpApiGet<SerpOrganicResponse>({
    engine: 'google',
    q: query,
    hl: 'en',
    gl: geo,
    num: String(num),
  });

  return (data.organic_results ?? [])
    .map(item => ({
      title: item.title?.trim() ?? '',
      url: item.link?.trim() ?? '',
      snippet: item.snippet?.trim() ?? '',
    }))
    .filter(item => item.title && item.url);
}
