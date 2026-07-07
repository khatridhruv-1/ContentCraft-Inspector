/** Matches a line whose entire content (after trimming) is a shell/template placeholder like $1, $2, $99. */
const PLACEHOLDER_LINE_RE = /^\$\d+$/;

const META_LINE_PATTERNS = [
  /^we need to (?:write|produce|create|draft|output|ensure)\b/i,
  /^let'?s (?:aim|craft|write|count|draft)\b/i,
  /^we'?ll (?:count|write|draft)\b/i,
  /^the spec says/i,
  /^need to cover\b/i,
  /^first \d+ lines must\b/i,
  /^title line not counted/i,
  /^title (?:line|should be)/i,
  /^word count\b/i,
  /^word count estimate/i,
  /^word count approx/i,
  /^structure:\s/i,
  /^so we need\b/i,
  /^we should\b/i,
  /^i (?:will|need to)\b/i,
  /^must be \d+[-–]\d+ words/i,
  /^no em-dashes\b/i,
  /^use short paragraphs\b/i,
  /^paragraph_count:/i,
  /^hook line \d+/i,
  /^paragraph \d+:/i,
  /^section heading\b/i,
  /^then (?:first|blank|sections)\b/i,
  /^then blank line\.?$/i,
  /^blank line\.?$/i,
  /^then sections\.?$/i,
  /^now (?:section|next|paragraph|closing)\b/i,
  /^hashtags line:/i,
  /^count:/i,
  /^second:/i,
  /^we'?ll count\b/i,
  /^let'?s count\b/i,
  /^=+\d*$/,
  /^\(sentence \d+\)$/i,
  /^could be "/i,
  /^ensure no markdown\b/i,
  /^title or opening line/i,
  /^we'?ll write\b/i,
  /^thus we have\b/i,
  /^we must not use markdown\b/i,
  /^line\d+:\s*$/i,
  /^paragraph\(s\)/i,
  /^now count words/i,
  /^i'?ll write full article\b/i,
  /^write:$/i,
  /^so we can use plain headings\b/i,
  /^we can use plain headings\b/i,
  /^must not use markdown\b/i,
  /^paragraph\(s\)\.\.\./i,
  /^i'?ll write\b/i,
  /^then count\b/i,
];

const META_BODY_PATTERNS = [
  /\bwe need to (?:write|produce|create|output)\b/i,
  /\bword count(?:\s|:)/i,
  /\bword count estimate\b/i,
  /\bword count approx\b/i,
  /\blet'?s aim ~?\d+/i,
  /\blet'?s (?:craft|write|draft|count)\b/i,
  /\bthe spec says\b/i,
  /\bmust be \d+[-–]\d+ words\b/i,
  /\btitle line not counted\b/i,
  /\bfirst \d+ lines must hook\b/i,
  /\bhook line \d+/i,
  /\bparagraph \d+:/i,
  /\bthen blank line\b/i,
  /\bno planning notes\b/i,
  /\bplanning notes\b/i,
  /\b\(sentence \d+\)/i,
  /\bnow section heading\b/i,
  /\bhashtags line:/i,
  /\bthus we have\b/i,
  /\bline\d+:/i,
  /\bnow count words\b/i,
  /\bi'?ll write full article\b/i,
  /\bwe must not use markdown\b/i,
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
  if (/word count/.test(lower)) return true;
  if (/\(sentence \d+\)/.test(trimmed)) return true;
  if (/^count:/i.test(trimmed)) return true;
  if (/=+\d*$/.test(trimmed.replace(/\s/g, ''))) return true;

  return false;
}

function countMetaLines(text: string): number {
  return text.split('\n').filter(line => isMetaLine(line.trim())).length;
}

/** Detect model planning/reasoning leaked into the published draft. */
export function isMetaLeak(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  const lines = trimmed.split('\n').map(line => line.trim()).filter(Boolean);
  const firstLine = lines[0] ?? '';
  if (isMetaLine(firstLine)) return true;

  const openingLines = lines.slice(0, 4).join(' ');
  if (META_BODY_PATTERNS.filter(pattern => pattern.test(openingLines)).length >= 1) {
    return true;
  }

  const sample = trimmed.slice(0, 1200);
  const bodyHits = META_BODY_PATTERNS.filter(pattern => pattern.test(sample)).length;
  if (bodyHits >= 2) return true;

  const nonEmptyLines = lines.length;
  if (nonEmptyLines > 0 && countMetaLines(trimmed) / nonEmptyLines >= 0.25) {
    return true;
  }

  const quotedSentenceCount = (sample.match(/["“][^"”\n]{20,}["”]/g) ?? []).length;
  if (quotedSentenceCount >= 2 && bodyHits >= 1) return true;

  return false;
}

function unwrapScriptLine(line: string): string | null {
  const trimmed = line.trim();
  const quoted = trimmed.match(
    /^(?:title line|hook line \d+|paragraph \d+|section heading(?:\s+\w+)?|closing reflection question|hashtags line):\s*["“](.+?)["”]\s*$/i
  );
  if (quoted?.[1]) return quoted[1].trim();

  const inlineQuote = trimmed.match(/^["“](.+?)["”](?:\s*\(sentence \d+\))?\s*$/);
  if (inlineQuote?.[1] && inlineQuote[1].length >= 20) return inlineQuote[1].trim();

  const lineNumbered = trimmed.match(/^line\d+:\s*(.+)$/i);
  if (lineNumbered?.[1]) return lineNumbered[1].trim();

  const boldHeading = trimmed.match(/^section heading[^:]*:\s*\*\*(.+?)\*\*\s*$/i);
  if (boldHeading?.[1]) return `**${boldHeading[1].trim()}**`;

  const bareBold = trimmed.match(/^\*\*(.+?)\*\*\s*(?:\(heading[^)]*\))?$/i);
  if (bareBold?.[1] && bareBold[1].length >= 8) return `**${bareBold[1].trim()}**`;

  return null;
}

function looksLikePublishableLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || isMetaLine(trimmed)) return false;
  if (/^line\d+:\s*$/i.test(trimmed)) return false;
  if (/^paragraph\(s\)/i.test(trimmed)) return false;
  if (/^write:$/i.test(trimmed)) return false;
  if (META_BODY_PATTERNS.some(pattern => pattern.test(trimmed))) return false;
  if (trimmed.length < 12) return false;
  return true;
}

