'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import BlogCreatorLogo from '@/components/brand/BlogCreatorLogo';
import BlogCreatorNavBrand from '@/components/brand/BlogCreatorNavBrand';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import HeroHandwrittenCallout, {
  heroCtaDoodleSpacerHeightPx,
} from '@/components/marketing/HeroHandwrittenCallout';
import EnterReveal from '@/components/marketing/EnterReveal';
import ScrollReveal, { alternateScrollDirection } from '@/components/marketing/ScrollReveal';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import MarketingSectionDivider from '@/components/marketing/MarketingSectionDivider';
import DashboardPreviewMock from '@/components/marketing/DashboardPreviewMock';
import LandingMobileNav from '@/components/marketing/LandingMobileNav';
import BetaTestimonialsSection from '@/components/marketing/BetaTestimonialsSection';
import TryTopicWidget from '@/components/marketing/TryTopicWidget';
import TrustedBySection from '@/components/marketing/TrustedBySection';
import LandingIntegrationsTeaser from '@/app/welcome/LandingIntegrationsTeaser';
import FaqSection from '@/app/welcome/FaqSection';
import ChatGptComparisonSection from '@/app/welcome/ChatGptComparisonSection';
import ChatGptSideBySideWidget from '@/components/marketing/ChatGptSideBySideWidget';
import NewsletterSignup from '@/components/marketing/NewsletterSignup';
import LandingPlatformSection from '@/app/welcome/LandingPlatformSection';
import { BLOGCREATOR_WORKFLOWS } from '@/lib/marketing/workflows';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGhostNav,
  marketingGlassCard,
  marketingNavPill,
  marketingPageClass,
  marketingLandingHero,
  marketingLandingSection,
  marketingSectionHeader,
  marketingSectionTitle,
  marketingSkipLink,
} from '@/lib/marketing/marketingTheme';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import { scrollRevealProps } from '@/lib/marketing/scrollReveal';
import { useMountReveal } from '@/hooks/useMountReveal';
import { cn } from '@/lib/utils';

type WelcomeLandingProps = {
  /** SSR hero with H1 in initial HTML — pass from `app/page.tsx`. */
  heroSlot?: ReactNode;
};

