'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Plug, Sparkles, Terminal } from 'lucide-react';
import CliCommandBlock from '@/components/integrate/CliCommandBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  INTEGRATION_API_ENDPOINTS,
  INTEGRATION_CLONE_FALLBACK,
  INTEGRATION_METHODS,
  INTEGRATION_PLATFORM_NOTES,
  INTEGRATION_PREREQUISITES,
} from '@/lib/marketing/integrationContent';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingGlassCard,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function IntegrationSection() {
  const reduced = useReducedMotion();

  return (
    <>
      <section
        id="prerequisites"
        className="relative scroll-mt-24 px-6 py-10 md:py-14"
        aria-labelledby="prereq-heading"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: MARKETING_EASE }}
            className={cn(marketingGlassCard, 'p-6 md:p-8')}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Terminal className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="prereq-heading" className="text-xl font-bold text-slate-900">
                  CLI-only setup
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Add ContentCraft to Cursor, Claude Desktop, or any project with a single terminal
                  command. Pick an MCP tool or a Cursor skill — both install via the same installer
                  script.
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {INTEGRATION_PREREQUISITES.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full min-w-[32rem] text-left text-sm">
                    <caption className="sr-only">Platform support for integration installer</caption>
                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5">Platform</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INTEGRATION_PLATFORM_NOTES.map(row => (
                        <tr key={row.platform} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3 font-medium text-slate-900">{row.platform}</td>
                          <td className="px-4 py-3 text-slate-600">{row.status}</td>
                          <td className="px-4 py-3 text-slate-600">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <p className="mb-3 text-sm font-medium text-slate-700">
                Alternative: clone the repo first
              </p>
              <p className="mb-3 text-sm text-slate-600">
                If the remote one-liner fails, clone and run the installer from your machine:
              </p>
              <CliCommandBlock command={INTEGRATION_CLONE_FALLBACK} />
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="install"
        className="relative scroll-mt-24 px-6 py-10 md:py-14"
        aria-labelledby="install-heading"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: MARKETING_EASE }}
            className="mb-10 text-center"
          >
            <span className={cn('mb-4', marketingEyebrow)}>Choose your integration</span>
            <h2 id="install-heading" className={marketingSectionTitle}>
              MCP tool or <span className={marketingAccentSpan}>Cursor skill</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Both options use the same CLI installer. MCP exposes tools in agent chat; the skill
              teaches the agent how to call ContentCraft APIs from any workflow.
            </p>
          </motion.div>

          <Tabs defaultValue="mcp" className="w-full">
            <TabsList className="mx-auto mb-8 grid h-auto w-full max-w-md grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
              {INTEGRATION_METHODS.map(method => (
                <TabsTrigger
                  key={method.id}
                  value={method.id}
                  className="rounded-lg py-2.5 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  {method.id === 'mcp' ? (
                    <Plug className="mr-1.5 inline h-4 w-4" aria-hidden />
                  ) : (
                    <Sparkles className="mr-1.5 inline h-4 w-4" aria-hidden />
                  )}
                  {method.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {INTEGRATION_METHODS.map(method => (
              <TabsContent key={method.id} value={method.id} className="mt-0 focus-visible:outline-none">
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: MARKETING_EASE }}
                  className="space-y-6"
                >
                  <div className={cn(marketingGlassCard, 'p-6 md:p-8')}>
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div
                        className={cn(
                          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                          method.iconSurface,
                          method.iconColor
                        )}
                      >
                        {method.id === 'mcp' ? (
                          <Plug className="h-5 w-5" aria-hidden />
                        ) : (
                          <Sparkles className="h-5 w-5" aria-hidden />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{method.title}</h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">{method.subtitle}</p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">{method.description}</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Best for
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-3">
                        {method.bestFor.map(item => (
                          <li
                            key={item}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-8">
                      {method.steps.map((step, index) => (
                        <div key={step.title}>
                          <div className="mb-3 flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-600">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="font-semibold text-slate-900">{step.title}</h4>
                              <p className="text-sm text-slate-600">{step.description}</p>
                            </div>
                          </div>
                          <CliCommandBlock command={step.command} />
                        </div>
                      ))}
                    </div>

                    {method.verifyCommand ? (
                      <div className="mt-8 border-t border-slate-200 pt-6">
                        <p className="mb-3 text-sm font-medium text-slate-700">Verify installation</p>
                        <CliCommandBlock command={method.verifyCommand} />
                      </div>
                    ) : null}

                    {method.configNote ? (
                      <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                        {method.configNote}
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section
        id="api-reference"
        className="relative scroll-mt-24 px-6 py-10 md:py-14"
        aria-labelledby="api-heading"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: MARKETING_EASE }}
            className="mb-10 text-center"
          >
            <span className={cn('mb-4', marketingEyebrow)}>API reference</span>
            <h2 id="api-heading" className={marketingSectionTitle}>
              Endpoints used by <span className={marketingAccentSpan}>MCP &amp; skill</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              Both integrations call these public routes on your ContentCraft Inspector instance.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {INTEGRATION_API_ENDPOINTS.map(endpoint => (
              <motion.article
                key={endpoint.path}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, ease: MARKETING_EASE }}
                className={cn(marketingGlassCard, 'p-5 md:p-6')}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-xs font-bold text-emerald-800">
                    {endpoint.method}
                  </span>
                  <code className="font-mono text-sm font-semibold text-slate-900">{endpoint.path}</code>
                </div>
                <p className="mb-4 text-sm text-slate-600">{endpoint.summary}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Request body
                    </p>
                    <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800">
                      {endpoint.body}
                    </pre>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Response
                    </p>
                    <pre className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800">
                      {endpoint.response}
                    </pre>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
