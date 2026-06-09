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
  Download,
  Globe,
  Rocket,
  HelpCircle,
  MessageCircle,
  Bot,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type FaqItem = {
  question: string;
  answer: string;
  icon: LucideIcon;
  tag: string;
};

const faqs: FaqItem[] = [
  {
    question: 'What types of content can I generate with ContentCraft Inspector?',
    answer:
      'You can generate blog posts, social media captions, product descriptions, ad copy, email drafts, and long-form articles. Simply provide a topic or brief, choose your tone and format, and the AI produces a ready-to-edit draft in seconds.',
    icon: Sparkles,
    tag: 'Generation',
  },
  {
    question: 'How does the SEO analysis work?',
    answer:
      'ContentCraft Inspector scans your content for keyword density, readability score, meta-tag completeness, and heading structure — then scores each factor against current search-engine best practices. You get a prioritised list of fixes so you know exactly what to change to improve ranking potential.',
    icon: Search,
    tag: 'SEO',
  },
  {
    question: 'Does ContentCraft Inspector support multiple languages?',
    answer:
      'Yes — content generation and analysis are supported in multiple languages, including English, Spanish, French, German, Portuguese, and Japanese. Select your target language before generating, or paste existing content for multilingual SEO analysis.',
    icon: Globe,
    tag: 'Languages',
  },
  {
    question: "How do I get started if I'm not a writer?",
    answer:
      "No writing experience is needed. Choose a content type, fill in a short prompt describing your topic and audience, and the AI handles the rest. The generated content is ready to use or analyze instantly.",
    icon: Rocket,
    tag: 'Getting started',
  },
  {
    question: 'Who owns the content I create?',
    answer:
      'You do — entirely. All content you generate or upload belongs to you. ContentCraft Inspector does not claim any licence or ownership over your work, and we never use your content to train our models.',
    icon: Scale,
    tag: 'Ownership',
  },
  {
    question: "What's the difference between the Free and Pro plans?",
    answer:
      'The Free plan gives you access to AI generation and basic deep analysis with a monthly usage limit. Pro unlocks unlimited generations, advanced analysis, priority processing, and team collaboration seats.',
    icon: Zap,
    tag: 'Pricing',
  },
  {
    question: 'Is my content private and secure?',
    answer:
      'Yes. All data is encrypted in transit and at rest using industry-standard encryption. Your drafts and projects are visible only to you — or to team members you explicitly invite. We never share your data with third parties.',
    icon: Shield,
    tag: 'Security',
  },
  {
    question: 'How is this different from just using ChatGPT?',
    answer:
      'ContentCraft Inspector is purpose-built for the full content workflow — not just generation. It combines AI writing with deep analysis (readability, SEO insights, content gaps, outlines, and info gain) in one seamless workspace. ChatGPT requires you to assemble those tools yourself.',
    icon: Bot,
    tag: 'vs ChatGPT',
  },
  {
    question: 'Can I export my content to other formats?',
    answer:
      'Yes — export any piece of content as plain text, Markdown, or HTML directly from the editor. Copy-to-clipboard is available for every format, making it easy to paste into your CMS, email tool, or document editor.',
    icon: Download,
    tag: 'Export',
  },
];

