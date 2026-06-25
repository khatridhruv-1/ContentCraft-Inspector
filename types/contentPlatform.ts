export const CONTENT_PLATFORMS = [
  'website',
  'linkedin',
  'quora',
  'medium',
  'substack',
] as const;

export type ContentPlatformId = (typeof CONTENT_PLATFORMS)[number];

export const DEFAULT_CONTENT_PLATFORM: ContentPlatformId = 'website';

export type ContentPlatformOption = {
  id: ContentPlatformId;
  label: string;
  shortLabel: string;
};

export const CONTENT_PLATFORM_OPTIONS: ContentPlatformOption[] = [
  { id: 'website', label: 'Personal website', shortLabel: 'Website' },
  { id: 'linkedin', label: 'LinkedIn', shortLabel: 'LinkedIn' },
  { id: 'quora', label: 'Quora', shortLabel: 'Quora' },
  { id: 'medium', label: 'Medium', shortLabel: 'Medium' },
  { id: 'substack', label: 'Substack', shortLabel: 'Substack' },
];

/** ~200 wpm → 3–4 minute read */
export const PLATFORM_READING_TARGET = {
  minWords: 650,
  maxWords: 900,
  label: '3–4 minute read',
} as const;

export function parseContentPlatform(value: unknown): ContentPlatformId | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  return CONTENT_PLATFORMS.includes(normalized as ContentPlatformId)
    ? (normalized as ContentPlatformId)
    : undefined;
}

export function resolveContentPlatform(value: unknown): ContentPlatformId {
  return parseContentPlatform(value) ?? DEFAULT_CONTENT_PLATFORM;
}
