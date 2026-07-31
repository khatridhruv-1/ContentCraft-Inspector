'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import { SAMPLE_OUTPUTS } from '@/lib/marketing/sampleOutputs';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingFocusRing,
  marketingGlassCard,
  marketingPageClass,
  marketingSubpageMain,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';
import { renderInlineMarkdown } from '@/lib/marketing/renderMarkdown';

function renderBody(body: string) {
  return body.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h3 key={i} className="mt-6 text-lg font-bold text-slate-900">
          {block.replace('## ', '')}
        </h3>
      );
    }
    if (block.startsWith('→ ') || block.startsWith('#')) {
      return (
        <p key={i} className="mt-2 text-base leading-relaxed text-slate-700">
          {renderInlineMarkdown(block)}
        </p>
      );
    }
    if (/^\d+\./.test(block)) {
      return (
        <p key={i} className="mt-2 whitespace-pre-line text-base leading-relaxed text-slate-700">
          {renderInlineMarkdown(block)}
        </p>
      );
    }
    return (
      <p key={i} className="mt-3 text-base leading-relaxed text-slate-700">
        {renderInlineMarkdown(block)}
      </p>
    );
  });
}

export default function SamplesPageClient() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="3xl" />

      <main className={marketingSubpageMain}>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MARKETING_EASE }}
        >
          <p className="text-sm font-medium text-teal-700">Sample outputs</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            See what BlogCreator <span className={marketingAccentSpan}>generates</span>
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Pick a platform to preview a representative sample — then generate your own for free.
          </p>
        </motion.div>

        <ul className="mt-10 space-y-3">
          {SAMPLE_OUTPUTS.map((sample, index) => {
            const isOpen = openId === sample.id;
            const panelId = `sample-panel-${sample.id}`;
            const triggerId = `sample-trigger-${sample.id}`;

            return (
              <motion.li
                key={sample.id}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: reduced ? 0 : 0.08 + index * 0.06,
                  ease: MARKETING_EASE,
                }}
              >
                <motion.article
                  layout={!reduced}
                  whileHover={
                    reduced || isOpen
                      ? undefined
                      : { y: -2, transition: { duration: 0.2 } }
                  }
                  className={cn(
                    marketingGlassCard,
                    'overflow-hidden',
                    isOpen && 'ring-1 ring-teal-200'
                  )}
                >
                  <button
                    type="button"
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : sample.id)}
                    className={cn(
                      'flex w-full items-start gap-4 p-5 text-left md:p-6',
                      marketingFocusRing,
                      'rounded-2xl'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                        {sample.platform}
                      </p>
                      <h2 className="mt-1.5 text-lg font-bold text-slate-900 md:text-xl">
                        {sample.topic}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">{sample.excerpt}</p>
                      {!isOpen && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {sample.keywords.slice(0, 3).map(kw => (
                            <span
                              key={kw}
                              className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mt-3 text-sm font-semibold text-teal-700">
                        {isOpen ? 'Hide sample' : 'Read full sample'}
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: MARKETING_EASE }}
                      className="mt-1 inline-flex shrink-0"
                    >
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 text-slate-400',
                          isOpen && 'text-teal-600'
                        )}
                        aria-hidden
                      />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={
                          reduced
                            ? false
                            : { height: 0, opacity: 0 }
                        }
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: MARKETING_EASE }}
                        className="overflow-hidden border-t border-slate-200"
                      >
                        <div className="px-5 pb-6 pt-4 md:px-6">
                          <div className="mb-4 flex flex-wrap gap-2">
                            {sample.keywords.map(kw => (
                              <span
                                key={kw}
                                className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                          <div>{renderBody(sample.body)}</div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.article>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          className="mt-10 flex justify-center"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4, ease: MARKETING_EASE }}
        >
          <MarketingPrimaryButton
            type="button"
            fullWidth={false}
            onClick={() => router.push('/auth/signup')}
          >
            Generate your own — free
          </MarketingPrimaryButton>
        </motion.div>
      </main>

      <MarketingFooter />
    </div>
  );
}
