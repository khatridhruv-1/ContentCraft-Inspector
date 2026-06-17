/**
 * Reorders markdown for editorial preview: lead paragraphs first, then the
 * main title as a centered section heading (AMU-style article layout).
 */
export function restructureEditorialPreview(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) return trimmed;

  const h1Match = trimmed.match(/^#\s+(.+?)\s*$/m);
  if (!h1Match) return trimmed;

  const title = h1Match[1].trim();
  const afterH1 = trimmed.replace(/^#\s+.+?\s*\n+/, '');

  const sectionSplit = afterH1.match(/^([\s\S]*?)(\n##\s+[\s\S]*)$/);
  if (!sectionSplit) {
    const introOnly = afterH1.trim();
    if (introOnly && !introOnly.startsWith('##')) {
      return `${introOnly}\n\n## ${title}\n`;
    }
    return trimmed;
  }

  const intro = sectionSplit[1].trim();
  const rest = sectionSplit[2].trim();

  if (!intro || intro.startsWith('##')) {
    return trimmed;
  }

  return `${intro}\n\n## ${title}\n\n${rest}`;
}
