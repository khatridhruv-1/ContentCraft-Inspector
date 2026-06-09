'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AUTH_EASE } from '@/components/auth/authFeatures';
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
      transition={{ duration: 0.55, ease: AUTH_EASE }}
      className="mb-7"
    >
      {badge && (
        <span className={cn('mb-4 px-3 py-1 text-[11px] text-violet-200/90', marketingEyebrow)}>
          {badge}
        </span>
      )}
      <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-[2rem]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-[15px] leading-relaxed text-white/65">{subtitle}</p>
      )}
    </motion.header>
  );
}
