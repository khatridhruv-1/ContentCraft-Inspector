import { NextResponse } from 'next/server';
import { sendEmail, isEmailConfigured } from '@/lib/email/resend';
import { SITE_EMAILS } from '@/lib/marketing/siteConfig';

export const runtime = 'edge';

interface ContactRequest {
  name?: string;
  email?: string;
  topic?: string;
  subject?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TOPIC_LABELS: Record<string, string> = {
  general: 'General question',
  account: 'Account or login',
  billing: 'Billing or pricing',
  integrations: 'MCP / API / integrations',
  'pro-waitlist': 'Pro plan waitlist',
  privacy: 'Privacy or data request',
};

function recipientForTopic(topic: string): string {
  return topic === 'privacy' ? SITE_EMAILS.privacy : SITE_EMAILS.support;
}

async function validateContactRequest(
  req: Request
): Promise<ContactRequest & { name: string; email: string; topic: string; subject: string; message: string } | NextResponse> {
  let body: ContactRequest;

  try {
    body = (await req.json()) as ContactRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const topic = body.topic?.trim() || 'general';
  const subject = body.subject?.trim();
  const message = body.message?.trim();

  if (!name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }
  if (!subject) {
    return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
  }
  if (!message || message.length < 10) {
    return NextResponse.json({ error: 'Message must be at least 10 characters.' }, { status: 400 });
  }

  return { name, email, topic, subject, message };
}

export async function POST(req: Request) {
  if (!isEmailConfigured()) {
    return NextResponse.json({ error: 'Contact form is temporarily unavailable.' }, { status: 503 });
  }

  const validated = await validateContactRequest(req);
  if (validated instanceof NextResponse) return validated;

  const topicLabel = TOPIC_LABELS[validated.topic] ?? validated.topic;
  const to = recipientForTopic(validated.topic);

  const text = [
    `Name: ${validated.name}`,
    `Email: ${validated.email}`,
    `Topic: ${topicLabel}`,
    '',
    validated.message,
  ].join('\n');

  const html = `
    <p><strong>Name:</strong> ${validated.name}</p>
    <p><strong>Email:</strong> ${validated.email}</p>
    <p><strong>Topic:</strong> ${topicLabel}</p>
    <hr />
    <p>${validated.message.replace(/\n/g, '<br />')}</p>
  `;

  try {
    await sendEmail({
      to,
      subject: `[Contact] ${validated.subject}`,
      html,
      text,
      replyTo: validated.email,
      fromName: 'BlogCreator Contact',
    });
  } catch (error) {
    console.error('Contact form email failed:', error);
    return NextResponse.json(
      { error: 'Could not send your message. Please try again or email us directly.' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Your message was sent. We typically reply within one business day.',
  });
}
