import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const renderers = {
  h1: ({ children }: any) => (
    <h1 style={{ fontSize:'1.45rem', fontWeight:800, margin:'0 0 12px', lineHeight:1.25 }} className="text-foreground">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 style={{ fontSize:'1.05rem', fontWeight:700, margin:'18px 0 6px', lineHeight:1.3 }} className="text-foreground">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 style={{ fontSize:'0.9rem', fontWeight:600, margin:'12px 0 4px', lineHeight:1.35 }} className="text-foreground">{children}</h3>
  ),
  p: ({ children }: any) => (
    <p style={{ fontSize:'0.85rem', margin:'0 0 10px', lineHeight:1.65 }} className="text-foreground">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul style={{ fontSize:'0.85rem', margin:'6px 0 10px', paddingLeft:'1.4rem' }} className="list-disc text-foreground">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol style={{ fontSize:'0.85rem', margin:'6px 0 10px', paddingLeft:'1.4rem' }} className="list-decimal text-foreground">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li style={{ fontSize:'0.85rem', marginBottom:'4px', lineHeight:1.6 }} className="text-foreground">{children}</li>
  ),
  strong: ({ children }: any) => (
    <strong style={{ fontWeight:700 }} className="text-foreground">{children}</strong>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-border pl-3 italic text-muted-foreground my-2 text-sm">{children}</blockquote>
  ),
  code: ({ children }: any) => (
    <code className="bg-secondary rounded px-1.5 py-0.5 text-xs font-mono">{children}</code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-secondary rounded-lg p-3 my-2 overflow-x-auto text-xs">{children}</pre>
  ),
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="w-full max-w-none">
      <ReactMarkdown
        components={renderers}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function convertMarkdownToPlainText(markdown: string): string {
  if (!markdown) return '';

  let plainText = markdown;

  // Preserve header hierarchy
  plainText = plainText.replace(/^# (.*)/gm, '--- $1 ---');
  plainText = plainText.replace(/^## (.*)/gm, '-- $1 --');
  plainText = plainText.replace(/^### (.*)/gm, '- $1 -');

  // Convert bold and italic
  plainText = plainText.replace(/(\*\*|__)(.*?)\1/g, '$2 (bold)');
  plainText = plainText.replace(/(\*|_)(.*?)\1/g, '$2 (italic)');

  // Convert links
  plainText = plainText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1 (link)');

  // Handle lists
  plainText = plainText.replace(/^[-*+]\s*(.*)$/gm, '• $1');
  plainText = plainText.replace(/^\d+\.\s*(.*)$/gm, '1. $1');

  // Remove code blocks
  plainText = plainText.replace(/```[\s\S]*?```/g, '[Code Block]');
  plainText = plainText.replace(/`([^`]+)`/g, '[$1]');

  // Trim multiple newlines
  plainText = plainText.replace(/\n{3,}/g, '\n\n');

  return plainText.trim();
}

export function getDownloadableContent(content: string, format: 'docx' | 'pdf' = 'docx') {
  const plainText = convertMarkdownToPlainText(content);
  
  if (format === 'pdf') {
    return plainText;
  }
  
  // For DOCX, we'll preserve some basic formatting
  return content.split('\n').map(line => {
    // Handle headers
    if (line.startsWith('# ')) return line.replace('# ', '').toUpperCase();
    if (line.startsWith('## ')) return line.replace('## ', '');
    return line;
  }).join('\n');
}