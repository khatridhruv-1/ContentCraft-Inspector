import { buildUnsubscribeUrl } from '@/lib/email/resend';
import { PRODUCTION_SITE_URL } from '@/lib/marketing/siteConfig';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function markdownToEmailHtml(content: string): string {
  const lines = content.split('\n');
  const parts: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('## ')) {
      parts.push(`<h2 style="margin:24px 0 12px;font-size:20px;color:#0f172a;">${escapeHtml(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith('# ')) {
      parts.push(`<h1 style="margin:0 0 16px;font-size:24px;color:#0f172a;">${escapeHtml(trimmed.slice(2))}</h1>`);
      continue;
    }

    parts.push(`<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#334155;">${escapeHtml(trimmed)}</p>`);
  }

  return parts.join('\n');
}

function emailShell(body: string, footerNote: string, unsubscribeUrl?: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_SITE_URL;
  const unsubscribeBlock = unsubscribeUrl
    ? `<p style="margin:16px 0 0;font-size:12px;color:#94a3b8;">
        <a href="${unsubscribeUrl}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>
      </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:32px;">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#7c3aed;">BlogCreator Daily</p>
              ${body}
              <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0;" />
              <p style="margin:0;font-size:13px;line-height:1.5;color:#64748b;">${footerNote}</p>
              <p style="margin:12px 0 0;font-size:13px;">
                <a href="${siteUrl}" style="color:#7c3aed;text-decoration:none;font-weight:600;">blogcreator.dev</a>
              </p>
              ${unsubscribeBlock}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildWelcomeEmail(unsubscribeUrl: string): { subject: string; html: string; text: string } {
  const subject = 'You are subscribed to BlogCreator Daily';
  const text = [
    'Welcome to BlogCreator Daily!',
    '',
    'Every morning you will receive a fresh briefing on trending topics — humanized, editorial content powered by live search trends.',
    '',
    'Unsubscribe anytime:',
    unsubscribeUrl,
  ].join('\n');

  const html = emailShell(
    `<h1 style="margin:0 0 16px;font-size:24px;color:#0f172a;">Welcome aboard</h1>
     <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#334155;">
       You are now subscribed to <strong>BlogCreator Daily</strong> — trending topics turned into clear, humanized content every day.
     </p>
     <p style="margin:0;font-size:16px;line-height:1.65;color:#334155;">
       Your first issue arrives tomorrow. Each edition is grounded in live trend data and written in a practitioner editorial voice.
     </p>`,
    'You received this because you subscribed at blogcreator.dev.',
    unsubscribeUrl
  );

  return { subject, html, text };
}

export function buildDailyNewsletterEmail(input: {
  topic: string;
  content: string;
  keywords: string[];
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string } {
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const subject = `Today's trend: ${input.topic}`;
  const keywordLine = input.keywords.length
    ? `Trending keywords: ${input.keywords.join(', ')}`
    : '';

  const text = [
    `BlogCreator Daily — ${dateLabel}`,
    `Topic: ${input.topic}`,
    keywordLine,
    '',
    input.content.replace(/<[^>]+>/g, ''),
    '',
    'Unsubscribe:',
    input.unsubscribeUrl,
  ]
    .filter(Boolean)
    .join('\n');

  const keywordHtml = input.keywords.length
    ? `<p style="margin:0 0 20px;font-size:13px;color:#64748b;">Trending: ${escapeHtml(input.keywords.join(' · '))}</p>`
    : '';

  const html = emailShell(
    `<p style="margin:0 0 8px;font-size:13px;color:#64748b;">${escapeHtml(dateLabel)}</p>
     <h1 style="margin:0 0 12px;font-size:24px;color:#0f172a;">${escapeHtml(input.topic)}</h1>
     ${keywordHtml}
     ${markdownToEmailHtml(input.content)}`,
    'Humanized content from trending search data. Reply with feedback anytime.',
    input.unsubscribeUrl
  );

  return { subject, html, text };
}

export function buildUnsubscribeConfirmationEmail(resubscribeUrl: string): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = 'You have been unsubscribed from BlogCreator Daily';
  const text = [
    'You have been unsubscribed from BlogCreator Daily.',
    '',
    'You will no longer receive daily trending content emails from us.',
    '',
    'Changed your mind? Resubscribe anytime:',
    resubscribeUrl,
  ].join('\n');

  const html = emailShell(
    `<h1 style="margin:0 0 16px;font-size:24px;color:#0f172a;">You are unsubscribed</h1>
     <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#334155;">
       You will no longer receive <strong>BlogCreator Daily</strong> emails.
     </p>
     <p style="margin:0;font-size:16px;line-height:1.65;color:#334155;">
       Changed your mind?
       <a href="${resubscribeUrl}" style="color:#7c3aed;text-decoration:none;font-weight:600;">Resubscribe on blogcreator.dev</a>
     </p>`,
    'This confirms your unsubscribe request. No further action is needed.'
  );

  return { subject, html, text };
}
