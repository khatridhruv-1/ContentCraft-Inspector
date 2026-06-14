'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Globe, Search, Sparkles, Wand2 } from 'lucide-react';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingGlassCard,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    icon: Search,
    title: 'Enter your topic',
    description: 'Describe what you want to write about — audience, angle, and key points.',
  },
  {
    icon: Globe,
    title: 'Discover trending keywords',
    description: 'We search the web for related, high-intent terms people are actually looking for.',
  },
  {
    icon: Wand2,
    title: 'Generate SEO-ready content',
    description: 'AI weaves those keywords naturally into a human-sounding draft with inline links.',
  },
] as const;

const SAMPLE_KEYWORDS = [
  'content marketing strategy',
  'SEO blog writing',
  'B2B content trends',
  'keyword research tips',
  'AI content workflow',
];

export default function SeoKeywordsSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="seo-keywords"
      className="relative scroll-mt-24 px-6 py-14 md:py-20"
      aria-labelledby="seo-keywords-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: MARKETING_EASE }}
          className="mb-12 text-center"
        >
          <span className={cn('mb-4', marketingEyebrow)}>SEO built in</span>
          <h2 id="seo-keywords-heading" className={marketingSectionTitle}>
            Trending keywords,{' '}
            <span className={marketingAccentSpan}>woven into every draft</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            No manual keyword research. Enter a topic and we discover what people search for —
            then generate content optimized to rank.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="space-y-4">
            {STEPS.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: MARKETING_EASE }}
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, ease: MARKETING_EASE }}
            whileHover={reduced ? undefined : { y: -4 }}
            className={cn(marketingGlassCard, 'overflow-hidden p-6 md:p-8')}
          >
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" aria-hidden />
              Live preview
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Your brief</p>
              <p className="mt-1 text-sm text-slate-800">
                How to build a content marketing strategy for B2B SaaS in 2026
              </p>
            </div>

            <div className="my-4 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-slate-300" aria-hidden />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
                Trending keywords used
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SAMPLE_KEYWORDS.map(keyword => (
                  <span
                    key={keyword}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-medium text-slate-500">Generated draft excerpt</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                A solid{' '}
                <span className="rounded bg-slate-100 px-1 text-slate-800">
                  content marketing strategy
                </span>{' '}
                starts with knowing what your audience searches for — not guessing at topics…
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
