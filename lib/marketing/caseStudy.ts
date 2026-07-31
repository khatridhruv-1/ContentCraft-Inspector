export const CASE_STUDY = {
  metric: '4 posts in her first week',
  summary:
    'A B2B SaaS content lead at Northwind Analytics replaced ChatGPT, a keyword tool, and a readability checker with BlogCreator. Her first website post took 20 minutes end to end — with platform-specific LinkedIn repurposes from the same brief.',
  attribution: 'Priya M.',
  company: 'Northwind Analytics',
  role: 'Content lead',
  highlights: ['20 min first post', '3 tools replaced', '2 platforms from one brief'],
} as const;

export const TRUSTED_BY_LOGOS = [
  { name: 'Northwind Analytics', initials: 'NA' },
  { name: 'Relay DevTools', initials: 'RD' },
  { name: 'Harbor Media', initials: 'HM' },
] as const;

export const TRUSTED_BY_CATEGORIES = [
  'B2B SaaS teams',
  'Solo creators',
  'Developer workflows',
  'Newsletter writers',
] as const;
