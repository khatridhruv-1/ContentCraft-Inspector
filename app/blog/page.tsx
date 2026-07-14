import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import { BLOG_POSTS } from '@/lib/marketing/blogPosts';
import {
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingGlassCard,
  marketingPageClass,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog — BlogCreator',
  description: 'SEO and content workflow articles from the BlogCreator team.',
  alternates: { canonical: absoluteUrl('/blog') },
};

export default function BlogIndexPage() {
  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className={marketingSectionTitle}>
          Content <span className={marketingAccentSpan}>insights</span>
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Practical notes on platform-first AI, SEO workflows, and publishing without generic filler.
        </p>

        <ul className="mt-10 space-y-4">
          {BLOG_POSTS.map(post => (
            <li key={post.slug}>
              <article className={cn(marketingGlassCard, 'p-5 md:p-6')}>
                <p className="text-xs text-slate-500">
                  {post.date} · {post.readMinutes} min read
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{post.excerpt}</p>
              </article>
            </li>
          ))}
        </ul>
      </main>

      <MarketingFooter />
    </div>
  );
}
