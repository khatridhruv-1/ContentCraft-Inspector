import { PLATFORM_READING_TARGET } from '@/types/contentPlatform';

export const WORDS_PER_MINUTE = 200;

export type ReadingTarget = {
  minWords: number;
  maxWords: number;
  minMinutes: number;
  maxMinutes: number;
  label: string;
  userSpecified: boolean;
};

export const DEFAULT_READING_TARGET: ReadingTarget = {
  minWords: PLATFORM_READING_TARGET.minWords,
  maxWords: PLATFORM_READING_TARGET.maxWords,
  minMinutes: 3,
  maxMinutes: 4,
  label: PLATFORM_READING_TARGET.label,
  userSpecified: false,
};

function wordsForMinutes(minutes: number): number {
  return Math.round(minutes * WORDS_PER_MINUTE);
}

function formatLabel(minMinutes: number, maxMinutes: number): string {
  if (minMinutes === maxMinutes) {
    return `${minMinutes} minute read`;
  }
  return `${minMinutes}–${maxMinutes} minute read`;
}

function buildReadingTarget(minMinutes: number, maxMinutes: number): ReadingTarget {
  const min = Math.min(minMinutes, maxMinutes);
  const max = Math.max(minMinutes, maxMinutes);
  return {
    minWords: wordsForMinutes(min),
    maxWords: wordsForMinutes(max),
    minMinutes: min,
    maxMinutes: max,
    label: formatLabel(min, max),
    userSpecified: true,
  };
}

const READING_TIME_PATTERNS: RegExp[] = [
  /\b(\d{1,2})\s*(?:[-–—]\s*(\d{1,2})|(?:to)\s+(\d{1,2}))\s*min(?:ute)?s?(?:\s+read(?:ing\s+time)?)?\b/i,
  /\b(?:reading\s+time|read\s+time)(?:\s+of)?\s*:?\s*(\d{1,2})\s*(?:[-–—]\s*(\d{1,2})|(?:to)\s+(\d{1,2}))?\s*min(?:ute)?s?\b/i,
  /\b(?:keep\s+it\s+to|around|about|approximately)\s+(\d{1,2})\s*(?:[-–—]\s*(\d{1,2})|(?:to)\s+(\d{1,2}))?\s*min(?:ute)?s?\b/i,
  /\b(\d{1,2})\s*min(?:ute)?s?\s+read\b/i,
  /\b(\d{1,2})\s*min(?:ute)?s?\s+reading\s+time\b/i,
];

function matchReadingMinutes(text: string): { min: number; max: number } | null {
  for (const pattern of READING_TIME_PATTERNS) {
    const match = text.match(pattern);
    if (!match) continue;

    const first = Number(match[1]);
    const second = Number(match[2] ?? match[3]);
    if (!Number.isFinite(first) || first < 1 || first > 30) continue;

    if (Number.isFinite(second) && second >= 1 && second <= 30) {
      return { min: first, max: second };
    }

    return { min: first, max: first };
  }

  return null;
}

export function parseReadingTargetFromBrief(rawBrief: string): ReadingTarget | null {
  const match = matchReadingMinutes(rawBrief);
  if (!match) return null;
  return buildReadingTarget(match.min, match.max);
}

export function resolveReadingTarget(rawBrief: string): ReadingTarget {
  return parseReadingTargetFromBrief(rawBrief) ?? DEFAULT_READING_TARGET;
}

/** Remove reading-time instructions so topic extraction stays focused on the subject. */
export function stripReadingTimeInstructions(text: string): string {
  let cleaned = text;
  for (const pattern of READING_TIME_PATTERNS) {
    cleaned = cleaned.replace(pattern, ' ');
  }
  return cleaned.replace(/\s+/g, ' ').trim();
}

export function maxTokensForReadingTarget(target: ReadingTarget): number {
  return Math.min(2048, Math.max(800, Math.ceil(target.maxWords * 1.35)));
}

export function isCompactReadingTarget(target: ReadingTarget): boolean {
  return target.maxWords <= 800;
}

/** Trim at paragraph boundaries when the model overshoots the word cap. */
export function truncateToWordLimit(text: string, maxWords: number): string {
  if (countWords(text) <= maxWords) return text;

  const paragraphs = text.split(/\n\n+/);
  let result = '';

  for (const paragraph of paragraphs) {
    const candidate = result ? `${result}\n\n${paragraph}` : paragraph;
    if (countWords(candidate) > maxWords) break;
    result = candidate;
  }

  if (result.trim() && countWords(result) >= Math.floor(maxWords * 0.55)) {
    return result.trim();
  }

  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxWords)
    .join(' ')
    .trim();
}

export function countWords(text: string): number {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_>`[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}
