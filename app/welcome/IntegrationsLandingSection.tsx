'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Plug, Sparkles, Terminal } from 'lucide-react';
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

const HIGHLIGHT_ICONS = {
  mcp: Plug,
  skill: Sparkles,
  api: Code2,
} as const;

const HIGHLIGHT_STYLES = {
  mcp: { iconSurface: 'bg-violet-100', iconColor: 'text-violet-700' },
  skill: { iconSurface: 'bg-sky-50', iconColor: 'text-sky-700' },
  api: { iconSurface: 'bg-emerald-50', iconColor: 'text-emerald-700' },
} as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function IntegrationsLandingSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="integrations"
      data-testid="landing-integrations"
      className="relative scroll-mt-24 px-6 py-14 md:py-20"
      aria-labelledby="integrations-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: MARKETING_EASE }}
          className="mb-12 text-center"
        >
          <span className={cn('mb-4', marketingEyebrow)}>Developer integrations</span>
          <h2 id="integrations-heading" className={marketingSectionTitle}>
            Embed AI content generation{' '}
            <span className={marketingAccentSpan}>in your workflow</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            ContentCraft Inspector is not just a web app — install an MCP tool, add a Cursor skill,
            or call our REST API to generate SEO content and run analysis from Cursor, Claude
            Desktop, your codebase, or any project.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5"
        >
          {INTEGRATION_LANDING_HIGHLIGHTS.map(item => {
            const Icon = HIGHLIGHT_ICONS[item.id];
            const styles = HIGHLIGHT_STYLES[item.id];

            return (
              <motion.article
                key={item.id}
                variants={card}
                whileHover={reduced ? undefined : { y: -2 }}
                className={cn(
                  marketingGlassCard,
                  'flex flex-col p-5 transition-colors duration-300 hover:border-slate-300 md:p-6'
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl',
                      styles.iconSurface,
                      styles.iconColor
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {item.tag}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>

                <ul className="space-y-2 border-t border-slate-100 pt-4">
                  {item.bullets.map(bullet => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: MARKETING_EASE }}
          className={cn(marketingGlassCard, 'p-6 md:p-8')}
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Terminal className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-slate-900">Install in one CLI command</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                No manual config files. Run the installer to add the MCP server or Cursor skill to
                your machine or project. Set{' '}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-800">
                  CONTENTCRAFT_API_URL
                </code>{' '}
                to your deployment and start generating from any workspace.
              </p>
            </div>
            <Link
              href="/integrate"
              className={cn(
                'inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50',
                marketingFocusRing
              )}
            >
              Full setup guide
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <CliCommandBlock command={INTEGRATION_LANDING_CLI} label="Quick start — MCP (global)" />
        </motion.div>
      </div>
    </section>
  );
}
