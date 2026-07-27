import { Fragment, type ReactNode } from 'react';

const INLINE_MARKDOWN_RE = /\*\*(.+?)\*\*|\*(.+?)\*/g;

/** Renders inline `**bold**` and `*italic*` within a text block. */
export function renderInlineMarkdown(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = INLINE_MARKDOWN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-slate-900">
          {match[1]}
        </strong>
      );
    } else if (match[2]) {
      parts.push(<em key={`i-${match.index}`}>{match[2]}</em>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (parts.length === 0) return text;
  if (parts.length === 1) return parts[0];

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}

/** Full bold paragraph when the entire block is wrapped in `**`. */
export function isFullBoldBlock(block: string): boolean {
  return block.startsWith('**') && block.endsWith('**') && block.length > 4;
}
