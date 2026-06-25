'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import ContentCraftLogo from '@/components/brand/ContentCraftLogo';
import ContentCraftNavBrand from '@/components/brand/ContentCraftNavBrand';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import IntegrationsLandingSection from '@/app/welcome/IntegrationsLandingSection';
import { CONTENTCRAFT_WORKFLOWS } from '@/lib/marketing/workflows';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGhostNav,
  marketingGlassCard,
  marketingLink,
  marketingNavPill,
  marketingPageClass,
  marketingSectionTitle,
  marketingSkipLink,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: MARKETING_EASE } },
};

export default function Welcome() {
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
        initial={reduced ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: MARKETING_EASE }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 md:px-12"
        aria-label="Main navigation"
      >
        <div className={cn('absolute inset-x-3 top-1.5 bottom-1 rounded-2xl -z-10', marketingNavPill)} />

        <Link
          href="/welcome"
          className="flex min-w-0 max-w-[55%] items-center sm:max-w-none"
          aria-label="ContentCraft Inspector home"
        >
          <ContentCraftNavBrand priority />
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <a
            href="#integrations"
            className={cn('hidden px-3 py-2 md:inline', marketingGhostNav, marketingFocusRing)}
          >
            Integrations
          </a>
          <a
            href="#features"
            className={cn('hidden px-3 py-2 sm:inline', marketingGhostNav, marketingFocusRing)}
          >
            Features
          </a>
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className={cn('px-4 py-2.5', marketingGhostNav, marketingFocusRing)}
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
            Get started free
          </MarketingPrimaryButton>
        </div>
      </motion.nav>

      <main id="main-content">
        <motion.section
          variants={stagger}
          initial={reduced ? false : 'hidden'}
          animate="show"
          className="relative flex flex-col items-center px-6 pt-32 pb-14 text-center md:pb-16"
          aria-labelledby="hero-heading"
        >
          <motion.div variants={rise} className="mb-7">
            <span className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-700">
              <ContentCraftLogo iconOnly size="xs" className="shrink-0" />
              <span>AI Content Generator &amp; SEO Analysis</span>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                Free plan
              </span>
            </span>
          </motion.div>

          <motion.div variants={rise} className="mb-5">
            <h1
              id="hero-heading"
              className="text-balance text-5xl font-black tracking-tight leading-[1.05] md:text-7xl lg:text-[5.5rem]"
            >
              <span className="block text-slate-900">Create SEO-Ready Content</span>
              <span className="mt-1 block text-slate-900">That Ranks and Converts</span>
            </h1>
          </motion.div>

          <motion.p
            variants={rise}
            className="mb-8 max-w-2xl text-balance text-lg leading-relaxed text-slate-600 md:text-xl"
          >
            ContentCraft Inspector combines AI blog generation, automatic keyword discovery, and
            deep SEO analysis in one workspace — plus MCP, Cursor skill, and API integrations for
            your projects.
          </motion.p>

          <motion.div variants={rise} className="flex flex-col items-center gap-4">
            <MarketingPrimaryButton
              type="button"
              size="xl"
              onClick={() => router.push('/auth/signup')}
              className="min-w-[260px]"
              fullWidth={false}
            >
              <span className="flex items-center gap-2">
                Start Free — No Credit Card
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </MarketingPrimaryButton>

            <p className="text-sm text-slate-500">
              Free plan · Cancel anytime ·{' '}
              <Link href="/integrate" className={cn(marketingLink, 'underline-offset-2 hover:underline')}>
                MCP &amp; skill integrations
              </Link>
              {' · '}
              <Link href="/help" className={cn(marketingLink, 'underline-offset-2 hover:underline')}>
                Help Center
              </Link>
            </p>
          </motion.div>
        </motion.section>

        <div className="mx-auto max-w-6xl px-6" aria-hidden>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        <section
          id="features"
          className="relative scroll-mt-24 px-6 py-14 md:py-20"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: MARKETING_EASE }}
              className="mb-12 text-center"
            >
              <span className={cn('mb-4', marketingEyebrow)}>Core features</span>
              <h2 id="features-heading" className={marketingSectionTitle}>
                AI generation and{' '}
                <span className={marketingAccentSpan}>deep content analysis</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
                Two powerful workflows in one platform — draft faster, then optimize every piece
                before you publish.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
              {CONTENTCRAFT_WORKFLOWS.map(
                ({ icon: Icon, title, description, shortDescription, iconSurface, iconColor, hoverBorder, tag }, i) => (
                  <motion.article
                    key={title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: MARKETING_EASE }}
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

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: MARKETING_EASE }}
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
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6" aria-hidden>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        <IntegrationsLandingSection />

        <section
          id="get-started"
          className="relative scroll-mt-24 px-6 py-14 md:py-20"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, ease: MARKETING_EASE }}
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm md:p-14"
            >
              <ContentCraftLogo iconOnly size="lg" className="mx-auto mb-5" />

              <h2 id="cta-heading" className={cn('mb-4', marketingSectionTitle)}>
                Start creating
                <span className={cn('block', marketingAccentSpan)}>SEO-optimized content today</span>
              </h2>

              <p className="mx-auto mb-8 max-w-lg text-lg text-slate-600">
                Join ContentCraft Inspector free — discover keywords, generate drafts, analyze
                content, and integrate via MCP or API in minutes.
              </p>

              <MarketingPrimaryButton
                type="button"
                size="xl"
                onClick={() => router.push('/auth/signup')}
                className="!w-auto mx-auto"
                fullWidth={false}
              >
                <span className="flex items-center justify-center gap-2">
                  Create Your Free Account
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </MarketingPrimaryButton>

              <p className="mt-3 text-sm text-slate-500">No credit card required</p>
            </motion.div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
