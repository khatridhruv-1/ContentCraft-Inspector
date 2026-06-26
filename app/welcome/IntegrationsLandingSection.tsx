'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Plug, Sparkles, Terminal } from 'lucide-react';
import CliCommandBlock from '@/components/integrate/CliCommandBlock';
import ScrollReveal, { alternateScrollDirection } from '@/components/marketing/ScrollReveal';
import {
  INTEGRATION_HERO_EYEBROW,
  INTEGRATION_HERO_SUBTITLE,
  INTEGRATION_HERO_TITLE,
  INTEGRATION_HERO_TITLE_ACCENT,
  INTEGRATION_LANDING_HIGHLIGHTS,
  integrationInstallCommand,
} from '@/lib/marketing/integrationContent';
import { useIntegrationApiUrl } from '@/hooks/useIntegrationApiUrl';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGlassCard,
  marketingLandingSection,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { scrollRevealProps } from '@/lib/marketing/scrollReveal';
import { cn } from '@/lib/utils';

const HIGHLIGHT_ICONS = { mcp: Plug, skill: Sparkles } as const;
const HIGHLIGHT_STYLES = {
  mcp: { iconSurface: 'bg-violet-100', iconColor: 'text-violet-700' },
  skill: { iconSurface: 'bg-sky-50', iconColor: 'text-sky-700' },
} as const;

export default function IntegrationsLandingSection() {
  const reduced = useReducedMotion();
  const apiUrl = useIntegrationApiUrl();
  const installCommand = integrationInstallCommand('mcp', apiUrl);

  return (
    <section
      id="integrations"
      data-testid="landing-integrations"
      className={marketingLandingSection}
      aria-labelledby="integrations-heading"
    >
      <div className="mx-auto max-w-4xl">
        <ScrollReveal direction="up" className={marketingSectionHeader}>
          <span className={cn('mb-4', marketingEyebrow)}>{INTEGRATION_HERO_EYEBROW}</span>
          <h2 id="integrations-heading" className={marketingSectionTitle}>
            Use ContentCraft in{' '}
            <span className={marketingAccentSpan}>{INTEGRATION_HERO_TITLE_ACCENT}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{INTEGRATION_HERO_SUBTITLE}</p>
        </ScrollReveal>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {INTEGRATION_LANDING_HIGHLIGHTS.map((item, index) => {
            const Icon = HIGHLIGHT_ICONS[item.id];
            const styles = HIGHLIGHT_STYLES[item.id];
            return (
              <motion.article
                key={item.id}
                {...scrollRevealProps(alternateScrollDirection(index), {
                  delay: index * 0.1,
                  reduced,
                })}
                whileHover={reduced ? undefined : { y: -2 }}
                className={cn(marketingGlassCard, 'p-5 md:p-6')}
              >
                <div
                  className={cn(
                    'mb-3 flex h-10 w-10 items-center justify-center rounded-xl',
                    styles.iconSurface,
                    styles.iconColor
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              </motion.article>
            );
          })}
        </div>

        <ScrollReveal direction="up" delay={0.12} className={cn(marketingGlassCard, 'p-6')}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-slate-600" aria-hidden />
              <span className="font-semibold text-slate-900">One-command install</span>
            </div>
            <Link
              href="/integrate"
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900',
                marketingFocusRing
              )}
            >
              Skill option
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <CliCommandBlock command={installCommand} />
        </ScrollReveal>
      </div>
    </section>
  );
}
