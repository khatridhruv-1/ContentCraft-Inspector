/** Matches a line whose entire content (after trimming) is a shell/template placeholder like $1, $2, $99. */
const PLACEHOLDER_LINE_RE = /^\$\d+$/;

const META_LINE_PATTERNS = [
  /^we need to (?:write|produce|create|draft)/i,
  /^let'?s aim\b/i,
  /^the spec says/i,
  /^need to cover\b/i,
  /^first \d+ lines must\b/i,
  /^title line not counted/i,
  /^word count estimate/i,
  /^structure:\s/i,
  /^so we need\b/i,
  /^we should\b/i,
  /^i (?:will|need to)\b/i,
  /^must be \d+[-–]\d+ words/i,
  /^no em-dashes\b/i,
  /^use short paragraphs\b/i,
  /^paragraph_count:/i,
];

const META_BODY_PATTERNS = [
  /\bwe need to (?:write|produce|create)\b/i,
  /\bword count estimate\b/i,
  /\blet'?s aim ~?\d+/i,
  /\bthe spec says\b/i,
  /\bmust be \d+[-–]\d+ words total\b/i,
  /\btitle line not counted\b/i,
  /\bfirst \d+ lines must hook\b/i,
];

export function countPlaceholderLines(text: string): number {
  return text.split('\n').filter(line => PLACEHOLDER_LINE_RE.test(line.trim())).length;
}

function isMetaLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  return META_LINE_PATTERNS.some(pattern => pattern.test(trimmed));
}

function isMetaParagraph(paragraph: string): boolean {
  const trimmed = paragraph.trim();
  if (!trimmed) return true;
  if (isMetaLine(trimmed)) return true;

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('we need to ')) return true;
  if (/word count/.test(lower) && /estimate|roughly|must be|not counted/.test(lower)) {
    return true;
  }

  return false;
}

/** Detect model planning/reasoning leaked into the published draft. */
export function isMetaLeak(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  const firstLine = trimmed.split('\n')[0]?.trim() ?? '';
  if (isMetaLine(firstLine)) return true;

  const sample = trimmed.slice(0, 900);
  const hits = META_BODY_PATTERNS.filter(pattern => pattern.test(sample)).length;
  return hits >= 2;
}

/** Drop leading planning paragraphs and start at the first publishable block. */
export function extractPublishableContent(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;

  const lines = trimmed.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]?.trim() ?? '';
    if (!line || isMetaLine(line)) continue;
    if (line.startsWith('# ') && line.length > 2) {
      return lines.slice(i).join('\n').trim();
    }
  }

  const paragraphs = trimmed.split(/\n\n+/);
  const startIndex = paragraphs.findIndex(paragraph => !isMetaParagraph(paragraph));
  if (startIndex > 0) {
    return paragraphs.slice(startIndex).join('\n\n').trim();
  }

  const cleanedLines: string[] = [];
  let started = false;
  for (const line of lines) {
    if (!started && isMetaLine(line)) continue;
    started = true;
    cleanedLines.push(line);
  }

  return cleanedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

export function stripPlaceholderLines(text: string): string {
  return text
    .split('\n')
    .filter(line => !PLACEHOLDER_LINE_RE.test(line.trim()))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Replace em/en-dash asides with commas so copy reads less like AI template prose. */
export function humanizePunctuation(text: string): string {
  return text
    .split('\n')
    .map(line =>
      line
        .replace(/\s*[—–]\s*/g, ', ')
        .replace(/,\s+,/g, ', ')
        .replace(/,\s*\./g, '.')
        .replace(/ {2,}/g, ' ')
        .trimEnd()
    )
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
