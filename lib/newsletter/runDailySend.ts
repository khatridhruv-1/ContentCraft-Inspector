import { sendDailyNewsletterToSubscriber } from '@/lib/email/sendNewsletterEmail';
import { isEmailConfigured } from '@/lib/email/resend';
import { generateDailyNewsletterIssue } from '@/lib/newsletter/generateDailyIssue';
import { listActiveSubscribers, logNewsletterIssue } from '@/lib/newsletter/subscribers';
import { OllamaAuthError } from '@/lib/ai/ollama';

export type DailyNewsletterSendResult = {
  message: string;
  topic?: string;
  sent: number;
  failed: number;
  failures: string[];
};

function stageError(stage: string, hint: string, error: unknown): Error {
  const detail = error instanceof Error ? error.message : String(error);
  return new Error(`[${stage}] ${detail} — ${hint}`);
}

export async function runDailyNewsletterSend(): Promise<DailyNewsletterSendResult> {
  if (!process.env.OLLAMA_API_KEY?.trim()) {
    throw new Error('OLLAMA_API_KEY is not set.');
  }

  if (!isEmailConfigured()) {
    throw new Error('RESEND_API_KEY is not set.');
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    throw new Error('Supabase admin env is not configured.');
  }

  if (!process.env.SCRAPING_HUB_API_KEY?.trim()) {
    console.warn(
      '[daily-newsletter] SCRAPING_HUB_API_KEY missing — using seed topic fallback (fix the secret for better topics).'
    );
  }

  let subscribers;
  try {
    subscribers = await listActiveSubscribers();
  } catch (error) {
    throw stageError(
      'supabase',
      'Check NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY match the same project (service_role key, not anon).',
      error
    );
  }

  if (!subscribers.length) {
    return { message: 'No active subscribers.', sent: 0, failed: 0, failures: [] };
  }

  console.log(`[daily-newsletter] ${subscribers.length} active subscriber(s); generating issue…`);

  let issue;
  try {
    issue = await generateDailyNewsletterIssue();
  } catch (error) {
    if (error instanceof OllamaAuthError) {
      throw stageError(
        'ollama',
        'Check OLLAMA_API_KEY at https://ollama.com/settings/keys (Cloud API key, not SSH).',
        error
      );
    }

    throw stageError(
      'generate',
      'Failed while drafting content (Ollama). Scraping Hub failures should fall back to a seed topic.',
      error
    );
  }

  console.log(`[daily-newsletter] Topic: ${issue.topic}; sending…`);

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

  if (sent === 0 && failures.length > 0) {
    throw stageError(
      'resend',
      'Check RESEND_API_KEY and that NEWSLETTER_FROM_EMAIL is a verified sender domain.',
      new Error(failures[0] ?? 'All sends failed')
    );
  }

  try {
    await logNewsletterIssue({
      topic: issue.topic,
      contentPreview: issue.content,
      subscriberCount: sent,
    });
  } catch (error) {
    console.error('[daily-newsletter] Issue log failed (sends may still have succeeded):', error);
  }

  return {
    message: 'Daily newsletter sent.',
    topic: issue.topic,
    sent,
    failed: failures.length,
    failures: failures.slice(0, 10),
  };
}
