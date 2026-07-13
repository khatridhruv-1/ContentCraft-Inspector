import { Resend } from 'resend';
import { PRODUCTION_SITE_URL } from '@/lib/marketing/siteConfig';

let resendClient: Resend | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getNewsletterFromEmail(): string {
  return process.env.NEWSLETTER_FROM_EMAIL?.trim() || 'newsletter@blogcreator.dev';
}

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const resend = getResend();
  const from = getNewsletterFromEmail();

  const { error } = await resend.emails.send({
    from: `BlogCreator Daily <${from}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function buildUnsubscribeUrl(token: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_SITE_URL;
  return `${siteUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}
