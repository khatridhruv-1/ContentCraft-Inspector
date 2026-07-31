'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BlogCreatorNavBrand from '@/components/brand/BlogCreatorNavBrand';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { NEWSLETTER_SAMPLE_ISSUES } from '@/lib/newsletter/sampleIssue';
import {
  MARKETING_PAGE_GRADIENT,
  marketingFocusRing,
  marketingGlassCard,
  marketingMutedLink,
  marketingPageContainerTight,
  marketingPageClass,
  marketingSubpageMain,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function NewsletterSampleClient() {
  const searchParams = useSearchParams();
  const issueId = searchParams.get('issue') ?? NEWSLETTER_SAMPLE_ISSUES[0].id;
  const issue =
    NEWSLETTER_SAMPLE_ISSUES.find(i => i.id === issueId) ?? NEWSLETTER_SAMPLE_ISSUES[0];

  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <header className="border-b border-slate-200 bg-white/70 py-4 backdrop-blur-sm">
        <div className={cn(marketingPageContainerTight, 'flex items-center justify-between gap-4')}>
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

      <main className={marketingSubpageMain}>
        <p className="text-sm font-medium text-teal-700">BlogCreator Daily — sample archive</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {NEWSLETTER_SAMPLE_ISSUES.map(item => (
            <Link
              key={item.id}
              href={`/newsletter/sample?issue=${item.id}`}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium',
                item.id === issue.id
                  ? 'border-teal-300 bg-teal-50 text-teal-900'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                marketingFocusRing
              )}
            >
              {item.date}
            </Link>
          ))}
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
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
            className={cn(
              'text-sm font-semibold text-teal-700 underline-offset-2 hover:underline',
              marketingFocusRing
            )}
          >
            See sample outputs
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
