import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import { BLOG_POSTS, getBlogPost } from '@/lib/marketing/blogPosts';
import {
  MARKETING_PAGE_GRADIENT,
  marketingPageClass,
} from '@/lib/marketing/marketingTheme';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { cn } from '@/lib/utils';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post not found — BlogCreator' };
  return {
    title: `${post.title} — BlogCreator`,
    description: post.excerpt,
    alternates: { canonical: absoluteUrl(`/blog/${slug}`) },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/blog" className="text-sm font-medium text-violet-700 hover:underline">
          ← All articles
        </Link>
        <p className="mt-6 text-xs text-slate-500">
          {post.date} · {post.readMinutes} min read
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          {post.title}
        </h1>
        <div className="prose-legal mt-8 space-y-4 text-base leading-relaxed text-slate-700">
          {post.body.split('\n\n').map((block, i) => {
            if (block.startsWith('**') && block.endsWith('**')) {
              return (
                <p key={i} className="font-semibold text-slate-900">
                  {block.replace(/\*\*/g, '')}
                </p>
              );
            }
            return <p key={i}>{block}</p>;
          })}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
