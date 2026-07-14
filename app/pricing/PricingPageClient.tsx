'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import { PRICING_FAQ, PRICING_TIERS } from '@/lib/marketing/pricingContent';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  MARKETING_EASE,
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGlassCard,
  marketingPageClass,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function PricingPageClient() {
  const router = useRouter();
  useMarketingPageBackground();

  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingDotGrid />
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: MARKETING_EASE }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className={marketingEyebrow}>Pricing</span>
          <h1 className={cn('mt-4', marketingSectionTitle)}>
            Free for everyone —{' '}
            <span className={marketingAccentSpan}>Pro coming soon</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            Start free today. No credit card.{' '}
            <strong className="font-semibold text-slate-800">Unlimited generations during beta</strong>
            {' '}— we will announce Pro limits and team features before anything changes for existing users.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          {PRICING_TIERS.map(tier => (
            <article
              key={tier.id}
              className={cn(
                marketingGlassCard,
                'flex flex-col p-6 md:p-8',
                tier.highlighted && 'ring-2 ring-violet-300'
              )}
            >
              <h2 className="text-xl font-bold text-slate-900">{tier.name}</h2>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {tier.price}
                {tier.period && (
                  <span className="text-base font-medium text-slate-500"> / {tier.period}</span>
                )}
              </p>
              <p className="mt-3 text-sm text-slate-600">{tier.description}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              {'waitlist' in tier && tier.waitlist ? (
                <Link
                  href="/contact?topic=pro-waitlist"
                  className={cn(
                    'mt-6 inline-flex justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50',
                    marketingFocusRing
                  )}
                >
                  {tier.cta}
                </Link>
              ) : (
                <MarketingPrimaryButton
                  type="button"
                  className="mt-6"
                  onClick={() => router.push('/auth/signup')}
                >
                  {tier.cta}
                </MarketingPrimaryButton>
              )}
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl space-y-4">
          <h2 className="text-center text-lg font-bold text-slate-900">Pricing FAQ</h2>
          {PRICING_FAQ.map(item => (
            <div key={item.question} className={cn(marketingGlassCard, 'p-5')}>
              <h3 className="text-sm font-bold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>

        <MarketingFooter className="mt-14" />
      </main>
    </div>
  );
}
