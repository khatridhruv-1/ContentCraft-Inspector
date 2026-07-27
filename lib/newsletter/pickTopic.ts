import { discoverKeywordsForTopic } from '@/lib/seo/keywords';
import { getRecentIssueTopics } from '@/lib/newsletter/subscribers';
import type { DiscoveredKeyword } from '@/types/seo';

const TREND_SEEDS = [
  'content marketing and SEO trends',
  'Humanized writing and creator economy trends',
  'search engine optimization trends',
  'digital marketing and growth trends',
  'social media content trends',
  'B2B marketing and thought leadership trends',
  'newsletter and creator monetization trends',
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

export async function pickDailyNewsletterTopic(): Promise<{
  topic: string;
  keywords: DiscoveredKeyword[];
}> {
  const recentTopics = new Set(await getRecentIssueTopics());
  const seed = TREND_SEEDS[daySeedIndex()];

  const keywords = await discoverKeywordsForTopic(seed);
  const best = pickBestKeyword(keywords, recentTopics);

  const topic = best?.keyword ?? seed;
  return { topic, keywords };
}
