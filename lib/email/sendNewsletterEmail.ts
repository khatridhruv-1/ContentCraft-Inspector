import { buildUnsubscribeUrl, isEmailConfigured, sendEmail } from '@/lib/email/resend';
import {
  buildDailyNewsletterEmail,
  buildUnsubscribeConfirmationEmail,
  buildWelcomeEmail,
} from '@/lib/email/newsletterTemplate';
import { PRODUCTION_SITE_URL } from '@/lib/marketing/siteConfig';
import type { NewsletterSubscriber } from '@/types/newsletter';

function buildResubscribeUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_SITE_URL;
  return `${siteUrl}/#newsletter`;
}

export async function sendWelcomeNewsletterEmail(subscriber: NewsletterSubscriber): Promise<void> {
  if (!isEmailConfigured()) {
    throw new Error('RESEND_API_KEY is not set');
  }

  const unsubscribeUrl = buildUnsubscribeUrl(subscriber.unsubscribe_token);
  const email = buildWelcomeEmail(unsubscribeUrl);

  await sendEmail({
    to: subscriber.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}

export async function sendDailyNewsletterToSubscriber(
  subscriber: NewsletterSubscriber,
  issue: { topic: string; content: string; keywords: string[]; fromTrends?: boolean }
): Promise<void> {
  const unsubscribeUrl = buildUnsubscribeUrl(subscriber.unsubscribe_token);
  const email = buildDailyNewsletterEmail({
    topic: issue.topic,
    content: issue.content,
    keywords: issue.keywords,
    fromTrends: issue.fromTrends,
    unsubscribeUrl,
  });

  await sendEmail({
    to: subscriber.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}

export async function sendUnsubscribeConfirmationEmail(subscriber: NewsletterSubscriber): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn('RESEND_API_KEY not set — skipping unsubscribe confirmation email.');
    return;
  }

  const email = buildUnsubscribeConfirmationEmail(buildResubscribeUrl());

  await sendEmail({
    to: subscriber.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}
