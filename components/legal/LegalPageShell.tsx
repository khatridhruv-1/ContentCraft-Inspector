'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingPageClass,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';

interface LegalPageShellProps {
  heading: ReactNode;
  description?: string;
  children: ReactNode;
}

export default function LegalPageShell({
  heading,
  description,
  children,
}: LegalPageShellProps) {
  useMarketingPageBackground();

  return (
    <div
      className={`marketing-page min-h-screen ${marketingPageClass}`}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MARKETING_EASE }}
          className="mx-auto mb-14 max-w-6xl text-center"
        >
          <h1 className={marketingSectionTitle}>{heading}</h1>
          {description && (
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">{description}</p>
          )}
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <div className="prose-legal space-y-8 text-slate-600">{children}</div>
        </div>

        <MarketingFooter className="mt-12" />
      </main>
    </div>
  );
}

function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="mb-3 text-xl font-bold text-slate-900">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export { LegalSection };
