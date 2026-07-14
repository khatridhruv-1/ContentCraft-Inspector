'use client';

import Link from 'next/link';
import { ArrowRight, Plug, Sparkles, Terminal } from 'lucide-react';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import { INTEGRATION_HERO_SUBTITLE } from '@/lib/marketing/integrationContent';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGlassCard,
  marketingLandingSection,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const TEASER_POINTS = [
  { icon: Plug, label: 'MCP tools for any agent' },
  { icon: Sparkles, label: 'Cross-platform agent skill' },
  { icon: Terminal, label: 'REST API — no local keys' },
] as const;

export default function LandingIntegrationsTeaser() {
  return (
    <section
      id="integrations"
      className={marketingLandingSection}
      aria-labelledby="integrations-heading"
    >
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal className={marketingSectionHeader}>
          <span className={marketingEyebrow}>AI agent integrations</span>
          <h2 id="integrations-heading" className={marketingSectionTitle}>
            One command for{' '}
            <span className={marketingAccentSpan}>Cursor, Claude &amp; more</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            {INTEGRATION_HERO_SUBTITLE}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <div
            className={cn(
              marketingGlassCard,
              'flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:text-left md:p-8'
            )}
          >
            <ul className="flex flex-1 flex-col gap-2 text-sm text-slate-700">
              {TEASER_POINTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
            <Link
              href="/integrate"
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50',
                marketingFocusRing
              )}
            >
              Open setup guide
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
