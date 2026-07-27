'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import DashboardPreviewMock from '@/components/marketing/DashboardPreviewMock';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import {
  LANDING_HERO_BADGE,
  LANDING_HERO_SUBHEAD,
  LANDING_HERO_TITLE_LINE1,
  LANDING_HERO_TITLE_LINE2,
} from '@/lib/marketing/landingHeroContent';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingFocusRing,
  marketingHeroEyebrow,
  marketingPageContainer,
} from '@/lib/marketing/marketingTheme';
import { useMountReveal } from '@/hooks/useMountReveal';
import { cn } from '@/lib/utils';

const PLATFORMS = ['Website', 'LinkedIn', 'Quora', 'Medium', 'Substack'] as const;

export default function LandingHeroAnimated() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const ready = useMountReveal();

  return (
    <div className={cn(marketingPageContainer, 'relative w-full')}>
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[480px] w-[min(100%,800px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.12)_0%,transparent_70%)]" />
      </div>

      {/* Hero copy — centered, headline always visible (no slide animations) */}
      <div className="mx-auto flex max-w-3xl flex-col items-center px-1 pb-10 pt-6 text-center sm:pb-12 sm:pt-8 md:pb-14 md:pt-10">
        <span className={cn(marketingHeroEyebrow, 'mb-6 md:mb-7')}>{LANDING_HERO_BADGE}</span>

        <h1
          id="hero-heading-ssr"
          className="mb-5 text-balance text-[2rem] font-black leading-[1.12] tracking-tight text-slate-900 sm:mb-6 sm:text-5xl sm:leading-[1.08] md:text-[3.25rem]"
        >
          <span className="block">{LANDING_HERO_TITLE_LINE1}</span>
          <span className={cn('mt-1 block sm:mt-1.5', marketingAccentSpan)}>
            {LANDING_HERO_TITLE_LINE2}
          </span>
        </h1>

        <p className="mb-8 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:mb-9 md:text-lg">
          {LANDING_HERO_SUBHEAD}
        </p>

        <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <MarketingPrimaryButton
            type="button"
            size="xl"
            onClick={() => router.push('/auth/signup')}
            className="group w-full shadow-lg shadow-slate-900/15 sm:w-auto"
            fullWidth={false}
          >
            <span className="flex items-center justify-center gap-2">
              Get started free
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </MarketingPrimaryButton>
          <Link
            href="/samples"
            className={cn(
              'inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-teal-200 hover:bg-slate-50 sm:w-auto',
              marketingFocusRing
            )}
          >
            See sample output
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2 sm:mt-8">
          {PLATFORMS.map(label => (
            <span
              key={label}
              className="rounded-full border border-slate-200/90 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Product preview */}
      <motion.div
        initial={reduced ? false : { y: 16, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : reduced ? undefined : { y: 16, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: MARKETING_EASE }}
        className="w-full pb-12 pt-6 sm:pb-16 md:pb-20 lg:pb-24"
      >
        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-x-4 -bottom-6 top-1/3 -z-10 rounded-full bg-teal-400/10 blur-3xl"
            aria-hidden
          />
          <DashboardPreviewMock className="shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/80" />
        </div>
      </motion.div>
    </div>
  );
}
