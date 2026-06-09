'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { AUTH_EASE } from '@/components/auth/authFeatures';
import { marketingBgClass, marketingBrandIcon } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface AuthFormPanelProps {
  children: ReactNode;
}

export default function AuthFormPanel({ children }: AuthFormPanelProps) {
  const reduced = useReducedMotion();

  return (
    <div className={cn('relative flex h-full min-h-0 flex-col', marketingBgClass)}>
      <div
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(139,92,246,0.2) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <header className="relative z-20 flex shrink-0 items-center px-6 py-4 md:justify-start">
        <Link
          href="/welcome"
          className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
        {/* Logo only when brand column is hidden (mobile) */}
        <Link href="/welcome" className="ml-auto hidden max-md:flex items-center gap-2">
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', marketingBrandIcon)}>
            <Sparkles className="h-4 w-4 text-white" aria-hidden />
          </div>
          <span className="text-sm font-semibold text-white">ContentCraft</span>
        </Link>
      </header>

      <motion.div
        id="auth-form"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: AUTH_EASE }}
        className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-y-auto overscroll-contain px-6 py-6"
      >
        <div className="w-full max-w-[380px] pb-24">
          <div className="overflow-visible rounded-2xl border border-white/[0.1] bg-white/[0.04] p-6 shadow-2xl shadow-black/40 sm:p-8">
            {children}
          </div>
        </div>
      </motion.div>

      <footer className="relative z-20 shrink-0 border-t border-white/[0.06] px-6 py-4">
        <nav
          className="mx-auto flex max-w-[380px] flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-white/40"
          aria-label="Legal and support"
        >
          <Link href="/privacy" className="hover:text-white/70 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white/70 transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-white/70 transition-colors">
            Contact
          </Link>
          <Link href="/help" className="hover:text-white/70 transition-colors">
            Help
          </Link>
        </nav>
      </footer>
    </div>
  );
}
