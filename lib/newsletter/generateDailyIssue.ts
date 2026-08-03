import {
  dailyNewsletterSubject,
} from '@/lib/newsletter/editorialBrief';
import { generateNewsletterEssay } from '@/lib/newsletter/generateNewsletterEssay';
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
  if (/^write\b/i.test(headline) || /practitioner editorial/i.test(headline)) return null;
  return headline;
}

export async function generateDailyNewsletterIssue(): Promise<DailyNewsletterIssue> {
  const { topic, keywords, fromTrends, recentTopics } = await pickDailyNewsletterTopic();

  // Dedicated letter-style path — do not use the product SEO explainer pipeline.
  const content = await generateNewsletterEssay(topic, recentTopics);

  const displayKeywords = fromTrends
    ? keywords
        .map(item => item.keyword)
        .filter(keyword => keyword.trim().toLowerCase() !== topic.trim().toLowerCase())
        .slice(0, 5)
    : [];

  const displayTopic = headlineFromContent(content) ?? dailyNewsletterSubject(topic);

  return {
    topic: displayTopic,
    content,
    keywords: displayKeywords,
    fromTrends,
  };
}
