'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  FileSearch,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/hooks/useAuthRedirect';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ModeId = 'ai-generate' | 'analyze';

const WORKFLOWS: Array<{
  id: ModeId;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  glow: string;
}> = [
  {
    id: 'ai-generate',
    title: 'AI Generate',
    description: 'Draft polished content with guided prompts and smart structure.',
    icon: Wand2,
    accent: 'from-cyan-400 to-sky-500',
    glow: 'shadow-cyan-500/25',
  },
  {
    id: 'analyze',
    title: 'Deep Analysis',
    description: 'Unlock readability, insights, outlines, and content gaps.',
    icon: FileSearch,
    accent: 'from-teal-400 to-cyan-500',
    glow: 'shadow-teal-500/25',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function AuroraBackground({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-100 via-cyan-50/80 to-slate-100" />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-32 top-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-300/35 blur-[90px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-8%] top-[8%] h-[380px] w-[380px] rounded-full bg-sky-400/30 blur-[85px]"
        animate={{ x: [0, -35, 0], y: [0, 25, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-12%] left-[30%] h-[460px] w-[460px] rounded-full bg-teal-300/25 blur-[95px]"
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.85),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/40 via-cyan-50/30 to-slate-100/90" />
    </div>
  );
}

function FloatingOrbs({ reduced }: { reduced: boolean }) {
  if (reduced) return null;

  const orbs = [
    { size: 6, left: '12%', top: '22%', delay: 0 },
    { size: 4, left: '78%', top: '18%', delay: 0.4 },
    { size: 5, left: '68%', top: '72%', delay: 0.8 },
    { size: 3, left: '24%', top: '68%', delay: 1.2 },
    { size: 4, left: '48%', top: '12%', delay: 0.6 },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full bg-cyan-400/40"
          style={{ width: orb.size, height: orb.size, left: orb.left, top: orb.top }}
          animate={{ y: [0, -14, 0], opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
        />
      ))}
    </>
  );
}

export default function Home() {
  useAuthGuard();
  const router = useRouter();
  const reduced = useReducedMotion();

  const titleWords = useMemo(() => ['Craft', 'Content', 'That', 'Converts'], []);

  const goToMode = (mode: ModeId) => router.push(`/dashboard?mode=${mode}`);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-100 text-slate-800">
      <AuroraBackground reduced={!!reduced} />
      <FloatingOrbs reduced={!!reduced} />

      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(14,116,144,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14,116,144,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <motion.main
        variants={reduced ? undefined : container}
        initial={reduced ? false : 'hidden'}
        animate={reduced ? undefined : 'show'}
        className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:py-14"
      >
        {/* top badge */}
        <motion.div variants={reduced ? undefined : rise} className="flex justify-center">
          <motion.div
            animate={reduced ? undefined : { boxShadow: ['0 0 0 rgba(34,211,238,0)', '0 0 24px rgba(34,211,238,0.25)', '0 0 0 rgba(34,211,238,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-200/80 bg-white/70 px-4 py-1.5 text-sm font-medium text-cyan-800 backdrop-blur-md"
          >
            <motion.span
              animate={reduced ? undefined : { rotate: [0, 12, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 text-cyan-600" />
            </motion.span>
            ContentCraft Inspector
          </motion.div>
        </motion.div>

        {/* hero title */}
        <motion.div variants={reduced ? undefined : rise} className="mt-10 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-700/80">
            Welcome to your studio
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            {titleWords.map((word, i) => (
              <motion.span
                key={word}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'inline-block mr-[0.28em]',
                  i === 0 || i === 3
                    ? 'bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent'
                    : 'text-slate-800'
                )}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            variants={reduced ? undefined : rise}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl"
          >
            A calm, intelligent workspace to generate and deeply analyze every piece of content —
            built for clarity, speed, and creative flow.
          </motion.p>
        </motion.div>

        {/* CTA row */}
        <motion.div
          variants={reduced ? undefined : rise}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={reduced ? undefined : { scale: 1.03 }} whileTap={reduced ? undefined : { scale: 0.98 }}>
            <Button
              size="lg"
              onClick={() => router.push('/dashboard')}
              className="relative h-12 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 px-8 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-500 hover:to-sky-500"
            >
              {!reduced && (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ['-120%', '120%'] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </motion.div>
          <motion.div whileHover={reduced ? undefined : { scale: 1.02 }} whileTap={reduced ? undefined : { scale: 0.98 }}>
            <Button
              size="lg"
              variant="outline"
              onClick={() => goToMode('ai-generate')}
              className="h-12 rounded-xl border-cyan-200/80 bg-white/60 px-8 text-base text-cyan-900 backdrop-blur-sm hover:bg-white/90"
            >
              <Zap className="mr-2 h-4 w-4 text-cyan-600" />
              Quick Generate
            </Button>
          </motion.div>
        </motion.div>

        {/* workflow cards */}
        <motion.div
          variants={reduced ? undefined : rise}
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {WORKFLOWS.map((flow, index) => (
            <motion.button
              key={flow.id}
              type="button"
              onClick={() => goToMode(flow.id)}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.1, duration: 0.55 }}
              whileHover={reduced ? undefined : { y: -8, scale: 1.02 }}
              whileTap={reduced ? undefined : { scale: 0.99 }}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-white/60 bg-white/55 p-6 text-left backdrop-blur-xl',
                'shadow-lg transition-shadow duration-300 hover:shadow-xl',
                flow.glow
              )}
            >
              <motion.div
                className={cn('absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl', flow.accent)}
                animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 5, repeat: Infinity, delay: index * 0.3 }}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md',
                    flow.accent
                  )}
                >
                  <flow.icon className="h-6 w-6" />
                </div>
                <motion.span
                  className="mt-1 text-cyan-600/70"
                  animate={reduced ? undefined : { x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.2 }}
                >
                  <ArrowRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.span>
              </div>

              <h3 className="relative mt-5 text-xl font-semibold text-slate-800">{flow.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{flow.description}</p>

              <div className="relative mt-5 h-0.5 w-0 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-500 group-hover:w-full" />
            </motion.button>
          ))}
        </motion.div>

        {/* footer strip */}
        <motion.footer
          variants={reduced ? undefined : rise}
          className="mt-auto pt-12 text-center"
        >
          <motion.p
            animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-sm text-slate-500"
          >
            Select a workflow above — or open the full dashboard for complete control
          </motion.p>
        </motion.footer>
      </motion.main>
    </div>
  );
}
