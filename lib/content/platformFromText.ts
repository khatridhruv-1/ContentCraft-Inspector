import {
  CONTENT_PLATFORMS,
  DEFAULT_CONTENT_PLATFORM,
  parseContentPlatform,
  type ContentPlatformId,
} from '@/types/contentPlatform';

const PLATFORM_ALIASES: Record<ContentPlatformId, RegExp[]> = {
  linkedin: [
    /\blinkedin\b/i,
    /\blinked[\s-]?in\s+post\b/i,
    /\bfor\s+linkedin\b/i,
    /\bon\s+linkedin\b/i,
  ],
  quora: [/\bquora\b/i, /\bquora\s+answer\b/i, /\bfor\s+quora\b/i, /\bon\s+quora\b/i],
  medium: [
    /\bmedium\s+(?:post|article|essay|story)\b/i,
    /\bfor\s+medium\b/i,
    /\bon\s+medium\b/i,
    /\bwrite\s+(?:a|an)\s+medium\b/i,
  ],
  substack: [
    /\bsubstack\b/i,
    /\bsub[\s-]?stack\b/i,
    /\bfor\s+substack\b/i,
    /\bon\s+substack\b/i,
    /\bsubstack\s+newsletter\b/i,
  ],
  website: [
    /\bpersonal\s+website\b/i,
    /\bmy\s+website\b/i,
    /\bwebsite\s+blog\b/i,
    /\bblog\s+post\s+for\s+(?:my\s+)?site\b/i,
  ],
};

/** Detect platform from natural language (e.g. "LinkedIn post about …"). */
export function extractPlatformFromText(text: string): ContentPlatformId | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  for (const platform of CONTENT_PLATFORMS) {
    if (platform === 'website') continue;
    if (PLATFORM_ALIASES[platform].some(pattern => pattern.test(trimmed))) {
      return platform;
    }
  }

  if (PLATFORM_ALIASES.website.some(pattern => pattern.test(trimmed))) {
    return 'website';
  }

  return undefined;
}

export function resolveGenerationPlatform(input: {
  platform?: ContentPlatformId;
  rawBrief: string;
}): ContentPlatformId {
  return (
    parseContentPlatform(input.platform) ??
    extractPlatformFromText(input.rawBrief) ??
    DEFAULT_CONTENT_PLATFORM
  );
}
