'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { AUTH_FEATURES, AUTH_EASE } from '@/components/auth/authFeatures';

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: AUTH_EASE } },
};

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

export default function AuthBrandPanel() {
  const reduced = useReducedMotion();

  return (
    <aside className="relative h-full w-full min-h-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 15% 0%, rgba(139,92,246,0.24) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 85% 100%, rgba(99,102,241,0.1) 0%, transparent 50%), #09090b',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />

      {/* Plain wrapper — opacity animation left content invisible when motion did not hydrate */}
      <div className="relative z-10 flex h-full min-h-0 flex-col p-8 xl:p-10">
        <Link href="/welcome" className="inline-flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
            <Sparkles className="h-4 w-4 text-white" aria-hidden />
          </div>
          <div>
            <span className="block text-sm font-bold text-white">ContentCraft</span>
            <span className="block text-[11px] text-white/45">Inspector</span>
          </div>
        </Link>

        <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-1 custom-scrollbar">
          <motion.div
            initial={reduced ? false : 'hidden'}
            animate="show"
            variants={listVariants}
          >
            <motion.div variants={item}>
              <h2 className="text-2xl font-black leading-tight text-white xl:text-3xl">
                Create content{' '}
                <span className="text-violet-400">that converts</span>
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                Generate, edit, analyze, and publish — all in one AI workspace.
              </p>
            </motion.div>

            <motion.ul variants={item} className="mt-8 space-y-2.5">
              {AUTH_FEATURES.map(feature => {
                const Icon = feature.icon;
                return (
                  <li
                    key={feature.title}
                    className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 transition-colors hover:border-white/[0.12]"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient}`}
                    >
                      <Icon className="h-4 w-4 text-white" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white/90">{feature.title}</p>
                      <p className="truncate text-[11px] text-white/50">{feature.description}</p>
                    </div>
                  </li>
                );
              })}
            </motion.ul>
          </motion.div>
        </div>

        <p className="shrink-0 pt-4 text-[11px] text-white/35">
          Trusted by content teams who publish at scale.
        </p>
      </div>
    </aside>
  );
}
