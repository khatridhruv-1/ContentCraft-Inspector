'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { UserPlus, LayoutDashboard, Wand2, BarChart2 } from 'lucide-react';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingGlassCard,
  marketingLandingSection,
  marketingPageContainer,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Create your account',
    description: 'Create your free account. Takes less than 60 seconds.',
    iconSurface: 'bg-teal-100',
    iconColor: 'text-teal-700',
  },
  {
    number: 2,
    icon: LayoutDashboard,
    title: 'Open the dashboard',
    description: 'After login, head to the dashboard to kick off your first content project.',
    iconSurface: 'bg-slate-100',
    iconColor: 'text-slate-700',
  },
  {
    number: 3,
    icon: Wand2,
    title: 'Draft humanized content',
    description:
      'Enter a topic — we pull trending keywords from the web, then draft platform-ready content in a clear practitioner voice.',
    iconSurface: 'bg-teal-100',
    iconColor: 'text-teal-700',
  },
  {
    number: 4,
    icon: BarChart2,
    title: 'Analyze & publish',
    description:
      'Run Deep Analysis for SEO insights, outlines, and content gaps — then publish with confidence.',
    iconSurface: 'bg-sky-50',
    iconColor: 'text-sky-700',
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const card = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function UserGuideSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="how-it-works"
      data-testid="homepage-user-guide"
      className={marketingLandingSection}
      aria-labelledby="guide-heading"
    >
      <div className={marketingPageContainer}>
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: MARKETING_EASE }}
        className={marketingSectionHeader}
      >
        <span className={cn('mb-4', marketingEyebrow)}>Getting started</span>
        <h2 id="guide-heading" className={marketingSectionTitle}>
          Up and running in <span className={marketingAccentSpan}>four steps</span>
        </h2>
        <p className="mt-4 text-slate-600 max-w-xl mx-auto text-lg">
          From sign-up to publishing — a simple path to your first humanized draft.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5"
      >
        {steps.map(({ number, icon: Icon, title, description, iconSurface, iconColor }) => (
          <motion.div
            key={number}
            variants={card}
            whileHover={reduced ? undefined : { y: -2 }}
            className={cn(
              marketingGlassCard,
              'group relative p-5 md:p-6 transition-colors duration-300 hover:border-slate-300'
            )}
          >
            <div className="relative flex items-start gap-4">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl',
                    iconSurface,
                    iconColor
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-black text-slate-500">
                  {number}
                </span>
              </div>

              <div>
                <h3 className="mb-1.5 text-lg font-bold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </section>
  );
}
