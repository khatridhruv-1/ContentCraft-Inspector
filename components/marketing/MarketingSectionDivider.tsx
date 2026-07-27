'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { marketingSectionDividerWrap } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

type MarketingSectionDividerProps = {
  className?: string;
};

export default function MarketingSectionDivider({ className }: MarketingSectionDividerProps) {
  const reduced = useReducedMotion();

  return (
    <div className={cn(marketingSectionDividerWrap, className)} aria-hidden>
      <div className="relative h-px w-full overflow-hidden bg-gradient-to-r from-transparent via-slate-200/90 to-transparent">
        {!reduced && (
          <motion.div
            className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-teal-500/60 to-transparent"
            animate={{ x: ['-120%', '520%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>
    </div>
  );
}
