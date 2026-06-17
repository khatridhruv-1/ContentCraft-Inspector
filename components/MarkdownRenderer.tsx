import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

type MarkdownRendererProps = {
  content: string;
  /** light = history modals; dark = legacy dashboard; studio = full-width workspace preview */
  variant?: 'light' | 'dark' | 'studio';
  className?: string;
};

/** Legacy drafts used /blog/slug links that don't exist — send readers to a relevant web search. */
function resolveMarkdownHref(href?: string): string | undefined {
  if (!href) return undefined;
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('/blog/')) {
    const slug = href.replace(/^\/blog\//, '').replace(/\/$/, '');
    if (!slug) return href;
    return `https://www.google.com/search?q=${encodeURIComponent(slug.replace(/-/g, ' '))}`;
  }
  return href;
}

function MarkdownAnchor({
  children,
  href,
  className,
}: {
  children?: React.ReactNode;
  href?: string;
  className: string;
}) {
  const resolved = resolveMarkdownHref(href);
  const opensExternally = Boolean(resolved?.startsWith('http'));

  return (
    <a
      href={resolved}
      className={className}
      {...(opensExternally
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    >
      {children}
    </a>
  );
}

const lightRenderers = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-6 mt-8 text-4xl font-extrabold text-gray-900">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-4 mt-6 text-2xl font-bold text-gray-800">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-3 mt-5 text-xl font-bold text-gray-700">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 text-lg leading-relaxed text-gray-700">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-4 ml-8 list-disc space-y-2">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-4 ml-8 list-decimal space-y-2">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-lg leading-relaxed text-gray-700">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-4 border-l-4 border-gray-300 pl-4 italic text-gray-600">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">{children}</code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-4 overflow-x-auto rounded-lg bg-gray-100 p-4">{children}</pre>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <MarkdownAnchor href={href} className="text-blue-600 underline hover:text-blue-800">
      {children}
    </MarkdownAnchor>
  ),
};

const darkRenderers = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-5 mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-3 mt-8 text-2xl font-semibold text-white/95">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-2 mt-6 text-xl font-semibold text-white/90">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-4 text-[17px] leading-[1.75] text-white/80">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-white/80">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-white/80">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-[17px] leading-[1.75] text-white/80">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-4 border-l-4 border-violet-500/40 pl-4 italic text-white/65">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-violet-200">
      {children}
    </code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-4 overflow-x-auto rounded-lg border border-white/10 bg-[#141418] p-4 text-white/85">
      {children}
    </pre>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <MarkdownAnchor href={href} className="text-violet-400 underline hover:text-violet-300">
      {children}
    </MarkdownAnchor>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
};

export default function MarkdownRenderer({
  content,
  variant = 'light',
  className,
}: MarkdownRendererProps) {
  const isDark = variant === 'dark';
  const isStudio = variant === 'studio';

  const variantClass = isDark
    ? 'max-w-none'
    : isStudio
      ? 'prose prose-slate w-full max-w-none prose-p:max-w-none prose-headings:max-w-none'
      : 'prose prose-lg max-h-[70vh] max-w-none flex-1 overflow-y-auto p-8 leading-relaxed text-gray-800';

  return (
    <div className={cn(variantClass, className)}>
      <ReactMarkdown
        components={isDark ? darkRenderers : lightRenderers}
        remarkPlugins={[remarkGfm]}
      >
        {content.replace(/\n/g, '\n\n')}
      </ReactMarkdown>
    </div>
  );
}

export function convertMarkdownToPlainText(markdown: string): string {
  if (!markdown) return '';

  let plainText = markdown;

  plainText = plainText.replace(/^# (.*)/gm, '--- $1 ---');
  plainText = plainText.replace(/^## (.*)/gm, '-- $1 --');
  plainText = plainText.replace(/^### (.*)/gm, '- $1 -');
  plainText = plainText.replace(/(\*\*|__)(.*?)\1/g, '$2 (bold)');
  plainText = plainText.replace(/(\*|_)(.*?)\1/g, '$2 (italic)');
  plainText = plainText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1 (link)');
  plainText = plainText.replace(/^[-*+]\s*(.*)$/gm, '• $1');
  plainText = plainText.replace(/^\d+\.\s*(.*)$/gm, '1. $1');
  plainText = plainText.replace(/```[\s\S]*?```/g, '[Code Block]');
  plainText = plainText.replace(/`([^`]+)`/g, '[$1]');
  plainText = plainText.replace(/\n{3,}/g, '\n\n');

  return plainText.trim();
}

export function getDownloadableContent(content: string, format: 'docx' | 'pdf' = 'docx') {
  const plainText = convertMarkdownToPlainText(content);

  if (format === 'pdf') {
    return plainText;
  }

  return content
    .split('\n')
    .map(line => {
      if (line.startsWith('# ')) return line.replace('# ', '').toUpperCase();
      if (line.startsWith('## ')) return line.replace('## ', '');
      return line;
    })
    .join('\n');
}
