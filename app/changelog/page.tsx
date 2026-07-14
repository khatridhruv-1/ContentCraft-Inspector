import type { Metadata } from 'next';
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
  title: 'Changelog — BlogCreator',
  description: 'Recent product updates and improvements to BlogCreator.',
  alternates: { canonical: absoluteUrl('/changelog') },
};

const ENTRIES = [
  {
    date: '2026-07-14',
    title: 'Conversion & trust improvements',
    items: [
      'Pricing and samples pages',
      'Beta testimonials and case study',
      'Auth health check endpoint',
      'Expanded platform samples (5 channels)',
      'Header nav Samples + Pricing links',
    ],
  },
  {
    date: '2026-07-13',
    title: 'Visitor experience polish',
    items: [
      'Dashboard preview on landing',
      'Mobile hamburger navigation',
      'ChatGPT comparison table',
      'Newsletter sample issue',
      'Help troubleshooting section',
    ],
  },
  {
    date: '2026-06-01',
    title: 'Platform launch',
    items: [
      'Five-platform AI generation',
      'Keyword discovery and SEO analysis',
      'MCP tool and agent skill install',
      'Free tier for all users',
    ],
  },
] as const;

export default function ChangelogPage() {
  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className={marketingSectionTitle}>
          Product <span className={marketingAccentSpan}>changelog</span>
        </h1>
        <p className="mt-3 text-base text-slate-600">What shipped recently on BlogCreator.</p>

        <div className="mt-10 space-y-6">
          {ENTRIES.map(entry => (
            <article key={entry.date} className={cn(marketingGlassCard, 'p-5 md:p-6')}>
              <p className="text-xs font-semibold text-violet-600">{entry.date}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{entry.title}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {entry.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
