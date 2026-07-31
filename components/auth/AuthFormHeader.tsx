'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface AuthFormHeaderProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  badge?: string;
}

export default function AuthFormHeader({
  title,
  titleAccent,
  subtitle,
  badge,
}: AuthFormHeaderProps) {
  const reduced = useReducedMotion();

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: MARKETING_EASE }}
      className="mb-7 text-center"
    >
      {badge && (
        <span className={cn('mb-3 inline-flex', marketingEyebrow)}>{badge}</span>
      )}
      <h1 className="text-balance text-2xl font-black tracking-tight text-slate-900 sm:text-[1.85rem]">
        {title}
        {titleAccent ? (
          <>
            {' '}
            <span className={marketingAccentSpan}>{titleAccent}</span>
          </>
        ) : null}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-slate-600">
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}
