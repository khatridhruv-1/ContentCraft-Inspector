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
