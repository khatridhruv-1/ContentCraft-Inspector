'use client';

import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import IntegrationSection from '@/app/integrate/IntegrationSection';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingPageClass,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { motion } from 'framer-motion';

export default function IntegratePage() {
  useMarketingPageBackground();

  return (
    <div
      className={`min-h-screen ${marketingPageClass}`}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MARKETING_EASE }}
          className="mx-auto mb-10 max-w-6xl px-6 text-center"
        >
          <h1 className={marketingSectionTitle}>
            Add ContentCraft to <span className={marketingAccentSpan}>your stack</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Install via CLI — choose an MCP tool for agent chat or a Cursor skill for API-driven
            workflows. One command, works in any project.
          </p>
        </motion.div>

        <IntegrationSection />

        <MarketingFooter className="mt-4" />
      </main>
    </div>
  );
}
