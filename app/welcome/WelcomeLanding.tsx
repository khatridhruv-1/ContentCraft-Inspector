'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import BlogCreatorNavBrand from '@/components/brand/BlogCreatorNavBrand';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import LandingMobileNav from '@/components/marketing/LandingMobileNav';
import BetaTestimonialsSection from '@/components/marketing/BetaTestimonialsSection';
import TryTopicWidget from '@/components/marketing/TryTopicWidget';
import LandingIntegrationsTeaser from '@/app/welcome/LandingIntegrationsTeaser';
import FaqSection from '@/app/welcome/FaqSection';
import ChatGptComparisonSection from '@/app/welcome/ChatGptComparisonSection';
import NewsletterSignup from '@/components/marketing/NewsletterSignup';
import LandingPlatformSection from '@/app/welcome/LandingPlatformSection';
import UserGuideSection from '@/app/welcome/UserGuideSection';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingFocusRing,
  marketingGhostNav,
  marketingPageContainer,
  marketingPageClass,
  marketingLandingHero,
  marketingSkipLink,
} from '@/lib/marketing/marketingTheme';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  LANDING_HERO_SUBHEAD,
  LANDING_HERO_TITLE_LINE1,
  LANDING_HERO_TITLE_LINE2,
} from '@/lib/marketing/landingHeroContent';
import { cn } from '@/lib/utils';

type WelcomeLandingProps = {
  /** SSR hero with H1 in initial HTML — pass from `app/page.tsx`. */
  heroSlot?: ReactNode;
};

export default function WelcomeLanding({ heroSlot }: WelcomeLandingProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  useMarketingPageBackground();

  return (
    <div
      className={cn('marketing-page min-h-screen overflow-x-hidden', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <a href="#main-content" className={marketingSkipLink}>
        Skip to main content
      </a>

      <MarketingDotGrid />

      <motion.nav
        initial={reduced ? false : { y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: MARKETING_EASE }}
        className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md"
        aria-label="Main navigation"
      >
        <div className={cn(marketingPageContainer, 'flex h-14 items-center justify-between gap-4 md:h-16')}>
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="BlogCreator home"
          >
            <BlogCreatorNavBrand priority />
          </Link>

          <div className="hidden items-center gap-0.5 xl:flex">
            {[
              { href: '#features', label: 'Features' },
              { href: '#platforms', label: 'Platforms' },
              { href: '#integrations', label: 'Integrations' },
              { href: '#faq', label: 'FAQ' },
            ].map(item => (
              <a
                key={item.href}
                href={item.href}
                className={cn('px-2.5 py-2', marketingGhostNav, marketingFocusRing)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/samples"
              className={cn('px-2.5 py-2', marketingGhostNav, marketingFocusRing)}
            >
              Samples
            </Link>
            <Link
              href="/pricing"
              className={cn('px-2.5 py-2', marketingGhostNav, marketingFocusRing)}
            >
              Pricing
            </Link>
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className={cn('px-2.5 py-2', marketingGhostNav, marketingFocusRing)}
            >
              Sign in
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LandingMobileNav />
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className={cn('xl:hidden px-3 py-2', marketingGhostNav, marketingFocusRing)}
            >
              Sign in
            </button>
            <MarketingPrimaryButton
              type="button"
              size="sm"
              onClick={() => router.push('/auth/signup')}
              className="!w-auto"
              fullWidth={false}
            >
              Get started
            </MarketingPrimaryButton>
          </div>
        </div>
      </motion.nav>

      <main id="main-content">
        <section
          className={marketingLandingHero}
          aria-labelledby={heroSlot ? 'hero-heading-ssr' : 'hero-heading'}
        >
          {heroSlot ? (
            heroSlot
          ) : (
            <div className={cn(marketingPageContainer, 'mx-auto max-w-3xl py-8 text-center sm:py-10 md:py-12')}>
              <p className="mb-6 inline-flex items-center rounded-full border border-teal-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800 shadow-sm md:mb-7">
                Humanized drafts · Free for everyone
              </p>
              <h1
                id="hero-heading"
                className="mb-5 text-balance text-[2rem] font-black leading-[1.12] tracking-tight text-slate-900 sm:mb-6 sm:text-5xl md:text-[3.25rem]"
              >
                {LANDING_HERO_TITLE_LINE1}
                <span className={cn('mt-1 block sm:mt-1.5', marketingAccentSpan)}>
                  {LANDING_HERO_TITLE_LINE2}
                </span>
              </h1>
              <p className="mb-8 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:mb-9 md:text-lg">
                {LANDING_HERO_SUBHEAD}
              </p>
              <MarketingPrimaryButton
                type="button"
                size="xl"
                onClick={() => router.push('/auth/signup')}
                fullWidth={false}
              >
                Get started free
              </MarketingPrimaryButton>
            </div>
          )}
        </section>

        <LandingPlatformSection />

        <div id="features" className="scroll-mt-24">
          <UserGuideSection />
        </div>

        <TryTopicWidget />

        <BetaTestimonialsSection />

        <ChatGptComparisonSection />

        <LandingIntegrationsTeaser />

        <NewsletterSignup />

        <FaqSection compact />

        <section
          className="relative scroll-mt-24 py-16 md:py-20 lg:py-24"
          aria-labelledby="closing-cta-heading"
        >
          <div className={cn(marketingPageContainer)}>
            <div className="relative overflow-hidden rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50 via-white to-sky-50 px-6 py-12 text-center md:px-12 md:py-16">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-300/20 blur-3xl"
                aria-hidden
              />
              <h2
                id="closing-cta-heading"
                className="relative text-balance text-3xl font-black tracking-tight text-slate-900 md:text-4xl"
              >
                Ready to draft for the platform you{' '}
                <span className={marketingAccentSpan}>actually publish on</span>?
              </h2>
              <p className="relative mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-600">
                Free during beta. Humanized drafts, keyword discovery, and SEO analysis — no credit
                card.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <MarketingPrimaryButton
                  type="button"
                  size="lg"
                  onClick={() => router.push('/auth/signup')}
                  className="!w-auto"
                  fullWidth={false}
                >
                  <span className="flex items-center gap-2">
                    Get started free
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </MarketingPrimaryButton>
                <Link
                  href="/samples"
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-teal-200 hover:bg-slate-50',
                    marketingFocusRing
                  )}
                >
                  See sample output
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
