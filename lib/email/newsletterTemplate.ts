import { PRODUCTION_SITE_URL } from '@/lib/marketing/siteConfig';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineFormat(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#0f172a;font-weight:600;">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** First substantive sentence as a mobile dek / pull-quote under the H1. */
function dekLine(content: string, fallback: string): string {
  const withoutTitle = content.replace(/^#\s+.+$/m, '').trim();
  const paragraph = withoutTitle.split(/\n+/).map(line => line.trim()).find(line => {
    if (!line || line.startsWith('#')) return false;
    const plain = line.replace(/^[*_]+|[*_]+$/g, '').trim();
    return plain.length >= 40;
  });
  if (!paragraph) return fallback;
  const plain = paragraph.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').trim();
  if (plain.length <= 160) return plain;
  const cut = plain.slice(0, 157);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function markdownToEmailHtml(content: string): string {
  const lines = content.split('\n');
  const parts: string[] = [];
  let skipFirstH1 = true;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('# ')) {
      // Title already rendered in the email header — skip duplicate H1 from the draft.
      if (skipFirstH1) {
        skipFirstH1 = false;
        continue;
      }
      parts.push(
        `<h2 style="margin:28px 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#0f172a;font-weight:700;">${inlineFormat(trimmed.slice(2))}</h2>`
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      parts.push(
        `<h2 style="margin:28px 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.3;color:#0f172a;font-weight:700;">${inlineFormat(trimmed.slice(3))}</h2>`
      );
      continue;
    }

    parts.push(
      `<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.7;color:#334155;">${inlineFormat(trimmed)}</p>`
    );
  }

  return parts.join('\n');
}

function emailShell(body: string, footerNote: string, unsubscribeUrl?: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_SITE_URL;
  const unsubscribeBlock = unsubscribeUrl
    ? `<p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;">
        <a href="${unsubscribeUrl}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>
      </p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>BlogCreator Daily</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #dce5e2;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="background:#0f172a;padding:20px 32px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#5eead4;">BlogCreator Daily</p>
            </td>
          </tr>
          <tr>
            <td style="height:3px;background:#0f766e;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 32px 28px;">
              ${body}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 0;">
                <tr>
                  <td style="padding:20px 0 0;border-top:1px solid #e2e8f0;">
                    <p style="margin:0 0 14px;font-size:13px;line-height:1.55;color:#64748b;">${footerNote}</p>
                    <a href="${siteUrl}" style="display:inline-block;background:#0f766e;color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.02em;padding:11px 18px;border-radius:4px;">Try BlogCreator</a>
                    <p style="margin:16px 0 0;font-size:12px;">
                      <a href="${siteUrl}" style="color:#0f766e;text-decoration:none;font-weight:600;">blogcreator.dev</a>
                    </p>
                    ${unsubscribeBlock}
                  </td>
                </tr>
              </table>
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
    'Every morning you will receive a short editorial briefing — humanized writing on what creators and marketers are searching for.',
    '',
    'Unsubscribe anytime:',
    unsubscribeUrl,
  ].join('\n');

  const html = emailShell(
    `<h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#0f172a;">Welcome aboard</h1>
     <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.7;color:#334155;">
       You are subscribed to <strong style="color:#0f172a;">BlogCreator Daily</strong> — a short morning read on what people are actually searching for, written for practitioners.
     </p>
     <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.7;color:#334155;">
       Your first issue arrives with the next send. Expect one clear idea, not a dump of links.
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
  fromTrends?: boolean;
}): { subject: string; html: string; text: string } {
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const subject = input.topic;
  const showTrends = Boolean(input.fromTrends) && input.keywords.length > 0;
  const keywordLine = showTrends ? `Also trending: ${input.keywords.join(', ')}` : '';

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

  const keywordHtml = showTrends
    ? `<p style="margin:0 0 22px;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:#64748b;">Also trending · ${escapeHtml(input.keywords.join(' · '))}</p>`
    : '';

  const footerNote = showTrends
    ? 'Humanized editorial from live search signals. Reply with feedback anytime.'
    : 'A short editorial from BlogCreator Daily. Reply with feedback anytime.';

  const html = emailShell(
    `<p style="margin:0 0 6px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">${escapeHtml(dateLabel)}</p>
     <h1 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#0f172a;">${escapeHtml(input.topic)}</h1>
     <p style="margin:0 0 22px;padding:12px 14px;border-left:3px solid #0f766e;background:#f0fdfa;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.55;color:#0f766e;font-style:italic;">${escapeHtml(dekLine(input.content, input.topic))}</p>
     ${keywordHtml}
     ${markdownToEmailHtml(input.content)}`,
    footerNote,
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
    'You will no longer receive daily emails from us.',
    '',
    'Changed your mind? Resubscribe anytime:',
    resubscribeUrl,
  ].join('\n');

  const html = emailShell(
    `<h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#0f172a;">You are unsubscribed</h1>
     <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.7;color:#334155;">
       You will no longer receive <strong style="color:#0f172a;">BlogCreator Daily</strong> emails.
     </p>
     <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.7;color:#334155;">
       Changed your mind?
       <a href="${resubscribeUrl}" style="color:#0f766e;text-decoration:none;font-weight:600;">Resubscribe on blogcreator.dev</a>
     </p>`,
    'This confirms your unsubscribe request. No further action is needed.'
  );

  return { subject, html, text };
}
