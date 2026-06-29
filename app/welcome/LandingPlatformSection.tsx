'use client';

import { motion, useReducedMotion } from 'framer-motion';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import { LANDING_PLATFORMS } from '@/lib/marketing/landingPlatforms';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingGlassCard,
  marketingLandingSection,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { scrollRevealProps } from '@/lib/marketing/scrollReveal';
import { cn } from '@/lib/utils';

export default function LandingPlatformSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="platforms"
      className={marketingLandingSection}
      aria-labelledby="platforms-heading"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal direction="up" className={marketingSectionHeader}>
          <span className={cn('mb-4', marketingEyebrow)}>Platform-based generation</span>
          <h2 id="platforms-heading" className={marketingSectionTitle}>
            Generate content for{' '}
            <span className={marketingAccentSpan}>where you publish</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Pick a platform before you generate — BlogCreator drafts in the right format, length,
            and voice for your website, LinkedIn, Quora, Medium, or Substack.
          </p>
        </ScrollReveal>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {LANDING_PLATFORMS.map(({ id, label, description }, i) => (
            <motion.li
              key={id}
              {...scrollRevealProps(i % 2 === 0 ? 'left' : 'right', {
                delay: i * 0.06,
                reduced,
              })}
              className={cn(marketingGlassCard, 'list-none p-5 md:p-6')}
            >
              <h3 className="mb-2 text-lg font-bold text-slate-900">{label}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{description}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
