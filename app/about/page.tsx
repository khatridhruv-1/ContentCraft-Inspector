import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
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
  title: 'About — BlogCreator',
  description: 'BlogCreator builds platform-first AI content tools for practitioners — website, LinkedIn, Quora, Medium, and Substack.',
  alternates: { canonical: absoluteUrl('/about') },
};

export default function AboutPage() {
  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className={marketingSectionTitle}>
          About <span className={marketingAccentSpan}>BlogCreator</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          BlogCreator is a free AI content workspace for practitioners who publish across multiple
          platforms. We believe destination-first generation — pick where the piece will live, then
          draft with live keywords and SEO scoring — beats generic chat output every time.
        </p>

        <section className={cn(marketingGlassCard, 'mt-8 p-6 md:p-8')}>
          <h2 className="text-lg font-bold text-slate-900">What we ship</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Five-platform AI generation (website, LinkedIn, Quora, Medium, Substack)</li>
            <li>Keyword discovery and deep SEO analysis</li>
            <li>MCP tool, agent skill, and REST API for developer workflows</li>
            <li>BlogCreator Daily — a practitioner newsletter on AI-assisted publishing</li>
          </ul>
        </section>

        <section className={cn(marketingGlassCard, 'mt-6 p-6 md:p-8')}>
          <h2 className="text-lg font-bold text-slate-900">Mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Help small teams compete with bigger content budgets through specificity, platform-native
            drafts, and honest tooling — not generic AI filler.
          </p>
        </section>

        <p className="mt-8 text-sm text-slate-600">
          Questions?{' '}
          <Link href="/contact" className="font-semibold text-violet-700 underline-offset-2 hover:underline">
            Contact us
          </Link>
          {' · '}
          <Link href="/changelog" className="font-semibold text-violet-700 underline-offset-2 hover:underline">
            See what shipped recently
          </Link>
        </p>
      </main>

      <MarketingFooter />
    </div>
  );
}
