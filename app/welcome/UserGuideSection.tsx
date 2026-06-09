'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { UserPlus, LayoutDashboard, Wand2, BarChart2 } from 'lucide-react';
import {
  MARKETING_BG,
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Create your account',
    description: 'Sign up for free — no credit card needed. Takes less than 60 seconds.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    number: 2,
    icon: LayoutDashboard,
    title: 'Open the dashboard',
    description: 'After login, head to the dashboard to kick off your first content project.',
    gradient: 'from-cyan-400 to-sky-500',
  },
  {
    number: 3,
    icon: Wand2,
    title: 'Generate & edit content',
    description: 'Use AI tools to draft content, then refine it in the smart editor.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    number: 4,
    icon: BarChart2,
    title: 'Analyze & optimize',
    description: 'Run SEO and AI-detection analysis, apply suggestions, and publish with confidence.',
    gradient: 'from-pink-500 to-rose-500',
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
    <section data-testid="homepage-user-guide" className="mb-16" aria-labelledby="guide-heading">
      {/* Header — static violet accent, no animated gradient */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: MARKETING_EASE }}
        className="mb-12 text-center"
      >
        <span className={cn('mb-4', marketingEyebrow)}>Getting started</span>
        <h2 id="guide-heading" className={marketingSectionTitle}>
          Up and running in <span className={marketingAccentSpan}>four steps</span>
        </h2>
        {/* Contrast raised: white/40 → white/65 */}
        <p className="mt-4 text-white/65 max-w-xl mx-auto text-lg">
          From sign-up to publishing — a simple path to your first piece of AI-powered content.
        </p>
      </motion.div>

      {/* Steps grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5"
      >
        {steps.map(({ number, icon: Icon, title, description, gradient }) => (
          <motion.div
            key={number}
            variants={card}
            whileHover={reduced ? undefined : { y: -5 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] hover:shadow-2xl cursor-default"
          >
            {/* Corner glow */}
            <div
              className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
              aria-hidden
            />

            <div className="relative flex items-start gap-4">
              {/* Step icon with number badge */}
              <div className="relative shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-black text-white/65"
                  style={{ borderColor: 'rgba(255,255,255,0.1)', background: MARKETING_BG }}
                >
                  {number}
                </span>
              </div>

              <div>
                <h3 className="mb-1.5 text-lg font-bold text-white">{title}</h3>
                {/* Contrast raised: white/45 → white/65 */}
                <p className="text-sm leading-relaxed text-white/65">{description}</p>
              </div>
            </div>

            {/* Hover gradient underline */}
            <div
              className={`mt-4 h-px w-0 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:w-full`}
              aria-hidden
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
