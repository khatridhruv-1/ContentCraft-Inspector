'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Plug, Sparkles, Terminal } from 'lucide-react';
import CliCommandBlock from '@/components/integrate/CliCommandBlock';
import ScrollReveal, { alternateScrollDirection } from '@/components/marketing/ScrollReveal';
import {
  INTEGRATION_API_ROUTES,
  INTEGRATION_HERO_SUBTITLE,
  INTEGRATION_LANDING_HIGHLIGHTS,
  INTEGRATION_LANDING_STEPS,
  INTEGRATION_MCP_TOOLS,
  integrationInstallCommand,
  integrationInstallCommandDisplay,
} from '@/lib/marketing/integrationContent';
import { useIntegrationApiUrl } from '@/hooks/useIntegrationApiUrl';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGlassCard,
  marketingLandingSection,
  marketingPageContainer,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { scrollRevealProps } from '@/lib/marketing/scrollReveal';
import { cn } from '@/lib/utils';

const HIGHLIGHT_ICONS = { mcp: Plug, skill: Sparkles } as const;
const HIGHLIGHT_STYLES = {
  mcp: { iconSurface: 'bg-teal-100', iconColor: 'text-teal-700', tag: 'MCP' },
  skill: { iconSurface: 'bg-sky-50', iconColor: 'text-sky-700', tag: 'Skill' },
} as const;

export default function LandingIntegrationsSection() {
  const reduced = useReducedMotion();
  const apiUrl = useIntegrationApiUrl();
  const [active, setActive] = useState<'mcp' | 'skill'>('mcp');
  const installCommand = integrationInstallCommand(active, apiUrl);
  const installCommandDisplay = integrationInstallCommandDisplay(active, apiUrl);

  return (
    <section
      id="integrations"
      data-testid="landing-integrations"
      className={marketingLandingSection}
      aria-labelledby="integrations-heading"
    >
      <div className={marketingPageContainer}>
        <ScrollReveal direction="up" className={marketingSectionHeader}>
          <span className={cn('mb-4', marketingEyebrow)}>Workflow integrations</span>
          <h2 id="integrations-heading" className={marketingSectionTitle}>
            Use BlogCreator in{' '}
            <span className={marketingAccentSpan}>your writing stack</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            {INTEGRATION_HERO_SUBTITLE} Or call our REST API directly from your own apps and
            pipelines.
          </p>
        </ScrollReveal>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
          {INTEGRATION_LANDING_HIGHLIGHTS.map((item, index) => {
            const Icon = HIGHLIGHT_ICONS[item.id];
            const styles = HIGHLIGHT_STYLES[item.id];
            return (
              <motion.article
                key={item.id}
                {...scrollRevealProps(alternateScrollDirection(index), {
                  delay: index * 0.08,
                  reduced,
                })}
                whileHover={reduced ? undefined : { y: -2 }}
                className={cn(marketingGlassCard, 'p-5 md:p-6')}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
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
                    {styles.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {item.bullets.map(bullet => (
                    <li key={bullet} className="text-xs font-medium text-slate-500">
                      · {bullet}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}

          <motion.article
            {...scrollRevealProps('right', { delay: 0.16, reduced })}
            whileHover={reduced ? undefined : { y: -2 }}
            className={cn(marketingGlassCard, 'p-5 md:p-6')}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Code2 className="h-5 w-5" aria-hidden />
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                API
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">REST API</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Wire BlogCreator into custom workflows with three hosted endpoints — no MCP required.
            </p>
            <ul className="mt-4 space-y-2">
              {INTEGRATION_API_ROUTES.map(route => (
                <li
                  key={route.path}
                  className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                      {route.method}
                    </span>
                    <code className="font-mono text-xs font-semibold text-slate-800">
                      {route.path}
                    </code>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{route.label}</p>
                </li>
              ))}
            </ul>
          </motion.article>
        </div>

        <ScrollReveal direction="up" className={cn(marketingGlassCard, 'overflow-hidden p-0')}>
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 md:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="h-5 w-5 text-slate-600" aria-hidden />
                <div>
                  <p className="font-bold text-slate-900">One-command install</p>
                  <p className="text-sm text-slate-600">
                    MCP tool or agent skill — connects to{' '}
                    <code className="font-mono text-xs font-semibold text-slate-800">{apiUrl}</code>
                  </p>
                </div>
              </div>
              <div
                className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1 sm:w-72"
                role="tablist"
                aria-label="Install type"
              >
                {(['mcp', 'skill'] as const).map(method => {
                  const isActive = active === method;
                  const Icon = HIGHLIGHT_ICONS[method];
                  return (
                    <button
                      key={method}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActive(method)}
                      className={cn(
                        'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                        marketingFocusRing,
                        isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                      {method === 'mcp' ? 'MCP' : 'Skill'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6 px-5 py-6 md:px-8 md:py-8">
            <CliCommandBlock
              command={installCommand}
              displayCommand={installCommandDisplay}
              label="Run in Terminal (bash)"
            />

            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                MCP tools:
              </span>
              {INTEGRATION_MCP_TOOLS.map(tool => (
                <code
                  key={tool}
                  className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-teal-800"
                >
                  {tool}
                </code>
              ))}
            </div>

            <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {INTEGRATION_LANDING_STEPS.map((step, i) => (
                <li
                  key={step}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-700">{step}</p>
                </li>
              ))}
            </ol>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
              <p className="text-center text-sm text-slate-600 sm:text-left">
                Full install options, API examples, and troubleshooting live on the Integrations
                page.
              </p>
              <Link
                href="/integrate"
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800',
                  marketingFocusRing
                )}
              >
                Open setup guide
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
