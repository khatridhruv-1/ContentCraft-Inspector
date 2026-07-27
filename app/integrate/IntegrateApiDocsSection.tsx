'use client';

import { Code2 } from 'lucide-react';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import {
  INTEGRATION_API_ROUTES,
  integrationApiUrl,
} from '@/lib/marketing/integrationContent';
import { useIntegrationApiUrl } from '@/hooks/useIntegrationApiUrl';
import {
  marketingEyebrow,
  marketingFocusRing,
  marketingGlassCard,
  marketingLandingSection,
  marketingPageContainer,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const API_EXAMPLES = [
  {
    path: '/api/ai-content',
    curl: (origin: string) =>
      `curl -X POST ${origin}/api/ai-content \\\n  -H "Content-Type: application/json" \\\n  -d '{"title":"B2B SaaS content strategy","platform":"website","tone":"practitioner"}'`,
    body: '{ title: string; tone?: string; platform?: "website" | "linkedin" | "quora" | "medium" | "substack" }',
  },
  {
    path: '/api/analyze',
    curl: (origin: string) =>
      `curl -X POST ${origin}/api/analyze \\\n  -H "Content-Type: application/json" \\\n  -d '{"content":"Paste your draft here..."}'`,
    body: '{ content: string }',
  },
  {
    path: '/api/outline',
    curl: (origin: string) =>
      `curl -X POST ${origin}/api/outline \\\n  -H "Content-Type: application/json" \\\n  -d '{"content":"Your article or brief..."}'`,
    body: '{ content: string }',
  },
] as const;

export default function IntegrateApiDocsSection() {
  const apiUrl = useIntegrationApiUrl();
  const origin = integrationApiUrl(apiUrl);

  return (
    <section
      id="rest-api"
      className={marketingLandingSection}
      aria-labelledby="integrate-api-heading"
    >
      <div className={marketingPageContainer}>
        <ScrollReveal direction="up" className={marketingSectionHeader}>
          <span className={marketingEyebrow}>REST API</span>
          <h2 id="integrate-api-heading" className={marketingSectionTitle}>
            Hosted endpoints
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Call BlogCreator from your own apps, CI jobs, or scripts — no MCP server required.
            All routes are hosted at{' '}
            <code className="font-mono text-sm font-semibold text-slate-800">{origin}</code>.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {INTEGRATION_API_ROUTES.map(route => {
            const example = API_EXAMPLES.find(e => e.path === route.path);
            return (
              <article
                key={route.path}
                className={cn(marketingGlassCard, 'flex flex-col p-5 md:p-6')}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Code2 className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                    {route.method}
                  </span>
                </div>
                <code className="font-mono text-sm font-bold text-slate-900">{route.path}</code>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{route.label}</p>
                {example ? (
                  <>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Request body
                    </p>
                    <code className="mt-1 block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700">
                      {example.body}
                    </code>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Example
                    </p>
                    <pre className="mt-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-100">
                      {example.curl(origin)}
                    </pre>
                  </>
                ) : null}
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Responses are JSON. Rate limits apply on shared infrastructure — contact us for higher
          throughput on Pro.
        </p>
      </div>
    </section>
  );
}
