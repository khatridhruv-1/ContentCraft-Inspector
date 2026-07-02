/** Matches a line whose entire content (after trimming) is a shell/template placeholder like $1, $2, $99. */
const PLACEHOLDER_LINE_RE = /^\$\d+$/;

export function countPlaceholderLines(text: string): number {
  return text.split('\n').filter(line => PLACEHOLDER_LINE_RE.test(line.trim())).length;
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
