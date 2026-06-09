'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import ProductPreviewSection from './ProductPreviewSection';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import { CONTENTCRAFT_WORKFLOWS } from '@/lib/marketing/workflows';
import {
  MARKETING_BG,
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingBrandIcon,
  marketingBrandIconMd,
  marketingEyebrow,
  marketingFocusRing,
  marketingGhostNav,
  marketingLink,
  marketingNavPill,
  marketingPageClass,
  marketingSectionTitle,
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

function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute rounded-full"
        style={{
          width: '55vw',
          height: '55vw',
          left: '-15vw',
          top: '-18vh',
          background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 68%)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '45vw',
          height: '45vw',
          right: '-12vw',
          top: '8vh',
          background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 68%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.05,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{ background: `linear-gradient(to top, ${MARKETING_BG}, transparent)` }}
      />
    </div>
  );
}

export default function Welcome() {
  const router = useRouter();
  const reduced = useReducedMotion();
  useMarketingPageBackground();

  return (
    <div
      className={cn('marketing-page min-h-screen overflow-x-hidden', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-xl"
      >
        Skip to main content
      </a>

      <BackgroundCanvas />

      <motion.nav
        initial={reduced ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: MARKETING_EASE }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3.5 md:px-12"
        aria-label="Main navigation"
      >
        <div className={cn('absolute inset-x-3 top-1.5 bottom-1 rounded-2xl -z-10', marketingNavPill)} />

        <Link href="/welcome" className="flex items-center gap-2.5" aria-label="ContentCraft Inspector home">
          <div className={cn(marketingBrandIconMd, marketingBrandIcon)}>
            <Sparkles className="h-4 w-4 text-white" aria-hidden />
          </div>
          <span className="font-bold text-white tracking-tight text-sm">ContentCraft</span>
          <span className="hidden sm:inline text-white/50 text-sm font-normal">Inspector</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <a
            href="#features"
            className={cn('hidden sm:inline px-3 py-2', marketingGhostNav, marketingFocusRing)}
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
            <span className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0" aria-hidden />
              <span>AI Content Platform</span>
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 whitespace-nowrap">
                Free plan available
              </span>
            </span>
          </motion.div>

          <motion.div variants={rise} className="mb-5">
            <h1
              id="hero-heading"
              className="text-5xl font-black tracking-tight leading-[1.05] md:text-7xl lg:text-[5.5rem]"
              aria-label="Create content that converts"
            >
              <span className="block text-white">Create Content</span>
              <span className="block mt-1 hero-gradient-text">That Converts</span>
            </h1>
          </motion.div>

          <motion.p
            variants={rise}
            className="mb-8 max-w-2xl text-lg text-white/75 md:text-xl leading-relaxed"
          >
            Publish faster with AI drafts and deep content analysis — so every piece is clear,
            findable, and ready to publish.
          </motion.p>

          <motion.div variants={rise} className="flex flex-col items-center gap-4">
            <MarketingPrimaryButton
              type="button"
              size="lg"
              onClick={() => router.push('/auth/signup')}
              className="!w-auto"
              fullWidth={false}
            >
              <span className="flex items-center gap-2">
                Get Started — It&apos;s Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" aria-hidden />
              </span>
            </MarketingPrimaryButton>

            <p className="text-sm text-white/65">
              Free plan · No credit card ·{' '}
              <Link href="/help" className={cn(marketingLink, 'underline-offset-2 hover:underline')}>
                Questions? Visit Help
              </Link>
            </p>
          </motion.div>
        </motion.section>

        <div className="mx-auto max-w-6xl px-6" aria-hidden>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
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
              <span className={cn('mb-4', marketingEyebrow)}>Everything you need</span>
              <h2 id="features-heading" className={marketingSectionTitle}>
                Your complete content{' '}
                <span className={marketingAccentSpan}>workflow in one place</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
                Two tools that match how you actually work — from first draft to publish-ready.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
              {CONTENTCRAFT_WORKFLOWS.map(({ icon: Icon, title, description, gradient, hoverBorder, tag, glowColor }, i) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: MARKETING_EASE }}
                  whileHover={reduced ? undefined : { y: -6, boxShadow: `0 12px 40px ${glowColor}` }}
                  className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 md:p-7 backdrop-blur-sm transition-colors duration-300 ${hoverBorder}`}
                >
                  <div
                    className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25`}
                    aria-hidden
                  />

                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
                    >
                      <Icon className="h-6 w-6 text-white" aria-hidden />
                    </div>
                    <span className="rounded-full border border-white/[0.1] bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/60">
                      {tag}
                    </span>
                  </div>

                  <h3 className="mb-2.5 text-xl font-bold text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-white/70">{description}</p>

                  <div
                    className={`mt-5 h-px w-0 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:w-full`}
                    aria-hidden
                  />
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <ProductPreviewSection />

        <section className="relative px-6 py-14 md:py-20" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, ease: MARKETING_EASE }}
              className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-violet-950/60 via-purple-950/40 to-violet-950/50 p-10 text-center backdrop-blur-xl md:p-14"
            >
              {!reduced && (
                <>
                  <div
                    className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl pointer-events-none"
                    aria-hidden
                  />
                  <div
                    className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/12 blur-3xl pointer-events-none"
                    aria-hidden
                  />
                </>
              )}

              <div className="relative">
                <Sparkles className="mx-auto mb-5 h-10 w-10 text-violet-400" aria-hidden />

                <h2 id="cta-heading" className={cn('mb-4', marketingSectionTitle)}>
                  Ready to create
                  <span className={cn('block', marketingAccentSpan)}>exceptional content?</span>
                </h2>

                <p className="mb-8 text-lg text-white/70 max-w-lg mx-auto">
                  Start free and run your next draft through AI generation and deep analysis in one
                  workspace.
                </p>

                <MarketingPrimaryButton
                  type="button"
                  size="xl"
                  onClick={() => router.push('/auth/signup')}
                  className="!w-auto mx-auto"
                  fullWidth={false}
                >
                  <span className="flex items-center justify-center gap-2">
                    Start Building for Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" aria-hidden />
                  </span>
                </MarketingPrimaryButton>

                <p className="mt-3 text-sm text-white/55">No credit card required · Cancel anytime</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <MarketingFooter extraLinks={[{ label: 'Features', href: '/welcome#features' }]} />

      <style jsx>{`
        .hero-gradient-text {
          background: linear-gradient(
            135deg,
            #a78bfa 0%,
            #818cf8 22%,
            #c084fc 45%,
            #a78bfa 68%,
            #818cf8 100%
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: #a78bfa;
          -webkit-text-fill-color: transparent;
          animation: hero-gradient-shift 5s ease infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-gradient-text {
            animation: none;
            background-position: 0% 50%;
          }
        }

        @media (forced-colors: active) {
          .hero-gradient-text {
            -webkit-text-fill-color: ButtonText;
            color: ButtonText;
            background: none;
          }
        }

        @keyframes hero-gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
