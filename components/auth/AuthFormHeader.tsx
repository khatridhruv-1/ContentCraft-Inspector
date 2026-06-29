'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MARKETING_EASE } from '@/lib/marketing/marketingTheme';
import { marketingEyebrow } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface AuthFormHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export default function AuthFormHeader({ title, subtitle, badge }: AuthFormHeaderProps) {
  const reduced = useReducedMotion();

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: MARKETING_EASE }}
      className="mb-6 text-center lg:text-left"
    >
      {badge && (
        <span className={cn('mb-4', marketingEyebrow)}>{badge}</span>
      )}
      <h1 className="text-balance text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">{subtitle}</p>
      )}
    </motion.header>
  );
}
