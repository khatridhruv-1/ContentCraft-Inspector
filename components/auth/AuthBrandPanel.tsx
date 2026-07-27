'use client';

import { motion, useReducedMotion } from 'framer-motion';
import BlogCreatorLogo from '@/components/brand/BlogCreatorLogo';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: MARKETING_EASE } },
};

export default function AuthBrandPanel() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : 'hidden'}
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-8 lg:space-y-10"
    >
      <motion.div variants={rise} className="text-center lg:text-left">
        <span className={cn('mb-4', marketingEyebrow)}>
          <BlogCreatorLogo iconOnly size="xs" className="shrink-0" />
          Humanized content
        </span>
        <h2 className={cn('text-balance text-3xl md:text-4xl', marketingSectionTitle)}>
          Content that sounds{' '}
          <span className={marketingAccentSpan}>human</span>
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 lg:mx-0 mx-auto">
          Platform-native drafts, auto keyword discovery, and deep analysis — so what you publish
          reads like a person wrote it.
        </p>
      </motion.div>
    </motion.div>
  );
}
