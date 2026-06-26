'use client';

import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import IntegrationSection from '@/app/integrate/IntegrationSection';
import {
  INTEGRATION_HERO_EYEBROW,
  INTEGRATION_HERO_SUBTITLE,
  INTEGRATION_HERO_TITLE,
} from '@/lib/marketing/integrationContent';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingEyebrow,
  marketingPageClass,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function IntegratePage() {
  useMarketingPageBackground();

  return (
    <div
      className={cn('marketing-page relative min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingDotGrid />
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="relative pb-12 pt-8 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: MARKETING_EASE }}
          className="mx-auto max-w-6xl px-6 text-center"
        >
          <span className={marketingEyebrow}>{INTEGRATION_HERO_EYEBROW}</span>
          <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-4xl md:leading-tight">
            {INTEGRATION_HERO_TITLE}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-slate-700">
            {INTEGRATION_HERO_SUBTITLE}
          </p>
        </motion.div>

        <IntegrationSection />

        <MarketingFooter className="relative mt-12" />
      </main>
    </div>
  );
}
