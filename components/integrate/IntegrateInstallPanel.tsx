'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Plug, Sparkles } from 'lucide-react';
import CliCommandBlock from '@/components/integrate/CliCommandBlock';
import {
  INTEGRATION_AFTER_INSTALL,
  INTEGRATION_HOSTED_API_URL,
  INTEGRATION_INSTALL_OPTIONS,
  INTEGRATION_IS_LOCAL_PREVIEW,
  INTEGRATION_SKILL_PLATFORMS,
} from '@/lib/marketing/integrationContent';
import { MARKETING_EASE, marketingFocusRing, marketingGlassCard } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const methodMeta = {
  mcp: {
    icon: Plug,
    description: 'Native tools in any MCP-capable agent',
  },
  skill: {
    icon: Sparkles,
    description: 'Works with editors, terminals, and any skills-capable agent',
  },
} as const;

export default function IntegrateInstallPanel() {
  const [active, setActive] = useState<'mcp' | 'skill'>('mcp');
  const option = INTEGRATION_INSTALL_OPTIONS.find(o => o.id === active)!;

  return (
    <section className="px-6 pb-12 pt-6" aria-labelledby="install-heading">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: MARKETING_EASE }}
          className={cn(
            marketingGlassCard,
            'overflow-hidden border-slate-200 shadow-lg shadow-slate-900/5'
          )}
        >
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 md:px-8">
            <h2 id="install-heading" className="text-center text-base font-bold text-slate-900">
              Choose install type
            </h2>

            <div
              className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-1"
              role="tablist"
              aria-label="Install type"
            >
              {INTEGRATION_INSTALL_OPTIONS.map(opt => {
                const m = methodMeta[opt.id];
                const OptIcon = m.icon;
                const isActive = active === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(opt.id)}
                    className={cn(
                      'rounded-lg px-4 py-3.5 text-left transition-all duration-200',
                      marketingFocusRing,
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <OptIcon className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="text-sm font-bold">{opt.title}</span>
                    </div>
                    <p
                      className={cn(
                        'mt-1.5 pl-6 text-xs font-medium leading-snug',
                        isActive ? 'text-slate-300' : 'text-slate-600'
                      )}
                    >
                      {m.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white px-6 py-6 md:px-8 md:py-8">
            <div className="mb-6 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-sm font-semibold text-slate-800">API endpoint</span>
                <code className="overflow-x-auto font-mono text-sm font-medium text-slate-900">
                  {INTEGRATION_HOSTED_API_URL}
                </code>
              </div>
              {INTEGRATION_IS_LOCAL_PREVIEW ? (
                <p className="mt-2 text-xs font-medium text-amber-800">
                  Dev preview — set <code className="font-mono">NEXT_PUBLIC_SITE_URL</code> on deploy
                  for your production domain.
                </p>
              ) : null}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: MARKETING_EASE }}
              >
                <CliCommandBlock
                  command={option.command}
                  displayCommand={option.commandDisplay}
                  label="Run in Terminal"
                />

                {active === 'skill' ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {INTEGRATION_SKILL_PLATFORMS.map(platform => (
                      <span
                        key={platform}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                ) : null}

                <ol className="mt-8 flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-4">
                  {option.steps.map((step, i) => (
                    <li
                      key={step}
                      className="flex items-start gap-3 rounded-lg border-2 border-slate-200 bg-white px-4 py-4 shadow-sm"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 text-sm font-medium leading-snug text-slate-800">{step}</p>
                    </li>
                  ))}
                </ol>
              </motion.div>
            </AnimatePresence>

            <p className="mt-8 flex items-start gap-2.5 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" aria-hidden />
              {INTEGRATION_AFTER_INSTALL}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
