'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AUTH_EASE } from '@/components/auth/authFeatures';
import { homeFocusRing } from '@/components/home/homeLayout';
import { marketingGlassCard } from '@/lib/marketing/marketingTheme';
import type { HomeWorkflow } from '@/components/home/homeWorkflows';
import { cn } from '@/lib/utils';

type HomeWorkflowCardProps = {
  workflow: HomeWorkflow;
  index: number;
  onSelect: () => void;
};

export default function HomeWorkflowCard({ workflow, index, onSelect }: HomeWorkflowCardProps) {
  const reduced = useReducedMotion();
  const { title, description, icon: Icon, iconSurface, iconColor, hoverBorder, tag } = workflow;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: AUTH_EASE }}
      whileHover={reduced ? undefined : { y: -2 }}
      whileTap={reduced ? undefined : { scale: 0.99 }}
      aria-label={`Open ${title}`}
      className={cn(
        marketingGlassCard,
        'group relative flex w-full flex-col p-5 text-left transition-colors duration-300 md:p-7',
        hoverBorder,
        homeFocusRing
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            iconSurface,
            iconColor
          )}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {tag}
        </span>
      </div>

      <h3 className="mb-2.5 text-xl font-bold text-slate-900">{title}</h3>
      <p className="flex-1 text-sm leading-relaxed text-slate-600">{description}</p>

      <div className="mt-5 flex items-center justify-end">
        <ArrowRight
          className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:translate-x-0.5 group-hover:text-violet-600"
          aria-hidden
        />
      </div>
    </motion.button>
  );
}
