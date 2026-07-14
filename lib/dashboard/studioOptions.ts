export const STUDIO_TONES = [
  'Professional',
  'Conversational',
  'Persuasive',
  'Educational',
  'Friendly',
  'Authoritative',
  'Casual',
  'Inspirational',
] as const;

export type StudioTone = (typeof STUDIO_TONES)[number];

export const STUDIO_FORMATS = [
  { label: 'Blog post', prompt: 'Write a blog post about ' },
  { label: 'LinkedIn', prompt: 'Write a LinkedIn post about ' },
  { label: 'Quora answer', prompt: 'Write a Quora answer about ' },
  { label: 'Newsletter', prompt: 'Draft a newsletter section on ' },
  { label: 'How-to guide', prompt: 'Create a step-by-step guide on ' },
] as const;

/** Full example briefs — one click to populate the composer. */
export const STARTER_BRIEFS = [
  {
    label: 'B2B SaaS blog',
    platform: 'website' as const,
    brief:
      'How to build a B2B SaaS content marketing strategy in 2026 — for marketing leads at early-stage startups. Practical, not generic.',
  },
  {
    label: 'LinkedIn hook',
    platform: 'linkedin' as const,
    brief:
      'Why platform-specific AI drafts beat generic chat output — contrarian take for B2B creators, short paragraphs, strong hook.',
  },
  {
    label: 'Quora credibility',
    platform: 'quora' as const,
    brief:
      'What is the best way to repurpose blog content for Quora without sounding promotional? First-person practitioner answer.',
  },
] as const;
