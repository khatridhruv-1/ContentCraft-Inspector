import type { Metadata } from 'next';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import {
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingPageClass,
  marketingGlassCard,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Status — BlogCreator',
  description: 'BlogCreator service status and uptime.',
  alternates: { canonical: absoluteUrl('/status') },
};

const SERVICES = [
  { name: 'Website & marketing pages', status: 'operational' },
  { name: 'Authentication', status: 'operational' },
  { name: 'AI generation API', status: 'operational' },
  { name: 'Newsletter delivery', status: 'operational' },
  { name: 'MCP / integrations', status: 'operational' },
] as const;

export default function StatusPage() {
  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className={marketingSectionTitle}>
          System <span className={marketingAccentSpan}>status</span>
        </h1>
        <p className="mt-3 text-emerald-700 font-semibold">All systems operational</p>
        <p className="mt-1 text-sm text-slate-500">Last checked: July 14, 2026</p>

        <ul className="mt-8 space-y-3">
          {SERVICES.map(s => (
            <li key={s.name} className={cn(marketingGlassCard, 'flex items-center justify-between px-4 py-3')}>
              <span className="text-sm font-medium text-slate-800">{s.name}</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-emerald-800">
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      </main>

      <MarketingFooter />
    </div>
  );
}
