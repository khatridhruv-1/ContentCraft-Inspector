'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import { GuestSessionGate } from '@/components/loading/SessionLoadingGate';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingGlassCard,
  marketingPageClass,
  marketingSkipLink,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface AuthLayoutClientProps {
  children: ReactNode;
}

export default function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  const reduced = useReducedMotion();
  useMarketingPageBackground();

  return (
    <div
      className={cn('auth-page marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <a href="#auth-form" className={marketingSkipLink}>
        Skip to form
      </a>

      <MarketingDotGrid />
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="relative px-6 py-10 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_420px]">
          <motion.div
            id="auth-form"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: MARKETING_EASE }}
            className={cn(
              marketingGlassCard,
              'order-1 mx-auto w-full max-w-md p-7 sm:p-8 lg:order-2 lg:mx-0 lg:max-w-none lg:sticky lg:top-24 lg:self-start'
            )}
          >
            <GuestSessionGate>{children}</GuestSessionGate>
          </motion.div>

          <div className="order-2 lg:order-1 lg:flex lg:items-center">
            <AuthBrandPanel />
          </div>
        </div>

        <MarketingFooter className="mt-14" containerClassName="mx-auto w-full max-w-6xl" />
      </main>
    </div>
  );
}
