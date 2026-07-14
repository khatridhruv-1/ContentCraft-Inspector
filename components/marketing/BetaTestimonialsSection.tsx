'use client';

import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import { BETA_TESTIMONIALS } from '@/lib/marketing/testimonials';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingGlassCard,
  marketingLandingSection,
  marketingSectionHeader,
  marketingSectionTitle,
  marketingFocusRing,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function BetaTestimonialsSection() {
  return (
    <section
      className={marketingLandingSection}
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className={marketingSectionHeader}>
          <span className={marketingEyebrow}>Early beta feedback</span>
          <h2 id="testimonials-heading" className={marketingSectionTitle}>
            What beta testers{' '}
            <span className={marketingAccentSpan}>are saying</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
            Quotes from private beta users — July 2026. Names used with permission.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {BETA_TESTIMONIALS.map((item, index) => (
            <ScrollReveal key={item.name} delay={index * 0.06}>
              <article className={cn(marketingGlassCard, 'flex h-full flex-col p-5 md:p-6')}>
                <Quote className="mb-3 h-5 w-5 text-violet-400" aria-hidden />
                <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <footer className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.role} · {item.context}
                  </p>
                </footer>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.12} className="mt-6 text-center">
          <Link
            href="/samples"
            className={cn(
              'inline-flex items-center gap-2 text-sm font-semibold text-violet-700 underline-offset-4 hover:underline',
              marketingFocusRing
            )}
          >
            Read sample outputs
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
