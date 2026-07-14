'use client';

import { useState } from 'react';
import { Check, ChevronDown, Minus, X } from 'lucide-react';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import { CHATGPT_COMPARISON_ROWS } from '@/lib/marketing/welcomeContent';
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

function CellValue({ value }: { value: boolean | 'partial' }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
        <Check className="h-4 w-4 shrink-0" aria-hidden />
        <span className="sr-only">Yes — </span>
        Included
      </span>
    );
  }
  if (value === 'partial') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700">
        <Minus className="h-4 w-4 shrink-0" aria-hidden />
        <span className="sr-only">Partial — </span>
        Manual setup
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
      <X className="h-4 w-4 shrink-0" aria-hidden />
      <span className="sr-only">No — </span>
      Not built-in
    </span>
  );
}

export default function ChatGptComparisonSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className={marketingLandingSection}
      aria-labelledby="comparison-heading"
    >
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal className={marketingSectionHeader}>
          <span className={marketingEyebrow}>Why not just ChatGPT?</span>
          <h2 id="comparison-heading" className={marketingSectionTitle}>
            BlogCreator vs{' '}
            <span className={marketingAccentSpan}>general chat AI</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            Chat assistants are great for brainstorming. BlogCreator is built for the full publish
            workflow — platform drafts, live keywords, and SEO scoring in one place.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <div className={cn(marketingGlassCard, 'overflow-hidden')}>
            <button
              type="button"
              onClick={() => setExpanded(prev => !prev)}
              aria-expanded={expanded}
              aria-controls="comparison-table"
              className={cn(
                'flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6',
                marketingFocusRing
              )}
            >
              <span className="text-sm font-semibold text-slate-800">
                {expanded ? 'Hide comparison table' : 'Show side-by-side comparison'}
              </span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200',
                  expanded && 'rotate-180'
                )}
                aria-hidden
              />
            </button>

            {expanded && (
              <div id="comparison-table" className="border-t border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/80">
                        <th scope="col" className="px-5 py-3 font-semibold text-slate-700 md:px-6">
                          Capability
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold text-violet-800">
                          BlogCreator
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold text-slate-600">
                          ChatGPT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {CHATGPT_COMPARISON_ROWS.map(row => (
                        <tr key={row.feature} className="border-b border-slate-100 last:border-0">
                          <th
                            scope="row"
                            className="px-5 py-3.5 font-medium text-slate-800 md:px-6"
                          >
                            {row.feature}
                          </th>
                          <td className="px-4 py-3.5">
                            <CellValue value={row.blogcreator} />
                          </td>
                          <td className="px-4 py-3.5">
                            <CellValue value={row.chatgpt} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
