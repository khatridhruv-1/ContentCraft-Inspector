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

  // Keep the subject line as `topic`. Instructions go after so briefIntent does not
  // treat the full prompt as the article title.
  const rawBrief = [
    topic,
    'Write a 2-3 minute read Substack newsletter essay on this topic.',
    'Practitioner editorial voice: opinionated, concrete, human, not corporate marketing.',
    'Open with the core insight in the first paragraph (no warm-up).',
    'Use exactly two ## sections after the title.',
    'One specific example or observation. No em-dashes.',
    'End with one short reply-worthy question.',
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
    // Always use the curated topic for email subject/H1 — never the model/prompt string.
    topic,
    content: result.content,
    keywords: displayKeywords,
    fromTrends,
  };
}
