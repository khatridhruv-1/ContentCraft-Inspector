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
━━━ PLATFORM: PERSONAL WEBSITE ━━━
- Publish-ready blog post for a personal site or portfolio blog.
- Use markdown: one # title, 3–4 ## sections with plain, specific headings.
- SEO-friendly but human-first — no keyword stuffing.
- Opening hook in the first 2 paragraphs; end with a clear takeaway (no sales CTA).
- Scannable: short paragraphs, occasional bullets where they help.
${READING_LENGTH_RULE}
`.trim(),

  linkedin: `
━━━ PLATFORM: LINKEDIN ━━━
- Long-form LinkedIn post (not a formal article URL) — optimized for the feed.
- NO markdown headings (# or ##). Use short paragraphs separated by blank lines.
- First 2 lines must hook before "see more" — lead with insight, tension, or a bold claim.
- One idea per paragraph (1–3 sentences). Use line breaks generously.
- Professional, first-person when natural. Concrete examples > generic advice.
- End with a question or reflection to invite comments (not "follow for more").
- Final line: 3–5 relevant hashtags (e.g. #Topic #Industry).
- No emoji spam; 0–2 emojis max only if they fit the tone.
${READING_LENGTH_RULE}
`.trim(),

  quora: `
━━━ PLATFORM: QUORA ━━━
- Write as a direct, helpful Quora answer to the topic as a question.
- Open with the answer in the first 2–3 sentences — no throat-clearing.
- Conversational, credible, first-person OK when it adds authenticity.
- Use short sections; bold lead-ins sparingly (**like this**) instead of markdown headings.
- Explain why, not just what. Include 1–2 practical examples or mini-stories.
- No clickbait, no "As an AI", no self-promotional links.
- Close with a concise summary or actionable next step.
${READING_LENGTH_RULE}
`.trim(),

  medium: `
━━━ PLATFORM: MEDIUM ━━━
- Medium-style essay: narrative, thoughtful, reader-respectful.
- # Title on line 1; optional *subtitle* on line 2 (italic).
- Strong opening scene or tension in paragraph 1.
- 3–4 ## sections with evocative, non-generic headings.
- Mix insight with story — at least one concrete anecdote or example.
- Medium voice: smart, accessible, not corporate. Varied sentence rhythm.
- End with a resonant closing thought (not a subscribe CTA).
${READING_LENGTH_RULE}
`.trim(),

  substack: `
━━━ PLATFORM: SUBSTACK ━━━
- Newsletter essay for email subscribers — intimate, direct, valuable.
- # Subject-style title; treat the reader as "you".
- First paragraph must deliver the promise of the topic immediately.
- 3–4 ## sections; conversational but structured.
- One personal angle or observation that feels written by a human editor.
- Lighter on SEO tricks; heavier on clarity and voice.
- Soft close — reflection or one question for replies (no hard sell).
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
