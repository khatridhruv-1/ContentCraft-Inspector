import { buildUnsubscribeUrl, isEmailConfigured, sendEmail } from '@/lib/email/resend';
import { buildDailyNewsletterEmail, buildWelcomeEmail } from '@/lib/email/newsletterTemplate';
import type { NewsletterSubscriber } from '@/types/newsletter';

export async function sendWelcomeNewsletterEmail(subscriber: NewsletterSubscriber): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn('RESEND_API_KEY not set — skipping welcome email.');
    return;
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
  issue: { topic: string; content: string; keywords: string[] }
): Promise<void> {
  const unsubscribeUrl = buildUnsubscribeUrl(subscriber.unsubscribe_token);
  const email = buildDailyNewsletterEmail({
    topic: issue.topic,
    content: issue.content,
    keywords: issue.keywords,
    unsubscribeUrl,
  });

  await sendEmail({
    to: subscriber.email,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}
