import {
  type ReadingTarget,
  DEFAULT_READING_TARGET,
  isCompactReadingTarget,
} from '@/lib/content/readingTarget';
import type { ContentPlatformId } from '@/types/contentPlatform';

function readingLengthRule(target: ReadingTarget = DEFAULT_READING_TARGET): string {
  return `
━━━ LENGTH (strict — hard limit) ━━━
- Target ${target.label}: ${target.minWords}–${target.maxWords} words total (~${target.minMinutes}–${target.maxMinutes} minutes at 200 wpm).
- HARD MAX: ${target.maxWords} words. Stop writing once you reach it — do not add extra sections.
- Prefer ${target.minWords}–${target.maxWords} words; shorter and tighter beats longer.
- Count includes every word in the article body.
`.trim();
}

function buildPlatformRules(target: ReadingTarget): Record<ContentPlatformId, string> {
  const READING_LENGTH_RULE = readingLengthRule(target);
  const compact = isCompactReadingTarget(target);
  const sectionCount = compact ? '2–3' : '3–4';

  return {
  website: `
━━━ PLATFORM: PERSONAL WEBSITE / BLOG ━━━
- Publish-ready blog post: clear title, strong hook, scannable ## sections.
- Use markdown: one # title, ${sectionCount} ## sections with specific headings (not "Introduction" or "Conclusion").
- SEO-friendly but human-first — weave keywords naturally; never stuff or paste keyword strings.
- Opening: direct answer in paragraph 1. No throat-clearing.
- Short paragraphs (1–2 sentences). No em-dashes (—) in the body.
- End with a substantive takeaway — no sales CTA, author plug, or "subscribe" pitch.
${READING_LENGTH_RULE}
`.trim(),

  linkedin: `
━━━ PLATFORM: LINKEDIN ━━━
- Long-form LinkedIn post for the feed — narrative essay style, NOT an emoji listicle.
- NO markdown headings (# or ##). Short paragraphs separated by blank lines.
- First 2 lines must hook before "see more" — one clear insight or tension point.
- One idea per paragraph (1–2 sentences). Professional, first-person when it adds authenticity.
- Prefer prose over bullets. If bullets are used, max 3 items and no emoji prefixes on every line.
- No em-dashes (—). Use commas or periods instead.
- End with a thoughtful question or reflection — not "follow for more" or product pitches.
- Final line only: 3–5 specific hashtags (e.g. #GEO #SEO #ContentMarketing).
- Emoji: 0–1 total, only if it genuinely fits — never emoji-spam or ✍️📈💡 stacks.
${READING_LENGTH_RULE}
`.trim(),

  quora: `
━━━ PLATFORM: QUORA ━━━
- Direct answer to the question in the first 2–3 sentences — no preamble.
- Conversational, credible, practitioner voice — first-person OK when it adds trust.
- Short sections; bold lead-ins sparingly (**like this**) instead of markdown headings.
- Explain why and how, with 1 practical example. Define acronyms plainly.
- No em-dashes (—). Keep sentences short.
- No clickbait, no "As an AI", no self-promotional links, product pitches, or author marketing.
- Close with a concise summary or one actionable next step.
${READING_LENGTH_RULE}
`.trim(),

  medium: `
━━━ PLATFORM: MEDIUM ━━━
- Medium essay: thoughtful, reader-respectful, concise.
- # Title on line 1; optional *subtitle* on line 2 (italic, one line).
- Opening: one crisp tension statement or direct answer. No "For years… But today…" template.
- ${sectionCount} ## sections with specific, non-generic headings.
- Short paragraphs throughout (1–2 sentences). No em-dashes (—).
- Smart, accessible voice — not corporate, not listicle-hype.
- End with a resonant forward-looking line (not "subscribe on Medium").
${READING_LENGTH_RULE}
`.trim(),

  substack: `
━━━ PLATFORM: SUBSTACK ━━━
- Newsletter essay for email subscribers — intimate, direct, high signal.
- # Title: sharp editorial headline readers would open (not a vague "X trends" label).
- Write to "you" where natural. First paragraph delivers the insight — no filler intro.
- Exactly ${compact ? '2' : sectionCount} ## sections with specific headings (not "Introduction").
- Conversational letter from a practitioner who knows the work — not a LinkedIn thinkpiece template.
- Prefer one recognizable workflow friction or public pattern over invented anonymous case studies or fake metrics.
- Ban rote openers ("The era of X is over") and antithesis closers ("Stop trying to X. Start Y.").
- No em-dashes (—). Soft close — one reply-worthy question (no hard sell, no "visit my site").
${READING_LENGTH_RULE}
`.trim(),
  };
}

export function getPlatformPromptSection(
  platform: ContentPlatformId,
  readingTarget: ReadingTarget = DEFAULT_READING_TARGET
): string {
  return buildPlatformRules(readingTarget)[platform];
}

export function getPlatformLabel(platform: ContentPlatformId): string {
  const labels: Record<ContentPlatformId, string> = {
    website: 'Personal website',
    linkedin: 'LinkedIn',
    quora: 'Quora',
    medium: 'Medium',
    substack: 'Substack',
  };
  return labels[platform];
}
