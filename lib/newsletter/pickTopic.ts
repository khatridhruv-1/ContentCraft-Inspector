import { discoverKeywordsForTopic } from '@/lib/seo/keywords';
import { getRecentIssueTopics } from '@/lib/newsletter/subscribers';
import type { DiscoveredKeyword } from '@/types/seo';

const TREND_SEEDS = [
  'why polished founder posts stop converting B2B buyers',
  'turning support tickets into publishable creator stories',
  'keyword clusters vs stuffing for practitioner SEO pages',
  'LinkedIn essays that read human after AI drafting',
  'newsletter subject lines that survive the morning skim',
  'when GEO and SEO need different source pages',
  'pricing a niche newsletter without sounding desperate',
] as const;

function daySeedIndex(): number {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86_400_000);
  return dayOfYear % TREND_SEEDS.length;
}

function pickBestKeyword(
  keywords: DiscoveredKeyword[],
  recentTopics: Set<string>
): DiscoveredKeyword | null {
  const sorted = [...keywords].sort((a, b) => (b.trendScore ?? 0) - (a.trendScore ?? 0));

  for (const item of sorted) {
    const key = item.keyword.toLowerCase();
    if (!recentTopics.has(key)) return item;
  }

  return sorted[0] ?? null;
}

function isSeedOnlyKeywords(seed: string, keywords: DiscoveredKeyword[]): boolean {
  if (keywords.length === 0) return true;
  if (keywords.length > 1) return false;
  return keywords[0]?.keyword.trim().toLowerCase() === seed.trim().toLowerCase();
}

export async function pickDailyNewsletterTopic(): Promise<{
  topic: string;
  keywords: DiscoveredKeyword[];
  fromTrends: boolean;
  recentTopics: string[];
}> {
  const recentList = await getRecentIssueTopics();
  const recentTopics = new Set(recentList);
  const seed = TREND_SEEDS[daySeedIndex()];

  try {
    const keywords = await discoverKeywordsForTopic(seed);
    if (isSeedOnlyKeywords(seed, keywords)) {
      return { topic: seed, keywords, fromTrends: false, recentTopics: recentList };
    }

    const best = pickBestKeyword(keywords, recentTopics);
    const topic = best?.keyword ?? seed;
    return { topic, keywords, fromTrends: true, recentTopics: recentList };
  } catch (error) {
    console.warn(
      '[daily-newsletter] Keyword discovery failed; using seed topic fallback:',
      error instanceof Error ? error.message : error
    );
    return {
      topic: seed,
      keywords: [
        {
          keyword: seed,
          searchVolume: null,
          competition: null,
          trendScore: 0.5,
        },
      ],
      fromTrends: false,
      recentTopics: recentList,
    };
  }
}
