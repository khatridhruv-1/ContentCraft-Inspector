'use client';

import { BETA_CASE_STUDY, TRUSTED_BY_CATEGORIES, TRUSTED_BY_LOGOS } from '@/lib/marketing/caseStudy';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingGlassCard,
  marketingLandingSection,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function TrustedBySection() {
  return (
    <section
      className={cn(marketingLandingSection, 'pt-0 pb-0')}
      aria-labelledby="trusted-by-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className={marketingSectionHeader}>
          <span className={marketingEyebrow}>Beta teams</span>
          <h2 id="trusted-by-heading" className={marketingSectionTitle}>
            Used by practitioners{' '}
            <span className={marketingAccentSpan}>building content</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            Early adopters from private beta — company names withheld until public launch.
          </p>
        </div>

        <ul className="mb-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {TRUSTED_BY_LOGOS.map(logo => (
            <li key={logo.name} className="flex items-center gap-2">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700"
                aria-hidden
              >
                {logo.initials}
              </span>
              <span className="text-sm font-medium text-slate-700">{logo.name}</span>
            </li>
          ))}
        </ul>

        <ul className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {TRUSTED_BY_CATEGORIES.map(category => (
            <li key={category}>
              <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700">
                {category}
              </span>
            </li>
          ))}
        </ul>

        <article className={cn(marketingGlassCard, 'mx-auto max-w-3xl p-6 md:p-8')}>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
            Beta case study
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            {BETA_CASE_STUDY.metric}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{BETA_CASE_STUDY.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {BETA_CASE_STUDY.highlights.map(item => (
              <li
                key={item}
                className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800"
              >
                {item}
              </li>
            ))}
          </ul>
          <footer className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{BETA_CASE_STUDY.attribution}</span>
            {' · '}
            {BETA_CASE_STUDY.role} at {BETA_CASE_STUDY.company}
            <span className="mt-1 block text-xs text-slate-400">
              Company name shared with written permission.
            </span>
          </footer>
        </article>
      </div>
    </section>
  );
}
