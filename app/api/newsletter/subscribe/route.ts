import { NextResponse } from 'next/server';
import { sendWelcomeNewsletterEmail } from '@/lib/email/sendNewsletterEmail';
import { subscribeEmail } from '@/lib/newsletter/subscribers';
import { PRODUCTION_SITE_URL } from '@/lib/marketing/siteConfig';

export const runtime = 'edge';

interface SubscribeRequest {
  email?: string;
  source?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function validateSubscribeRequest(req: Request): Promise<{ email: string; source: string } | NextResponse> {
  let body: SubscribeRequest;

  try {
    body = (await req.json()) as SubscribeRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const source = body.source?.trim() || 'landing';

  if (!email) {
    return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  return { email, source };
}

export async function POST(req: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const validated = await validateSubscribeRequest(req);
  if (validated instanceof NextResponse) return validated;

  try {
    const { subscriber, isNew } = await subscribeEmail(validated.email, validated.source);

    let emailSent = true;

    try {
      await sendWelcomeNewsletterEmail(subscriber);
    } catch (error) {
      console.error('Welcome email failed:', error);
      emailSent = false;
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? isNew
          ? 'You are subscribed! Check your inbox for a confirmation.'
          : 'You are already subscribed. We resent the confirmation email to your inbox.'
        : isNew
          ? 'You are subscribed, but we could not send the confirmation email yet. Please try again shortly.'
          : 'You are already subscribed, but we could not resend the confirmation email. Please try again shortly.',
      emailSent,
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    const message = error instanceof Error ? error.message : 'Could not complete subscription. Please try again.';

    // Reliable debug flag for Edge runtime.
    // Call with header: `x-newsletter-debug: 1`
    const debug = req.headers.get('x-newsletter-debug') === '1';

    if (debug) {
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const safeError = (() => {
      const lower = message.toLowerCase();

      if (lower.includes('missing next_public_supabase_url')) return message;
      if (lower.includes('missing supabase_service_role_key')) return message;

      // Common case if the newsletter tables haven't been migrated to prod yet.
      if (lower.includes('newsletter_subscribers') || lower.includes('relation')) {
        return 'Newsletter database not set up. Please run Supabase migrations for newsletter tables.';
      }

      return 'Could not complete subscription. Please try again.';
    })();

    return NextResponse.json({ error: safeError }, { status: 502 });
  }
}
