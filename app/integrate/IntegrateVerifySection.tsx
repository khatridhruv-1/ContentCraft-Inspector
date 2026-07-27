'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Terminal } from 'lucide-react';
import {
  MARKETING_EASE,
  marketingGlassCard,
  marketingLandingSection,
  marketingPageContainerNarrow,
  marketingFocusRing,
} from '@/lib/marketing/marketingTheme';
import { INTEGRATION_GITHUB_REPO_URL } from '@/lib/marketing/integrationContent';
import { cn } from '@/lib/utils';

const VERIFY_STEPS = [
  'Restart your editor or agent after install',
  'Ask your agent: "Use BlogCreator to generate a short blog outline about content marketing"',
  'Confirm you see a structured outline response (not a generic chat reply)',
] as const;

const COMMON_FIXES = [
  {
    issue: '401 or unauthorized',
    fix: 'Copy the install command from this page — API URL must point to https://blogcreator.dev',
  },
  {
    issue: 'Tool not found after install',
    fix: 'Restart Cursor or Claude Desktop completely. MCP configs load on startup.',
  },
  {
    issue: 'Install script fails',
    fix: 'Run from Terminal (bash), not inside AI chat. Requires curl and bash.',
  },
] as const;

export default function IntegrateVerifySection() {
  return (
    <section
      id="verify"
      className={marketingLandingSection}
      aria-labelledby="verify-heading"
    >
      <div className={marketingPageContainerNarrow}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, ease: MARKETING_EASE }}
          className={cn(marketingGlassCard, 'p-6 md:p-8')}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
            </span>
            <h2 id="verify-heading" className="text-lg font-bold text-slate-900">
              Verify your install
            </h2>
          </div>

          <ol className="mb-6 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            {VERIFY_STEPS.map(step => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Terminal className="h-4 w-4 text-slate-500" aria-hidden />
            Common fixes
          </h3>
          <ul className="space-y-3">
            {COMMON_FIXES.map(item => (
              <li
                key={item.issue}
                className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm"
              >
                <span className="font-semibold text-slate-800">{item.issue}</span>
                <span className="text-slate-600"> — {item.fix}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm text-slate-600">
            Still stuck?{' '}
            <Link href="/help#troubleshooting" className={cn('font-semibold text-teal-700', marketingFocusRing)}>
              Help troubleshooting
            </Link>{' '}
            or{' '}
            <Link href="/contact" className={cn('font-semibold text-teal-700', marketingFocusRing)}>
              contact support
            </Link>
            {' · '}
            <a
              href={INTEGRATION_GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn('font-semibold text-teal-700', marketingFocusRing)}
            >
              GitHub repo
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