function findPublishableStartIndex(lines: string[]): number {
  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i]?.trim() ?? '';
    const next = lines[i + 1]?.trim() ?? '';
    if (looksLikePublishableLine(current) && looksLikePublishableLine(next)) {
      return i;
    }
    if (
      looksLikePublishableLine(current) &&
      (current.startsWith('# ') || /^[A-Z]/.test(current)) &&
      current.split(/\s+/).length >= 4
    ) {
      return i;
    }
  }
  return -1;
}

function extractEmbeddedPublishableContent(text: string): string | null {
  const blocks: { index: number; text: string }[] = [];

  const quoteRe = /["“]([^"”\n]{12,}?)["”]/g;
  let match: RegExpExecArray | null;
  while ((match = quoteRe.exec(text)) !== null) {
    const sentence = match[1].trim();
    if (isMetaLine(sentence)) continue;
    const looksLikeTitle = /^[A-Z]/.test(sentence) && sentence.split(/\s+/).length >= 4;
    if (/[.!?]$/.test(sentence) || sentence.startsWith('#') || looksLikeTitle) {
      blocks.push({ index: match.index, text: sentence });
    }
  }

  const boldRe = /\*\*([^*\n]{8,}?)\*\*/g;
  while ((match = boldRe.exec(text)) !== null) {
    const heading = match[1].trim();
    if (!isMetaLine(heading)) {
      blocks.push({ index: match.index, text: `**${heading}**` });
    }
  }

  if (blocks.length < 2) return null;

  blocks.sort((a, b) => a.index - b.index);
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const block of blocks) {
    if (seen.has(block.text)) continue;
    seen.add(block.text);
    ordered.push(block.text);
  }

  const assembled = ordered.join('\n\n').trim();
  return assembled.length >= 80 ? assembled : null;
}

/** Drop leading planning paragraphs and start at the first publishable block. */
export function extractPublishableContent(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;

  const lines = trimmed.split('\n');
  const startAt = findPublishableStartIndex(lines);
  if (startAt > 0) {
    const sliced = lines.slice(startAt).join('\n').trim();
    if (sliced && !isMetaLeak(sliced)) return sliced;
    if (sliced) {
      const reprocessed = extractPublishableContent(sliced);
      if (reprocessed.trim()) return reprocessed;
    }
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]?.trim() ?? '';
    if (!line || isMetaLine(line)) continue;
    if (line.startsWith('# ') && line.length > 2) {
      return lines.slice(i).join('\n').trim();
    }
  }

  const rebuilt: string[] = [];
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (rebuilt.length > 0 && rebuilt[rebuilt.length - 1] !== '') {
        rebuilt.push('');
      }
      continue;
    }
    const unwrapped = unwrapScriptLine(trimmedLine);
    if (unwrapped) {
      rebuilt.push(unwrapped);
      continue;
    }

    if (isMetaLine(trimmedLine)) continue;

    if (/^---+$/.test(trimmedLine)) continue;
    if (/\(sentence \d+\)/.test(trimmedLine)) continue;
    if (/^count:/i.test(trimmedLine)) continue;
    if (/=+\d*$/.test(trimmedLine.replace(/\s/g, ''))) continue;

    rebuilt.push(trimmedLine);
  }

  let cleaned = rebuilt.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const embedded = extractEmbeddedPublishableContent(trimmed);
  const cleanedWords = cleaned ? cleaned.split(/\s+/).filter(Boolean).length : 0;
  const embeddedWords = embedded ? embedded.split(/\s+/).filter(Boolean).length : 0;

  if (embedded && embeddedWords > cleanedWords) {
    return embedded;
  }

  if (cleaned && !isMetaLeak(cleaned)) return cleaned;
  if (embedded) return embedded;

  const paragraphs = trimmed.split(/\n\n+/);
  const startIndex = paragraphs.findIndex(paragraph => !isMetaParagraph(paragraph));
  if (startIndex > 0) {
    cleaned = paragraphs.slice(startIndex).join('\n\n').trim();
    if (cleaned) return cleaned;
  }

  return cleaned || trimmed;
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
