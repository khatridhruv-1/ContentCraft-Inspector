import { NextResponse } from 'next/server';
import { sendWelcomeNewsletterEmail } from '@/lib/email/sendNewsletterEmail';
import { subscribeEmail } from '@/lib/newsletter/subscribers';

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

    try {
      await sendWelcomeNewsletterEmail(subscriber);
    } catch (error) {
      console.error('Welcome email failed:', error);
      if (isNew) {
        return NextResponse.json(
          {
            success: true,
            message:
              'You are subscribed, but we could not send the confirmation email yet. Please try again shortly.',
            emailSent: false,
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: isNew
        ? 'You are subscribed! Check your inbox for a confirmation.'
        : 'You are already subscribed. We resent the confirmation email to your inbox.',
      emailSent: true,
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Could not complete subscription. Please try again.' }, { status: 502 });
  }
}
