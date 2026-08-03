import { generateContentFromTopic } from '@/lib/ai/generateContent';
import { pickDailyNewsletterTopic } from '@/lib/newsletter/pickTopic';

export type DailyNewsletterIssue = {
  topic: string;
  content: string;
  keywords: string[];
  /** False when Scraping Hub fell back to a seed topic — hide “Trending” chrome. */
  fromTrends: boolean;
};

export async function generateDailyNewsletterIssue(): Promise<DailyNewsletterIssue> {
  const { topic, keywords, fromTrends } = await pickDailyNewsletterTopic();

  // Pin length via reading-time parse (~400–600 words) and dial an editorial brief.
  const rawBrief = [
    `Write a 2-3 minute read newsletter essay on: ${topic}.`,
    'Practitioner editorial voice: opinionated, concrete, human — not corporate marketing.',
    'Open with the core insight in the first paragraph (no warm-up).',
    'Use exactly two ## sections after the title.',
    'One specific example or observation. No em-dashes. End with one short reply-worthy question.',
  ].join(' ');

  const result = await generateContentFromTopic({
    rawBrief,
    platform: 'substack',
    tone: 'editorial',
  });

  const displayKeywords = fromTrends
    ? keywords
        .map(item => item.keyword)
        .filter(keyword => keyword.trim().toLowerCase() !== topic.trim().toLowerCase())
        .slice(0, 5)
    : [];

  return {
    topic: result.topic,
    content: result.content,
    keywords: displayKeywords,
    fromTrends,
  };
}