const FAQ_COLUMNS = [
  {
    id: 'product',
    label: 'Product & features',
    description: 'Generation, SEO, languages, and getting started',
    items: faqs.slice(0, 4),
    startIndex: 0,
    gradient: 'from-violet-500 to-cyan-500',
  },
  {
    id: 'account',
    label: 'Plans, privacy & more',
    description: 'Pricing, security, ownership, export, and comparisons',
    items: faqs.slice(4),
    startIndex: 4,
    gradient: 'from-cyan-500 to-blue-500',
  },
] as const;

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
  faq,
  index,
  isOpen,
  onToggle,
  reducedMotion,
}: {
  faq: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  reducedMotion: boolean | null;
}) {
  const Icon = faq.icon;

  return (
    <motion.div variants={itemVariants} className="min-h-0">
      <div
        className={cn(
          'group relative rounded-xl border transition-all duration-300',
          isOpen
            ? 'border-white/[0.15] bg-white/[0.06] shadow-lg'
            : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.05]'
        )}
      >
        {/* Left accent bar */}
        <span
          aria-hidden
          className={cn(
            'absolute left-0 top-0 h-full w-0.5 rounded-l-xl bg-gradient-to-b from-violet-400 via-cyan-400 to-blue-400 transition-opacity duration-200',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
        />

        <button
          id={`faq-btn-${index}`}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
          className="flex w-full items-start gap-3 px-4 py-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
              isOpen
                ? 'bg-gradient-to-br from-violet-500 to-cyan-500 text-white'
                : 'bg-white/[0.07] text-white/55 group-hover:bg-white/[0.12] group-hover:text-white/75'
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>

          <span className="min-w-0 flex-1">
            <span className="mb-1 inline-flex rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
              {faq.tag}
            </span>
            {/* Contrast raised: text-white/80 kept (already fine) */}
            <span className="block text-[0.8125rem] font-semibold leading-snug text-white/85">
              {faq.question}
            </span>
          </span>

          <motion.span
            className={cn(
              'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
              isOpen
                ? 'border-white/[0.15] bg-white/[0.08] text-white/75'
                : 'border-white/[0.08] text-white/40'
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
          {/* Contrast raised: white/45 → white/65 */}
          <p className="border-t border-white/[0.06] px-4 pb-4 pt-2.5 pl-[3.25rem] text-[0.8125rem] leading-relaxed text-white/65">
            {faq.answer}
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
  column: (typeof FAQ_COLUMNS)[number];
  openIndex: number | null;
  onToggle: (index: number) => void;
  reducedMotion: boolean | null;
}) {
  return (
    <motion.div
      variants={columnVariants}
      className="flex min-w-0 flex-1 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-sm sm:p-5"
    >
      <div className="mb-5 shrink-0">
        <div className={cn('mb-2.5 h-1 w-10 rounded-full bg-gradient-to-r', column.gradient)} aria-hidden />
        <h3 className="text-base font-bold text-white">{column.label}</h3>
        {/* Contrast raised: white/35 → white/55 */}
        <p className="mt-0.5 text-xs text-white/55">{column.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        {column.items.map((faq, i) => {
          const index = column.startIndex + i;
          return (
            <FaqAccordionItem
              key={faq.question}
              faq={faq}
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

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <motion.section
      id="faq"
      data-testid="homepage-faq"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      }}
      className="relative mb-16 scroll-mt-8"
      aria-labelledby="faq-heading"
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -left-12 top-1/4 h-48 w-48 rounded-full bg-violet-500/8 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-56 w-56 rounded-full bg-cyan-500/6 blur-3xl" aria-hidden />

      {/* Section header — static violet accent, no animated gradient */}
      <motion.div variants={columnVariants} className="relative mb-10 text-center">
        {/* Cyan-tinted badge — differentiates FAQ section (Expert 5) */}
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/[0.05] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/55">
          <HelpCircle className="h-3.5 w-3.5" aria-hidden />
          FAQ
        </span>
        <h2 id="faq-heading" className="mb-2 text-4xl font-black tracking-tight text-white md:text-5xl">
          Frequently asked{' '}
          {/* violet-300 → violet-400 for visual hierarchy (Expert 9) */}
          <span className="text-violet-400">questions</span>
        </h2>
        {/* Contrast raised: white/40 → white/65 */}
        <p className="mx-auto max-w-lg text-white/65 text-base">
          Everything you need to know — split into product and account topics so you can scan faster.
        </p>
      </motion.div>

      {/* Columns */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="relative mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-start sm:gap-5"
      >
        {FAQ_COLUMNS.map(column => (
          <FaqColumn
            key={column.id}
            column={column}
            openIndex={openIndex}
            onToggle={toggle}
            reducedMotion={reducedMotion}
          />
        ))}
      </motion.div>

      {/* Bottom CTA strip */}
      <motion.div variants={columnVariants} className="mx-auto mt-6 max-w-5xl">
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-violet-950/50 via-white/[0.02] to-cyan-950/50 px-5 py-4 backdrop-blur-sm sm:flex-row sm:px-6">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/20">
              <MessageCircle className="h-4 w-4 text-white" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-white">Still have questions?</p>
              {/* Contrast raised: white/40 → white/60 */}
              <p className="text-xs text-white/60">
                Start free — explore the dashboard and see it in action.
              </p>
            </div>
          </div>
          <motion.a
            href="/auth/signup"
            className="group relative inline-flex shrink-0 overflow-hidden items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            whileHover={reducedMotion ? undefined : { scale: 1.03 }}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
          >
            {/* CSS hover shimmer */}
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              aria-hidden
            />
            <span className="relative">Get started free</span>
          </motion.a>
        </div>
      </motion.div>
    </motion.section>
  );
}
