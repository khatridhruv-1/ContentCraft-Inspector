import { countWords, type ReadingTarget } from '@/lib/content/readingTarget';
import type { ContentPlatformId } from '@/types/contentPlatform';

const PLACEHOLDER_LINE_RE = /^\$\d+$/;

const META_LINE =
  /^(?:we need|let'?s |i'?ll |we'?ll |the spec|word count|count words|structure:|hook line|paragraph|line\d+:|title line|thus we have|now (?:section|count|next|body)|must be \d|could be "|ensure no|ensure short|write:$|count:|second:|title or opening|paragraph\(s\)|so we need|we should|no em-dashes|current draft|we have title|section heading|subtitle line|next:|need sections|avoid banned|not counted as|maybe "|body\.?$)/i;

const META_SNIPPET =
  /\b(we need to (?:write|produce|output)|word count|count words|let'?s (?:craft|write|count)|thus we have|planning notes|we must not use markdown|i'?ll write full|current draft|we have title|subtitle line|need sections|ensure short paragraphs)\b/i;

const WORD_COUNT_TAIL = /=>\s*\d+\s*words?\b/i;

export function countPlaceholderLines(text: string): number {
  return text.split('\n').filter(line => PLACEHOLDER_LINE_RE.test(line.trim())).length;
}

function humanizeLine(line: string): string {
  return line
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/,\s+,/g, ', ')
    .replace(/,\s*\./g, '.')
    .replace(/ {2,}/g, ' ')
    .trimEnd();
}

function unwrapLine(line: string): string {
  const numbered = line.match(/^line\d+:\s*(.+)$/i);
  if (numbered?.[1]) return numbered[1].trim();

  const quoted = line.match(/^["“](.+?)["”](?:\s*\(sentence \d+\))?\s*$/);
  if (quoted?.[1] && quoted[1].length >= 12) return quoted[1].trim();

  return humanizeLine(line);
}

function isWordCountMath(line: string): boolean {
  const trimmed = line.trim();
  if (WORD_COUNT_TAIL.test(trimmed)) return true;
  return (trimmed.match(/\b\w+\d+\b/g) ?? []).length >= 3;
}

function isSkippedLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (PLACEHOLDER_LINE_RE.test(trimmed)) return true;
  if (META_LINE.test(trimmed)) return true;
  if (META_SNIPPET.test(trimmed)) return true;
  if (isWordCountMath(trimmed)) return true;
  if (/^=+\d*$/.test(trimmed.replace(/\s/g, ''))) return true;
  return false;
}

function isPublishableLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || isSkippedLine(trimmed)) return false;
  if (trimmed.startsWith('# ')) return true;
  if (/^\*\*.+\*\*$/.test(trimmed)) return true;
  if (/^line\d+:\s*.+/i.test(trimmed)) return true;
  if (trimmed.length < 20) return false;
  if (/^(now|next|then|write|subtitle|body)\b/i.test(trimmed)) return false;
  return true;
}

function findContentStart(lines: string[]): number {
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i]?.trim() ?? '';
    if (!isPublishableLine(trimmed)) continue;
    if (trimmed.startsWith('# ')) return i;

    const next = lines[i + 1]?.trim() ?? '';
    if (isPublishableLine(next)) return i;
  }
  return 0;
}

/** Strip planning lines and fix punctuation in one pass. */
export function cleanGeneratedContent(text: string): string {
  const lines = text.trim().replace(/^current draft:\s*/i, '').split('\n');
  const start = findContentStart(lines);

  const body: string[] = [];
  for (let i = start; i < lines.length; i += 1) {
    const trimmed = lines[i]?.trim() ?? '';
    if (!trimmed) {
      if (body.length > 0 && body[body.length - 1] !== '') body.push('');
      continue;
    }
    if (isSkippedLine(trimmed)) continue;

    const unwrapped = unwrapLine(trimmed);
    if (isSkippedLine(unwrapped) || isWordCountMath(unwrapped)) continue;
    body.push(unwrapped);
  }

  return body.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function normalizePlatformFormat(content: string, platform: ContentPlatformId): string {
  const lines = content.trim().split('\n');
  if (lines.length === 0) return content;

  const first = lines[0]?.trim() ?? '';
  const usesMarkdownTitle = platform === 'website' || platform === 'medium' || platform === 'substack';

  if (usesMarkdownTitle) {
    const boldTitle = first.match(/^\*\*(.+)\*\*$/);
    if (boldTitle) lines[0] = `# ${boldTitle[1].trim()}`;
  }

  if (platform === 'linkedin' || platform === 'quora') {
    if (first.startsWith('# ')) lines[0] = first.slice(2).trim();
  }

  return lines.join('\n').trim();
}

export function hasPlanningLeak(text: string): boolean {
  const cleaned = cleanGeneratedContent(text);
  const sample = text.trim().slice(0, 1200);

  if (isWordCountMath(sample) || WORD_COUNT_TAIL.test(sample)) return true;
  if (META_SNIPPET.test(sample)) return true;

  const firstLine = cleaned.split('\n').find(line => line.trim())?.trim() ?? '';
  if (!firstLine || firstLine.length < 15) return true;
  if (META_LINE.test(firstLine)) return true;

  return false;
}

/** Return a retry instruction when the draft needs another pass, else null. */
export function getRegenerationReason(text: string, target: ReadingTarget): string | null {
  const cleaned = cleanGeneratedContent(text);

  if (countPlaceholderLines(text) > 0) {
    return 'Replace every $N placeholder with real sentences. Output only the finished article.';
  }
  if (hasPlanningLeak(text)) {
    return 'Output ONLY the finished publish-ready article. No planning notes, word-count math, or "Current draft:" labels. Start with the title or opening line.';
  }

  const words = countWords(cleaned);
  if (words < target.minWords) {
    return `Draft is ${words} words; write ${target.minWords}–${target.maxWords} words total. Output the complete article now — no planning notes.`;
  }
  if (words > target.maxWords) {
    return `Draft is ${words} words; shorten to ${target.maxWords} max. Keep the same structure, cut filler.`;
  }

  return null;
}
