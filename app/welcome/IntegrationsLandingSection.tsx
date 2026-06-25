'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Plug, Sparkles, Terminal } from 'lucide-react';
import CliCommandBlock from '@/components/integrate/CliCommandBlock';
import {
  INTEGRATION_LANDING_CLI,
  INTEGRATION_LANDING_HIGHLIGHTS,
} from '@/lib/marketing/integrationContent';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGlassCard,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const HIGHLIGHT_ICONS = { mcp: Plug, skill: Sparkles } as const;
const HIGHLIGHT_STYLES = {
  mcp: { iconSurface: 'bg-violet-100', iconColor: 'text-violet-700' },
  skill: { iconSurface: 'bg-sky-50', iconColor: 'text-sky-700' },
} as const;

export default function IntegrationsLandingSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="integrations"
      data-testid="landing-integrations"
      className="relative scroll-mt-24 px-6 py-14 md:py-20"
      aria-labelledby="integrations-heading"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: MARKETING_EASE }}
          className="mb-10 text-center"
        >
          <span className={cn('mb-4', marketingEyebrow)}>Cursor integrations</span>
          <h2 id="integrations-heading" className={marketingSectionTitle}>
            Use ContentCraft in <span className={marketingAccentSpan}>Cursor</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            One CLI command. MCP tools or a cross-platform agent skill. No API keys on your machine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {INTEGRATION_LANDING_HIGHLIGHTS.map(item => {
            const Icon = HIGHLIGHT_ICONS[item.id];
            const styles = HIGHLIGHT_STYLES[item.id];
            return (
              <motion.article
                key={item.id}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: MARKETING_EASE }}
          className={cn(marketingGlassCard, 'p-6')}
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-slate-600" aria-hidden />
              <span className="font-semibold text-slate-900">MCP install</span>
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
          <CliCommandBlock command={INTEGRATION_LANDING_CLI} />
        </motion.div>
      </div>
    </section>
  );
}
