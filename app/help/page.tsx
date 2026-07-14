'use client';

import MarketingSectionDivider from '@/components/marketing/MarketingSectionDivider';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import HelpIntegrateCta from '@/app/help/HelpIntegrateCta';
import HelpTroubleshootingSection from '@/app/help/HelpTroubleshootingSection';
import HelpPageNav from '@/components/help/HelpPageNav';
import HelpSearch from '@/components/help/HelpSearch';
import ProductPreviewSection from '@/app/welcome/ProductPreviewSection';
import SeoKeywordsSection from '@/app/welcome/SeoKeywordsSection';
import UserGuideSection from '@/app/welcome/UserGuideSection';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingPageClass,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { motion } from 'framer-motion';

export default function HelpPage() {
  useMarketingPageBackground();

  return (
    <div
      className={`min-h-screen ${marketingPageClass}`}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MARKETING_EASE }}
          className="mx-auto mb-6 max-w-6xl px-6 text-center md:mb-8"
        >
          <h1 className={marketingSectionTitle}>
            How can we <span className={marketingAccentSpan}>help?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Setup guides, SEO keyword workflow, product overview, and troubleshooting for common
            technical issues.
          </p>
        </motion.div>

        <HelpSearch />
        <HelpPageNav />

        <UserGuideSection />
        <MarketingSectionDivider />
        <HelpIntegrateCta />
        <MarketingSectionDivider />
        <SeoKeywordsSection />
        <MarketingSectionDivider />
        <ProductPreviewSection />
        <MarketingSectionDivider />
        <HelpTroubleshootingSection />

        <MarketingFooter className="mt-2" />
      </main>
    </div>
  );
}
