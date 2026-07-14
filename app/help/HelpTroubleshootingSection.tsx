'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, HelpCircle, KeyRound, Plug, Search, FileOutput, BarChart2, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { HELP_TROUBLESHOOTING_ITEMS } from '@/lib/marketing/helpContent';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingLandingSection,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const TAG_ICONS: Record<string, LucideIcon> = {
  Auth: KeyRound,
  Integrations: Plug,
  SEO: Search,
  Export: FileOutput,
  Analysis: BarChart2,
  Newsletter: Mail,
};

export default function HelpTroubleshootingSection() {
  const reduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="troubleshooting"
      className={marketingLandingSection}
      aria-labelledby="troubleshooting-heading"
    >
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: MARKETING_EASE }}
          className={marketingSectionHeader}
        >
          <span className={marketingEyebrow}>Troubleshooting</span>
          <h2 id="troubleshooting-heading" className={marketingSectionTitle}>
            Common issues &amp;{' '}
            <span className={marketingAccentSpan}>fixes</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-slate-600">
            Setup help and product FAQs live on the homepage. This section covers technical
            problems and edge cases.
          </p>
        </motion.div>

        <div className="mt-8 space-y-3">
          {HELP_TROUBLESHOOTING_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const Icon = TAG_ICONS[item.tag] ?? HelpCircle;

            return (
              <div
                key={item.question}
                className={cn(
                  'rounded-xl border transition-colors duration-200',
                  isOpen
                    ? 'border-violet-200 bg-violet-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                <button
                  type="button"
                  id={`help-trouble-btn-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`help-trouble-answer-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {item.tag}
                    </span>
                    <span className="block text-sm font-semibold text-slate-800">{item.question}</span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.2 }}
                    className="mt-1 shrink-0 text-slate-400"
                    aria-hidden
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>

                {isOpen && (
                  <div
                    id={`help-trouble-answer-${index}`}
                    role="region"
                    aria-labelledby={`help-trouble-btn-${index}`}
                    className="border-t border-violet-100/80 px-4 pb-4 pl-[3.75rem] pr-5 text-sm leading-relaxed text-slate-600"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
