'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { restructureEditorialPreview } from '@/lib/dashboard/blogPreviewTransform';
import { cn } from '@/lib/utils';

type BlogArticlePreviewProps = {
  content: string;
  className?: string;
};

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

function headingText(children?: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(child => (typeof child === 'string' ? child : '')).join('');
  }
  return '';
}

function PreviewAnchor({
  children,
  href,
}: {
  children?: React.ReactNode;
  href?: string;
}) {
  const resolved = resolveMarkdownHref(href);
  const opensExternally = Boolean(resolved?.startsWith('http'));

  return (
    <a
      href={resolved}
      className="font-sans text-[#2b6cb0] underline decoration-[#2b6cb0] underline-offset-2 transition-colors hover:text-[#1e4f8a]"
      {...(opensExternally ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

/** Large centered section heading (AMU-style). */
const sectionHeadingClass =
  'my-10 text-center font-sans text-[1.65rem] font-bold uppercase leading-[1.15] tracking-normal text-black first:mt-4 md:my-12 md:text-[2rem]';

/** Subsection heading under a major section. */
const subHeadingClass =
  'my-8 text-center font-sans text-[1.25rem] font-bold uppercase leading-[1.2] tracking-normal text-black md:text-[1.4rem]';

const bodyClass =
  'mb-5 text-left font-sans text-[15px] leading-[1.65] text-[#1a1a1a] md:text-[16px]';

const previewRenderers = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h2 className={sectionHeadingClass}>{children}</h2>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => {
    const text = headingText(children);
    const isKeyTakeaways = /key takeaways/i.test(text);

    if (isKeyTakeaways) {
      return (
        <h2 className="mb-4 mt-10 text-center font-sans text-[1.15rem] font-bold uppercase tracking-normal text-black md:text-[1.25rem]">
          {children}
        </h2>
      );
    }

    return <h2 className={sectionHeadingClass}>{children}</h2>;
  },
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className={subHeadingClass}>{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className={bodyClass}>{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className={cn(bodyClass, 'mb-6 list-disc space-y-2 pl-6')}>{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className={cn(bodyClass, 'mb-6 list-decimal space-y-2 pl-6')}>{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="pl-1 marker:text-[#444]">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-6 border-l-4 border-slate-300 pl-5 font-sans text-[#333]">
      {children}
    </blockquote>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold text-black">{children}</strong>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <PreviewAnchor href={href}>{children}</PreviewAnchor>
  ),
};

export default function BlogArticlePreview({ content, className }: BlogArticlePreviewProps) {
  const editorial = restructureEditorialPreview(content);
  const normalized = editorial.replace(/\n/g, '\n\n');

  return (
    <div
      className={cn('blog-article-preview w-full font-sans text-[#1a1a1a]', className)}
      itemScope
      itemType="https://schema.org/Article"
    >
      <ReactMarkdown components={previewRenderers} remarkPlugins={[remarkGfm]}>
        {normalized}
      </ReactMarkdown>
    </div>
  );
}
