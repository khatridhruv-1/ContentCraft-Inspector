import { sendDailyNewsletterToSubscriber } from '@/lib/email/sendNewsletterEmail';
import { isEmailConfigured } from '@/lib/email/resend';
import { generateDailyNewsletterIssue } from '@/lib/newsletter/generateDailyIssue';
import { listActiveSubscribers, logNewsletterIssue } from '@/lib/newsletter/subscribers';

export type DailyNewsletterSendResult = {
  message: string;
  topic?: string;
  sent: number;
  failed: number;
  failures: string[];
};

export async function runDailyNewsletterSend(): Promise<DailyNewsletterSendResult> {
  if (!process.env.OLLAMA_API_KEY?.trim() || !process.env.SCRAPING_HUB_API_KEY?.trim()) {
    throw new Error('AI services not configured (OLLAMA_API_KEY / SCRAPING_HUB_API_KEY).');
  }

  if (!isEmailConfigured()) {
    throw new Error('RESEND_API_KEY is not set.');
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    throw new Error('Supabase admin env is not configured.');
  }

  const subscribers = await listActiveSubscribers();

  if (!subscribers.length) {
    return { message: 'No active subscribers.', sent: 0, failed: 0, failures: [] };
  }

  const issue = await generateDailyNewsletterIssue();

  let sent = 0;
  const failures: string[] = [];

  for (const subscriber of subscribers) {
    try {
      await sendDailyNewsletterToSubscriber(subscriber, issue);
      sent += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Send failed';
      failures.push(`${subscriber.email}: ${message}`);
      console.error(`Failed to send to ${subscriber.email}:`, error);
    }
  }

  await logNewsletterIssue({
    topic: issue.topic,
    contentPreview: issue.content,
    subscriberCount: sent,
  });

  return {
    message: 'Daily newsletter sent.',
    topic: issue.topic,
    sent,
    failed: failures.length,
    failures: failures.slice(0, 10),
  };
}
