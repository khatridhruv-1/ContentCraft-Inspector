'use client';

import { motion, useReducedMotion } from 'framer-motion';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import { LANDING_PLATFORMS } from '@/lib/marketing/landingPlatforms';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingLandingSection,
  marketingPageContainer,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function LandingPlatformSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="platforms"
      className={marketingLandingSection}
      aria-labelledby="platforms-heading"
    >
      <div className={marketingPageContainer}>
        <ScrollReveal direction="up" className={cn(marketingSectionHeader, 'md:text-left')}>
          <div className="md:max-w-2xl">
            <span className={cn('mb-4', marketingEyebrow)}>Where you publish</span>
            <h2 id="platforms-heading" className={marketingSectionTitle}>
              One brief.{' '}
              <span className={marketingAccentSpan}>Five native formats.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
              Pick the destination first — BlogCreator shapes length, structure, and voice for
              that channel so you stop reformatting generic chat output.
            </p>
          </div>
        </ScrollReveal>

        <ol className="divide-y divide-slate-200 border-y border-slate-200">
          {LANDING_PLATFORMS.map(({ id, label, description }, index) => (
            <motion.li
              key={id}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="grid gap-2 py-6 sm:grid-cols-[minmax(10rem,14rem)_1fr] sm:gap-8 md:py-7"
            >
              <p className="text-sm font-bold text-slate-900 md:text-base">{label}</p>
              <p className="text-sm leading-relaxed text-slate-600 md:text-[15px]">{description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
