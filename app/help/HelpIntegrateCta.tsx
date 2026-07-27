'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import {
  MARKETING_EASE,
  marketingFocusRing,
  marketingGlassCard,
  marketingLandingSection,
  marketingPageContainerNarrow,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function HelpIntegrateCta() {
  return (
    <section className={marketingLandingSection} aria-labelledby="help-integrate-heading">
      <div className={marketingPageContainerNarrow}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: MARKETING_EASE }}
          className={cn(
            marketingGlassCard,
            'flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left md:p-8'
          )}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Terminal className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="help-integrate-heading" className="text-lg font-bold text-slate-900">
              Need MCP, skill, or API setup?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              Full install commands, tool reference, and curl examples live on our dedicated
              integrations page — not duplicated here.
            </p>
          </div>
          <Link
            href="/integrate"
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50',
              marketingFocusRing
            )}
          >
            Open integrations
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