export default function WelcomeLanding({ heroSlot }: WelcomeLandingProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const heroReady = useMountReveal();
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
        initial={reduced ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: MARKETING_EASE }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 md:px-12"
        aria-label="Main navigation"
      >
        <div className={cn('absolute inset-x-3 top-1.5 bottom-1 rounded-2xl -z-10', marketingNavPill)} />

        <Link
          href="/"
          className="flex min-w-0 max-w-[55%] items-center sm:max-w-none"
          aria-label="BlogCreator home"
        >
          <BlogCreatorNavBrand priority />
        </Link>

        <div className="flex min-w-0 shrink-0 items-center gap-1 md:gap-2 lg:gap-4">
          <LandingMobileNav />
          <div className="max-md:hidden flex min-w-0 items-center gap-1 md:gap-2 lg:gap-4">
            <a
              href="#features"
              className={cn('px-3 py-2', marketingGhostNav, marketingFocusRing)}
            >
              Features
            </a>
            <a
              href="#platforms"
              className={cn('hidden px-3 py-2 lg:inline', marketingGhostNav, marketingFocusRing)}
            >
              Platforms
            </a>
            <a
              href="#integrations"
              className={cn('hidden px-3 py-2 lg:inline', marketingGhostNav, marketingFocusRing)}
            >
              Integrations
            </a>
            <a
              href="#faq"
              className={cn('px-3 py-2', marketingGhostNav, marketingFocusRing)}
            >
              FAQ
            </a>
            <Link
              href="/samples"
              className={cn('px-3 py-2', marketingGhostNav, marketingFocusRing)}
            >
              Samples
            </Link>
            <Link
              href="/pricing"
              className={cn('px-3 py-2', marketingGhostNav, marketingFocusRing)}
            >
              Pricing
            </Link>
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className={cn('px-4 py-2.5', marketingGhostNav, marketingFocusRing)}
            >
              Sign in
            </button>
          </div>
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
      </motion.nav>

      <main id="main-content">
        <section className={marketingLandingHero} aria-labelledby={heroSlot ? 'hero-heading-ssr' : 'hero-heading'}>
          {heroSlot ? (
            <>
              {heroSlot}
              <div
                className="max-md:hidden w-full shrink-0"
                style={{ height: heroCtaDoodleSpacerHeightPx }}
                aria-hidden
              />
            </>
          ) : (
            <>
              <EnterReveal direction="up" delay={0.05} ready={heroReady} className="mb-7">
                <span className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-700">
                  <BlogCreatorLogo iconOnly size="xs" className="shrink-0" />
                  <span>Free AI Blog Generator · Platform-Based Drafts</span>
                  <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Free for everyone
                  </span>
                </span>
              </EnterReveal>

              <h1
                id="hero-heading"
                className="mb-5 text-balance text-5xl font-black tracking-tight leading-[1.05] md:text-7xl lg:text-[5.5rem]"
              >
                <EnterReveal
                  as="span"
                  direction="left"
                  delay={0.15}
                  ready={heroReady}
                  className="block text-slate-900"
                >
                  The AI Blog Generator
                </EnterReveal>
                <EnterReveal
                  as="span"
                  direction="right"
                  delay={0.25}
                  ready={heroReady}
                  className="mt-1 block text-slate-900"
                >
                  That Ranks and Converts
                </EnterReveal>
              </h1>

              <EnterReveal
                as="p"
                direction="left"
                delay={0.35}
                ready={heroReady}
                className="mb-8 max-w-2xl text-balance text-lg leading-relaxed text-slate-600 md:text-xl"
              >
                Generate platform-ready drafts for your website, LinkedIn, Quora, Medium, or Substack —
                with keyword discovery, SEO analysis, and one-command MCP, skill, and API hooks.
              </EnterReveal>

              <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                <div className="relative w-fit">
                  <EnterReveal direction="left" delay={0.45} ready={heroReady}>
                    <MarketingPrimaryButton
                      type="button"
                      size="xl"
                      onClick={() => router.push('/auth/signup')}
                      className="shrink-0"
                      fullWidth={false}
                    >
                      <span className="flex items-center gap-2">
                        Get started free
                        <ArrowRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden
                        />
                      </span>
                    </MarketingPrimaryButton>
                  </EnterReveal>
                  <HeroHandwrittenCallout ready={heroReady} />
                </div>
                <EnterReveal direction="right" delay={0.5} ready={heroReady}>
                  <Link
                    href="/samples"
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50',
                      marketingFocusRing
                    )}
                  >
                    See sample output
                  </Link>
                </EnterReveal>
              </div>

              <div
                className="max-md:hidden w-full shrink-0"
                style={{ height: heroCtaDoodleSpacerHeightPx }}
                aria-hidden
              />
            </>
          )}

          <EnterReveal direction="up" delay={0.55} ready={heroReady} className="mx-auto mt-10 w-full max-w-4xl px-2">
            <DashboardPreviewMock />
            <p className="mt-3 text-center text-xs text-slate-500">
              Dashboard preview — generation and deep analysis in one workspace.{' '}
              <a href="/help#preview" className={cn('font-medium text-violet-700 underline-offset-2 hover:underline', marketingFocusRing)}>
                Full walkthrough
              </a>
            </p>
          </EnterReveal>

          <MarketingSectionDivider />
        </section>

        <TryTopicWidget />

        <div className="hidden md:block">
          <TrustedBySection />
        </div>

        <BetaTestimonialsSection />

        <MarketingSectionDivider />

        <section
          id="features"
          className={marketingLandingSection}
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-6xl">
            <ScrollReveal direction="up" className={marketingSectionHeader}>
              <span className={cn('mb-4', marketingEyebrow)}>Core features</span>
              <h2 id="features-heading" className={marketingSectionTitle}>
                AI content generation and{' '}
                <span className={marketingAccentSpan}>deep SEO analysis</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
                Studio workflows for drafting and analysis — plus MCP, agent skill, and REST API
                hooks so you can generate from the tools you already use.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
              {BLOGCREATOR_WORKFLOWS.map(
                ({ icon: Icon, title, description, shortDescription, iconSurface, iconColor, hoverBorder, tag }, i) => (
                  <motion.article
                    key={title}
                    {...scrollRevealProps(alternateScrollDirection(i), {
                      delay: i * 0.08,
                      reduced,
                    })}
                    whileHover={reduced ? undefined : { y: -2 }}
                    className={cn(
                      marketingGlassCard,
                      'group relative overflow-hidden p-5 transition-colors duration-300 md:p-7',
                      hoverBorder
                    )}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-xl',
                          iconSurface,
                          iconColor
                        )}
                      >
                        <Icon className="h-6 w-6" aria-hidden />
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {tag}
                      </span>
                    </div>

                    <h3 className="mb-2.5 text-xl font-bold text-slate-900">{title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600">{description}</p>
                    <p className="mt-3 text-xs font-medium text-slate-500">{shortDescription}</p>
                  </motion.article>
                )
              )}
            </div>

            <ScrollReveal
              direction="right"
              className={cn(
                marketingGlassCard,
                'mt-8 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left md:p-8'
              )}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                <BookOpen className="h-6 w-6" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-slate-900">Want the full walkthrough?</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  Setup guides, SEO keyword workflow, product preview, and FAQs live in our Help
                  Center.
                </p>
              </div>
              <Link
                href="/help"
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50',
                  marketingFocusRing
                )}
              >
                Help Center
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </ScrollReveal>
          </div>
        </section>

        <MarketingSectionDivider />

        <LandingPlatformSection />

        <MarketingSectionDivider />

        <LandingIntegrationsTeaser />

        <MarketingSectionDivider />

        <NewsletterSignup />

        <MarketingSectionDivider />

        <ChatGptSideBySideWidget />

        <ChatGptComparisonSection />

        <MarketingSectionDivider />

        <FaqSection compact />
      </main>

      <MarketingFooter />
    </div>
  );
}
