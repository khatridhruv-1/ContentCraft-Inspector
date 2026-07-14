'use client';

import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  ChevronDown,
  Sparkles,
  Search,
  Scale,
  Zap,
  Shield,
  HelpCircle,
  Bot,
  BarChart2,
  Plug,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { WELCOME_FAQ_ITEMS } from '@/lib/marketing/welcomeContent';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingLandingSection,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const FAQ_ICONS: Record<string, LucideIcon> = {
  Overview: HelpCircle,
  Generation: Sparkles,
  SEO: Search,
  Analysis: BarChart2,
  Pricing: Zap,
  Ownership: Scale,
  Security: Shield,
  Comparison: Bot,
  Integrations: Plug,
};

const COMPACT_FAQ_ITEMS = WELCOME_FAQ_ITEMS.slice(0, 6);

const FAQ_COLUMNS = [
  {
    id: 'product',
    label: 'Product & features',
    description: 'Generation, SEO, analysis, and getting started',
    items: WELCOME_FAQ_ITEMS.slice(0, 5),
    startIndex: 0,
  },
  {
    id: 'account',
    label: 'Plans, privacy & more',
    description: 'Pricing, security, ownership, and integrations',
    items: WELCOME_FAQ_ITEMS.slice(5),
    startIndex: 5,
  },
] as const;

type FaqColumnDef = {
  id: string;
  label: string;
  description: string;
  items: typeof WELCOME_FAQ_ITEMS;
  startIndex: number;
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, staggerChildren: 0.07 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

function FaqAccordionItem({
  question,
  answer,
  tag,
  index,
  isOpen,
  onToggle,
  reducedMotion,
}: {
  question: string;
  answer: string;
  tag: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reducedMotion: boolean | null;
}) {
  const Icon = FAQ_ICONS[tag] ?? HelpCircle;

  return (
    <motion.div variants={itemVariants} className="min-h-0">
      <div
        className={cn(
          'group relative rounded-xl border transition-all duration-300',
          isOpen
            ? 'border-violet-200 bg-violet-50/50 shadow-sm'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute left-0 top-0 h-full w-0.5 rounded-l-xl bg-violet-400 transition-opacity duration-200',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
        />

        <button
          id={`faq-btn-${index}`}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
          className="flex w-full items-start gap-3 px-4 py-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        >
          <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
              isOpen
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>

          <span className="min-w-0 flex-1">
            <span className="mb-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {tag}
            </span>
            <span className="block text-[0.8125rem] font-semibold leading-snug text-slate-800">
              {question}
            </span>
          </span>

          <motion.span
            className={cn(
              'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
              isOpen
                ? 'border-slate-300 bg-white text-slate-700'
                : 'border-slate-200 text-slate-400'
            )}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
          >
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          </motion.span>
        </button>

        <motion.div
          id={`faq-answer-${index}`}
          role="region"
          aria-labelledby={`faq-btn-${index}`}
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          transition={
            reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 28 }
          }
          className="overflow-hidden"
        >
          <p className="border-t border-slate-200 px-4 pb-4 pt-2.5 pl-[3.25rem] text-[0.8125rem] leading-relaxed text-slate-600">
            {answer}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function FaqColumn({
  column,
  openIndex,
  onToggle,
  reducedMotion,
}: {
  column: FaqColumnDef;
  openIndex: number | null;
  onToggle: (index: number) => void;
  reducedMotion: boolean | null;
}) {
  return (
    <motion.div
      variants={columnVariants}
      className="flex min-w-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="mb-5 shrink-0">
        <div className="mb-2.5 h-1 w-10 rounded-full bg-violet-400" aria-hidden />
        <h3 className="text-base font-bold text-slate-900">{column.label}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{column.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        {column.items.map((faq, i) => {
          const index = column.startIndex + i;
          return (
            <FaqAccordionItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              tag={faq.tag}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => onToggle(index)}
              reducedMotion={reducedMotion}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default function FaqSection({ compact = false }: { compact?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const columns: FaqColumnDef[] = compact
    ? [
        {
          id: 'top',
          label: 'Top questions',
          description: 'Pricing, platforms, SEO, and getting started',
          items: COMPACT_FAQ_ITEMS,
          startIndex: 0,
        },
      ]
    : [...FAQ_COLUMNS];

  return (
    <section
      id="faq"
      className={marketingLandingSection}
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: MARKETING_EASE }}
          className={marketingSectionHeader}
        >
          <span className={cn('mb-4', marketingEyebrow)}>FAQ</span>
          <h2 id="faq-heading" className={marketingSectionTitle}>
            Frequently asked{' '}
            <span className={marketingAccentSpan}>questions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-600">
            Answers about AI content generation, keyword discovery, SEO analysis, pricing, and
            privacy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:gap-5"
        >
          {columns.map(column => (
            <FaqColumn
              key={column.id}
              column={column}
              openIndex={openIndex}
              onToggle={toggle}
              reducedMotion={reducedMotion}
            />
          ))}
        </motion.div>

        {compact && (
          <p className="mt-6 text-center text-sm text-slate-600">
            More on{' '}
            <Link href="/pricing" className={cn('font-semibold text-violet-700', marketingFocusRing)}>
              pricing
            </Link>
            ,{' '}
            <Link href="/help#troubleshooting" className={cn('font-semibold text-violet-700', marketingFocusRing)}>
              troubleshooting
            </Link>
            , and{' '}
            <Link href="/integrate" className={cn('font-semibold text-violet-700', marketingFocusRing)}>
              integrations
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
