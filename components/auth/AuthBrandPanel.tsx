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
          AI Content Platform
        </span>
        <h2 className={cn('text-balance text-3xl md:text-4xl', marketingSectionTitle)}>
          Create content{' '}
          <span className={marketingAccentSpan}>that converts</span>
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 lg:mx-0 mx-auto">
          Publish faster with AI drafts, auto keyword discovery, and deep content analysis — the
          same workspace you saw on the landing page.
        </p>
      </motion.div>
    </motion.div>
  );
}
