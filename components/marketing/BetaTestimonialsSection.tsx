'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import { BETA_TESTIMONIALS } from '@/lib/marketing/testimonials';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingGlassCard,
  marketingLandingSection,
  marketingPageContainer,
  marketingSectionHeader,
  marketingSectionTitle,
  marketingFocusRing,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function BetaTestimonialsSection() {
  const reduced = useReducedMotion();

  return (
    <section
      className={marketingLandingSection}
      aria-labelledby="testimonials-heading"
    >
      <div className={marketingPageContainer}>
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
            <ScrollReveal key={item.name} delay={index * 0.08}>
              <motion.article
                whileHover={
                  reduced
                    ? undefined
                    : { y: -4, transition: { duration: 0.25, ease: MARKETING_EASE } }
                }
                className={cn(marketingGlassCard, 'flex h-full flex-col p-5 md:p-6')}
              >
                <Quote className="mb-3 h-5 w-5 text-teal-400" aria-hidden />
                <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <footer className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800"
                    aria-hidden
                  >
                    {getInitials(item.name)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.role} · {item.context}
                    </p>
                  </div>
                </footer>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.12} className="mt-6 text-center">
          <Link
            href="/samples"
            className={cn(
              'group inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline',
              marketingFocusRing
            )}
          >
            Read sample outputs
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
