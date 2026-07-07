import { countWords, type ReadingTarget } from '@/lib/content/readingTarget';

const PLACEHOLDER_LINE_RE = /^\$\d+$/;

/** Lines that are model planning, not publishable copy. */
const META_LINE =
  /^(?:we need|let'?s |i'?ll |we'?ll |the spec|word count|structure:|hook line|paragraph|line\d+:|title line|thus we have|now (?:section|count|next)|must be \d|could be "|ensure no|write:$|count:|second:|title or opening|paragraph\(s\)|so we need|we should|no em-dashes)/i;

const META_SNIPPET =
  /\b(we need to (?:write|produce|output)|word count|let'?s (?:craft|write|count)|thus we have|planning notes|we must not use markdown|i'?ll write full)\b/i;

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

function isSkippedLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (PLACEHOLDER_LINE_RE.test(trimmed)) return true;
  if (META_LINE.test(trimmed)) return true;
  if (META_SNIPPET.test(trimmed)) return true;
  if (/^=+\d*$/.test(trimmed.replace(/\s/g, ''))) return true;
  return false;
}

/** Strip planning lines and fix punctuation in one pass. */
export function cleanGeneratedContent(text: string): string {
  const lines = text.trim().split('\n');

  let start = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i]?.trim() ?? '';
    if (!trimmed || isSkippedLine(trimmed)) continue;
    start = i;
    break;
  }

  const body: string[] = [];
  for (let i = start; i < lines.length; i += 1) {
    const trimmed = lines[i]?.trim() ?? '';
    if (!trimmed) {
      if (body.length > 0 && body[body.length - 1] !== '') body.push('');
      continue;
    }
    if (isSkippedLine(trimmed)) continue;
    body.push(unwrapLine(trimmed));
  }

  return body.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function hasPlanningLeak(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  const firstLine = trimmed.split('\n').find(line => line.trim())?.trim() ?? '';
  if (META_LINE.test(firstLine)) return true;

  return META_SNIPPET.test(trimmed.slice(0, 800));
}

/** Return a retry instruction when the draft needs another pass, else null. */
export function getRegenerationReason(text: string, target: ReadingTarget): string | null {
  if (countPlaceholderLines(text) > 0) {
    return 'Replace every $N placeholder with real sentences. Output only the finished article.';
  }
  if (hasPlanningLeak(text)) {
    return 'Output ONLY the finished publish-ready article. Start with the title or opening line. No planning notes or word-count commentary.';
  }

  const words = countWords(text);
  if (words < target.minWords) {
    return `Draft is ${words} words; write ${target.minWords}–${target.maxWords} words total. Output the full article now.`;
  }
  if (words > target.maxWords) {
    return `Draft is ${words} words; shorten to ${target.maxWords} max. Keep the same structure, cut filler.`;
  }

  return null;
}
