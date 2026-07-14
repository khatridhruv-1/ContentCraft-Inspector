'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingLandingSection,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';
import DashboardPreviewMock from '@/components/marketing/DashboardPreviewMock';

export default function ProductPreviewSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="preview"
      className={marketingLandingSection}
      aria-labelledby="preview-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: MARKETING_EASE }}
          className={marketingSectionHeader}
        >
          <span className={cn('mb-4', marketingEyebrow)}>Product preview</span>
          <h2 id="preview-heading" className={marketingSectionTitle}>
            One workspace for{' '}
            <span className={marketingAccentSpan}>generation and analysis</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            Discover keywords, generate drafts, then run SEO, readability, and content-gap
            analysis — without switching tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: MARKETING_EASE }}
          whileHover={reduced ? undefined : { y: -4 }}
        >
          <DashboardPreviewMock />
        </motion.div>
      </div>
    </section>
  );
}
