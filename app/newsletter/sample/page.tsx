import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BlogCreatorNavBrand from '@/components/brand/BlogCreatorNavBrand';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { NEWSLETTER_SAMPLE_ISSUE } from '@/lib/newsletter/sampleIssue';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import {
  marketingAccentSpan,
  marketingFocusRing,
  marketingGlassCard,
  marketingMutedLink,
  marketingPageClass,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Sample Issue — BlogCreator Daily',
  description:
    'Read a sample BlogCreator Daily newsletter issue — trending topics written in a clear practitioner voice.',
  alternates: { canonical: absoluteUrl('/newsletter/sample') },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Sample Issue — BlogCreator Daily',
    description:
      'Read a sample BlogCreator Daily newsletter issue — trending topics written in a clear practitioner voice.',
    type: 'article',
    url: absoluteUrl('/newsletter/sample'),
    siteName: 'BlogCreator',
  },
};

export default function NewsletterSamplePage() {
  const issue = NEWSLETTER_SAMPLE_ISSUE;

  return (
    <div className={cn('min-h-screen bg-slate-50', marketingPageClass)}>
      <header className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <Link
            href="/#newsletter"
            className={cn(
              'inline-flex items-center gap-2 text-sm rounded-md',
              marketingMutedLink,
              marketingFocusRing
            )}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back to newsletter
          </Link>
          <Link href="/" className={marketingFocusRing} aria-label="BlogCreator home">
            <BlogCreatorNavBrand />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 md:py-14">
        <p className="text-sm font-medium text-violet-700">BlogCreator Daily — sample issue</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {issue.topic}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{issue.date}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {issue.keywords.map(keyword => (
            <span
              key={keyword}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600"
            >
              {keyword}
            </span>
          ))}
        </div>

        <article className={cn(marketingGlassCard, 'mt-8 space-y-6 p-6 md:p-8')}>
          <p className="text-base leading-relaxed text-slate-700">{issue.intro}</p>

          {issue.sections.map(section => (
            <section key={section.heading}>
              <h2 className="text-lg font-bold text-slate-900">{section.heading}</h2>
              <p className="mt-2 text-base leading-relaxed text-slate-700">{section.body}</p>
            </section>
          ))}

          <p className="border-t border-slate-200 pt-6 text-sm italic text-slate-600">
            {issue.closing}
          </p>
        </article>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/#newsletter" className={marketingFocusRing}>
            <MarketingPrimaryButton type="button" fullWidth={false}>
              Subscribe free
            </MarketingPrimaryButton>
          </Link>
          <Link
            href="/samples"
            className={cn('text-sm font-semibold text-violet-700 underline-offset-2 hover:underline', marketingFocusRing)}
          >
            See sample outputs
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
