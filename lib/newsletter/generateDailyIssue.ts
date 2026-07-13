import { generateContentFromTopic } from '@/lib/ai/generateContent';
import { pickDailyNewsletterTopic } from '@/lib/newsletter/pickTopic';

export type DailyNewsletterIssue = {
  topic: string;
  content: string;
  keywords: string[];
};

export async function generateDailyNewsletterIssue(): Promise<DailyNewsletterIssue> {
  const { topic, keywords } = await pickDailyNewsletterTopic();

  const result = await generateContentFromTopic({
    rawBrief: topic,
    platform: 'substack',
    tone: 'professional',
  });

  return {
    topic: result.topic,
    content: result.content,
    keywords: keywords.map(item => item.keyword).slice(0, 6),
  };
}
