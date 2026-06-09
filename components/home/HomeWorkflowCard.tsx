'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AUTH_EASE } from '@/components/auth/authFeatures';
import { homeFocusRing } from '@/components/home/homeLayout';
import type { HomeWorkflow } from '@/components/home/homeWorkflows';
import { cn } from '@/lib/utils';

type HomeWorkflowCardProps = {
  workflow: HomeWorkflow;
  index: number;
  onSelect: () => void;
};

export default function HomeWorkflowCard({ workflow, index, onSelect }: HomeWorkflowCardProps) {
  const reduced = useReducedMotion();
  const { title, description, icon: Icon, gradient, hoverBorder, tag, glowColor } = workflow;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: AUTH_EASE }}
      whileHover={reduced ? undefined : { y: -4, boxShadow: `0 10px 32px ${glowColor}` }}
      whileTap={reduced ? undefined : { scale: 0.99 }}
      aria-label={`Open ${title}`}
      className={cn(
        'group relative flex min-h-[148px] w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left shadow-sm shadow-black/20 backdrop-blur-sm transition-colors',
        hoverBorder,
        homeFocusRing
      )}
    >
      <div
        className={cn(
          'absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25',
          gradient
        )}
        aria-hidden
      />

      <div className="mb-3.5 flex items-center justify-between">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md',
            gradient
          )}
        >
          <Icon className="h-5 w-5 text-white" aria-hidden />
        </div>
        <span className="rounded-full border border-white/[0.1] bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/60">
          {tag}
        </span>
      </div>

      <h3 className="text-lg font-bold leading-snug text-white">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{description}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div
          className={cn(
            'h-px w-8 rounded-full bg-gradient-to-r transition-all duration-500 group-hover:w-full',
            gradient
          )}
          aria-hidden
        />
        <ArrowRight
          className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-violet-400"
          aria-hidden
        />
      </div>
    </motion.button>
  );
}
