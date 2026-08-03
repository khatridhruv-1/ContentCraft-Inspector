import { NextResponse } from 'next/server';
import { runDailyNewsletterSend } from '@/lib/newsletter/runDailySend';

export const runtime = 'edge';

function authorizeCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const auth = req.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}

/**
 * Manual / emergency trigger. Production daily send runs via GitHub Actions
 * (`scripts/send-daily-newsletter.ts`) to avoid Cloudflare Pages timeouts.
 */
export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runDailyNewsletterSend();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Daily newsletter cron error:', error);
    const message = error instanceof Error ? error.message : 'Newsletter send failed.';
    const status =
      message.includes('not configured') || message.includes('not set') ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
