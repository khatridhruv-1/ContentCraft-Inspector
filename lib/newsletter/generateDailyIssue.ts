import { generateContentFromTopic } from '@/lib/ai/generateContent';
import {
  buildDailyNewsletterBrief,
  dailyNewsletterSubject,
} from '@/lib/newsletter/editorialBrief';
import { pickDailyNewsletterTopic } from '@/lib/newsletter/pickTopic';

export type DailyNewsletterIssue = {
  topic: string;
  content: string;
  keywords: string[];
  /** False when Scraping Hub fell back to a seed topic — hide “Trending” chrome. */
  fromTrends: boolean;
};

function headlineFromContent(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  const headline = match?.[1]?.trim();
  if (!headline || headline.length < 12 || headline.length > 110) return null;
  // Reject instruction-looking titles.
  if (/^write\b/i.test(headline) || /practitioner editorial/i.test(headline)) return null;
  return headline;
}

export async function generateDailyNewsletterIssue(): Promise<DailyNewsletterIssue> {
  const { topic, keywords, fromTrends } = await pickDailyNewsletterTopic();

  const result = await generateContentFromTopic({
    rawBrief: buildDailyNewsletterBrief(topic),
    platform: 'substack',
    tone: 'editorial',
  });

  const displayKeywords = fromTrends
    ? keywords
        .map(item => item.keyword)
        .filter(keyword => keyword.trim().toLowerCase() !== topic.trim().toLowerCase())
        .slice(0, 5)
    : [];

  const displayTopic =
    headlineFromContent(result.content) ?? dailyNewsletterSubject(topic);

  return {
    topic: displayTopic,
    content: result.content,
    keywords: displayKeywords,
    fromTrends,
  };
}
