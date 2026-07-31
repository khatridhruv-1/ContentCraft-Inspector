'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import BlogCreatorLogo from '@/components/brand/BlogCreatorLogo';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import { GuestSessionGate } from '@/components/loading/SessionLoadingGate';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingMutedLink,
  marketingPageClass,
  marketingPageContainerTight,
  marketingSkipLink,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface AuthLayoutClientProps {
  children: ReactNode;
}

/**
 * Closing CTA Stage — auth as a continuation of the landing conversion panel.
 * Full mist canvas + one teal stage (no floating glass card, no dark split).
 */
export default function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  const reduced = useReducedMotion();
  useMarketingPageBackground();

  return (
    <div
      className={cn(
        'auth-page marketing-page flex min-h-dvh flex-col',
        marketingPageClass
      )}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <a href="#auth-form" className={marketingSkipLink}>
        Skip to form
      </a>

      <MarketingDotGrid />
      <MarketingSubpageHeader maxWidth="2xl" />

      <main
        className={cn(
          marketingPageContainerTight,
          'relative flex flex-1 flex-col justify-center py-10 md:py-12'
        )}
      >
        <motion.div
          id="auth-form"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: MARKETING_EASE }}
          className="mx-auto w-full max-w-[28rem]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50 via-white to-sky-50 px-6 py-8 shadow-sm shadow-slate-900/[0.03] sm:px-8 sm:py-9">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-300/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-14 h-44 w-44 rounded-full bg-sky-300/20 blur-3xl"
              aria-hidden
            />

            <div className="relative">
              <div className="mb-7 flex justify-center">
                <Link
                  href="/"
                  className="transition-opacity hover:opacity-90"
                  aria-label="BlogCreator home"
                >
                  <BlogCreatorLogo size="lg" />
                </Link>
              </div>

              <GuestSessionGate>{children}</GuestSessionGate>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="relative border-t border-slate-200/70 py-5">
        <div
          className={cn(
            marketingPageContainerTight,
            'flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500'
          )}
        >
          <span>© {new Date().getFullYear()} BlogCreator</span>
          <Link href="/terms" className={cn(marketingMutedLink, 'text-xs')}>
            Terms
          </Link>
          <Link href="/privacy" className={cn(marketingMutedLink, 'text-xs')}>
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
