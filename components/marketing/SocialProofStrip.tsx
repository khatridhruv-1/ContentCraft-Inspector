'use client';

import Link from 'next/link';
import { Globe, Linkedin, Terminal } from 'lucide-react';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGlassCard,
  marketingLandingSection,
  marketingPageContainer,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const USE_CASES = [
  {
    icon: Globe,
    title: 'Solo bloggers',
    quote:
      'I draft for my website, run keyword discovery, and fix SEO gaps before I hit publish — all in one tab.',
    surface: 'bg-teal-50 text-teal-700',
  },
  {
    icon: Linkedin,
    title: 'LinkedIn creators',
    quote:
      'Platform mode keeps the tone right for LinkedIn while still weaving in terms people are actually searching.',
    surface: 'bg-sky-50 text-sky-700',
  },
  {
    icon: Terminal,
    title: 'Developer teams',
    quote:
      'Our agents call BlogCreator through MCP — generate, analyze, and outline without wiring local API keys.',
    surface: 'bg-emerald-50 text-emerald-700',
  },
] as const;

export default function SocialProofStrip() {
  return (
    <section
      className={marketingLandingSection}
      aria-labelledby="social-proof-heading"
    >
      <div className={marketingPageContainer}>
        <ScrollReveal className={marketingSectionHeader}>
          <span className={marketingEyebrow}>Example workflows</span>
          <h2 id="social-proof-heading" className={marketingSectionTitle}>
            From first draft to{' '}
            <span className={marketingAccentSpan}>publish-ready</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            Illustrative scenarios showing how practitioners use BlogCreator — not customer
            testimonials.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {USE_CASES.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={index * 0.06}>
                <article className={cn(marketingGlassCard, 'flex h-full flex-col p-5 md:p-6')}>
                  <div
                    className={cn(
                      'mb-4 flex h-10 w-10 items-center justify-center rounded-lg',
                      item.surface
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.12} className="mt-6 text-center">
          <Link
            href="/help#preview"
            className={cn(
              'inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline',
              marketingFocusRing
            )}
          >
            See the full product walkthrough
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
