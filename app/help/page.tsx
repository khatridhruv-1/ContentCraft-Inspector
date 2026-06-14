'use client';

import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import FaqSection from '@/app/welcome/FaqSection';
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

      <main className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MARKETING_EASE }}
          className="mx-auto mb-10 max-w-6xl px-6 text-center"
        >
          <h1 className={marketingSectionTitle}>
            How can we <span className={marketingAccentSpan}>help?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Guides, SEO workflow details, product overview, and answers to common questions.
          </p>
        </motion.div>

        <UserGuideSection />
        <SeoKeywordsSection />
        <ProductPreviewSection />
        <FaqSection />

        <MarketingFooter className="mt-4" />
      </main>
    </div>
  );
}
