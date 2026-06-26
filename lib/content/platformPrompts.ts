import {
  PLATFORM_READING_TARGET,
  type ContentPlatformId,
} from '@/types/contentPlatform';

const READING_LENGTH_RULE = `
━━━ LENGTH (strict) ━━━
- Target ${PLATFORM_READING_TARGET.label}: ${PLATFORM_READING_TARGET.minWords}–${PLATFORM_READING_TARGET.maxWords} words total.
- Do not exceed ${PLATFORM_READING_TARGET.maxWords} words.
`.trim();

const PLATFORM_RULES: Record<ContentPlatformId, string> = {
  website: `
━━━ PLATFORM: PERSONAL WEBSITE / BLOG ━━━
- Publish-ready blog post: clear title, strong hook, scannable ## sections.
- Use markdown: one # title, 3–5 ## sections with specific headings (not "Introduction" or "Conclusion").
- SEO-friendly but human-first — weave keywords naturally; never stuff or paste keyword strings.
- Opening: context shift or direct answer in paragraph 1.
- Short paragraphs, occasional bullets only when listing parallel options.
- End with a substantive takeaway — no sales CTA, author plug, or "subscribe" pitch.
${READING_LENGTH_RULE}
`.trim(),

  linkedin: `
━━━ PLATFORM: LINKEDIN ━━━
- Long-form LinkedIn post for the feed — narrative essay style, NOT an emoji listicle.
- NO markdown headings (# or ##). Short paragraphs separated by blank lines.
- First 2 lines must hook before "see more" — insight, tension, or a clear before/after ("For years…").
- One idea per paragraph (1–3 sentences). Professional, first-person when it adds authenticity.
- Prefer prose over bullets. If bullets are used, max 3 items and no emoji prefixes on every line.
- Concrete examples and contrasts > generic advice ("educate don't sell" without substance).
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
- Explain why and how, with 1–2 practical examples. Define acronyms plainly.
- No clickbait, no "As an AI", no self-promotional links, product pitches, or author marketing.
- Close with a concise summary or one actionable next step.
${READING_LENGTH_RULE}
`.trim(),

  medium: `
━━━ PLATFORM: MEDIUM ━━━
- Medium essay: narrative, thoughtful, reader-respectful — match practitioner long-form style.
- # Title on line 1; optional *subtitle* on line 2 (italic, one line).
- Opening: context shift ("For years… But today…") or a crisp tension statement.
- 3–5 ## sections with specific, non-generic headings.
- Short paragraphs throughout. Minimal bullets — prefer flowing prose.
- Smart, accessible voice — not corporate, not listicle-hype. Varied sentence rhythm.
- End with a resonant forward-looking line (not "subscribe on Medium").
${READING_LENGTH_RULE}
`.trim(),

  substack: `
━━━ PLATFORM: SUBSTACK ━━━
- Newsletter essay for email subscribers — intimate, direct, high signal.
- # Subject-style title; write to "you" where natural.
- First paragraph delivers the promise of the topic — no filler intro.
- 3–5 ## sections; conversational but structured like a letter from someone who knows the space.
- One personal observation or "here's what I'm seeing" angle per piece.
- Lighter on SEO tricks; heavier on clarity, definitions, and practical insight.
- Soft close — reflection or one question for replies (no hard sell, no "visit my site").
${READING_LENGTH_RULE}
`.trim(),
};

export function getPlatformPromptSection(platform: ContentPlatformId): string {
  return PLATFORM_RULES[platform];
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
