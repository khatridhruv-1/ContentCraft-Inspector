import { groqChat, parseGroqJson } from '@/lib/ai/groq';
import {
  collectKeywordSignals,
  formatSignalsForPrompt,
  hasAnySignals,
} from '@/lib/seo/keywordSources';
import type { DiscoveredKeyword } from '@/types/seo';

type ExtractedKeywords = {
  keywords?: string[];
};

export function isKeywordDiscoveryConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

async function extractKeywordsFromSignals(topic: string, signalText: string): Promise<string[]> {
  const text = await groqChat({
    messages: [
      {
        role: 'system',
        content:
          'You extract SEO keywords from search suggestion data (Google Autocomplete, DuckDuckGo, Google Trends). Return JSON only: { "keywords": ["keyword one", "keyword two"] }. Return 8-12 terms people actually search for. Mix short-head and long-tail phrases. Prefer rising/trending terms when present. No duplicates.',
      },
      {
        role: 'user',
        content: signalText
          ? `Topic: ${topic}\n\nSearch signals:\n${signalText}`
          : `Topic: ${topic}\n\nNo live search signals were returned. Infer 8-12 realistic SEO keywords for this topic.`,
      },
    ],
    temperature: 0.3,
    maxTokens: 512,
  });

  const parsed = parseGroqJson<ExtractedKeywords>(text);
  return (parsed.keywords ?? [])
    .map(keyword => keyword.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export async function discoverKeywordsForTopic(topic: string): Promise<DiscoveredKeyword[]> {
  const seed = topic.trim();
  if (!seed) {
    throw new Error('Topic is required for keyword discovery.');
  }

  const signals = await collectKeywordSignals(seed);
  const signalText = hasAnySignals(signals) ? formatSignalsForPrompt(signals) : '';
  const keywords = await extractKeywordsFromSignals(seed, signalText);

  if (!keywords.length) {
    return [{ keyword: seed.slice(0, 80), searchVolume: null, competition: null, trendScore: 0 }];
  }

  return keywords.map((keyword, index) => ({
    keyword,
    searchVolume: null,
    competition: null,
    trendScore: Math.max(0, 1 - index * 0.08),
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
