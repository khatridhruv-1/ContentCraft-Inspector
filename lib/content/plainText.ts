/** Strip HTML to plain text suitable for AI analysis APIs. */
export function htmlToPlainText(html: string): string {
  if (!html?.trim()) return '';

  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export const ANALYSIS_MAX_PLAIN_CHARS = 10_000;
export const ANALYSIS_MIN_PLAIN_CHARS = 20;

export function normalizeAnalysisInput(raw: string): string {
  return htmlToPlainText(raw);
}
