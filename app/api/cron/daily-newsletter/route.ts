import { NextResponse } from 'next/server';
import { sendDailyNewsletterToSubscriber } from '@/lib/email/sendNewsletterEmail';
import { isEmailConfigured } from '@/lib/email/resend';
import { generateDailyNewsletterIssue } from '@/lib/newsletter/generateDailyIssue';
import { listActiveSubscribers, logNewsletterIssue } from '@/lib/newsletter/subscribers';

export const runtime = 'edge';

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.OLLAMA_API_KEY?.trim() || !process.env.SCRAPING_HUB_API_KEY?.trim()) {
    return NextResponse.json({ error: 'AI services not configured.' }, { status: 500 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ error: 'RESEND_API_KEY is not set.' }, { status: 500 });
  }

  try {
    const subscribers = await listActiveSubscribers();

    if (!subscribers.length) {
      return NextResponse.json({ message: 'No active subscribers.', sent: 0 });
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

    return NextResponse.json({
      message: 'Daily newsletter sent.',
      topic: issue.topic,
      sent,
      failed: failures.length,
      failures: failures.slice(0, 10),
    });
  } catch (error) {
    console.error('Daily newsletter cron error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Newsletter send failed.' },
      { status: 502 }
    );
  }
}
