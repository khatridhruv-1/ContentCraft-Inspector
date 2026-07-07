import { countWords, type ReadingTarget } from '@/lib/content/readingTarget';

const PLACEHOLDER_LINE_RE = /^\$\d+$/;

const META_LINE =
  /^(?:we need|let'?s |i'?ll |we'?ll |the spec|word count|count words|structure:|hook line|paragraph|line\d+:|title line|thus we have|now (?:section|count|next|body)|must be \d|could be "|ensure no|ensure short|write:$|count:|second:|title or opening|paragraph\(s\)|so we need|we should|no em-dashes|current draft|we have title|section heading|subtitle line|next:|need sections|avoid banned|not counted as)/i;

const META_SNIPPET =
  /\b(we need to (?:write|produce|output)|word count|count words|let'?s (?:craft|write|count)|thus we have|planning notes|we must not use markdown|i'?ll write full|current draft|we have title|subtitle line)\b/i;

const WORD_COUNT_MATH = /\b\w+\d+(?:\s+\w+\d+){2,}/;
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
  if ((trimmed.match(/\b\w+\d+\b/g) ?? []).length >= 3) return true;
  return false;
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

function findContentStart(lines: string[]): number {
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i]?.trim() ?? '';
    if (!trimmed || isSkippedLine(trimmed)) continue;
    if (trimmed.startsWith('# ')) return i;

    const next = lines[i + 1]?.trim() ?? '';
    if (next && !isSkippedLine(next) && trimmed.length >= 20 && next.length >= 20) {
      return i;
    }

    return i;
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

    const unwrapped = unwrapLine(trimmed);
    if (!isSkippedLine(unwrapped) && !isWordCountMath(unwrapped)) {
      body.push(unwrapped);
    }
  }

  return body.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function hasPlanningLeak(text: string): boolean {
  const cleaned = cleanGeneratedContent(text);
  const sample = text.trim().slice(0, 1200);

  if (WORD_COUNT_MATH.test(sample) || WORD_COUNT_TAIL.test(sample)) return true;
  if (META_SNIPPET.test(sample)) return true;

  const firstLine = cleaned.split('\n').find(line => line.trim())?.trim() ?? '';
  if (!firstLine) return true;
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
