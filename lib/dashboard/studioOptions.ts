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
  { label: 'Product page', prompt: 'Write compelling product copy for ' },
  { label: 'Newsletter', prompt: 'Draft a newsletter section on ' },
  { label: 'How-to guide', prompt: 'Create a step-by-step guide on ' },
] as const;
