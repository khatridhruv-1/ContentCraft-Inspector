'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronDown, Zap, Shield, TrendingUp, Star } from 'lucide-react';
import styles from './HeroSection.module.css';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const AVATARS = [
  { initials: 'SB', gradient: 'from-violet-500 to-purple-600' },
  { initials: 'JK', gradient: 'from-cyan-400 to-sky-500' },
  { initials: 'AM', gradient: 'from-blue-500 to-indigo-500' },
  { initials: 'RT', gradient: 'from-pink-500 to-rose-500' },
  { initials: 'LW', gradient: 'from-amber-400 to-orange-500' },
];

// Semantic icon colors — Experts 4, 10: amber=speed/quality, emerald=trust/accuracy
const stats = [
  { label: 'Faster content creation', icon: Zap,        iconColor: 'text-amber-400',   countEnd: 10,  countSuffix: '×', countDecimals: 0 },
  { label: 'AI detection accuracy',   icon: Shield,     iconColor: 'text-emerald-400', countEnd: 98,  countSuffix: '%', countDecimals: 0 },
  { label: 'Content formats',         icon: TrendingUp, iconColor: 'text-violet-400',  countEnd: 50,  countSuffix: '+', countDecimals: 0 },
  { label: 'User satisfaction',       icon: Star,       iconColor: 'text-amber-400',   countEnd: 4.9, countSuffix: '★', countDecimals: 1 },
];

// ─── Count-up component (Expert 6) ───────────────────────────────────────────

function CountUp({
  end,
  suffix = '',
  decimals = 0,
  reduced,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(reduced ? end : 0);

  useEffect(() => {
    if (!inView || reduced) {
      setCount(end);
      return;
    }
    const totalSteps = 55;
    const duration = 1400;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(end * eased);
      if (step >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      }
    }, duration / totalSteps);
    return () => clearInterval(timer);
  }, [inView, end, reduced]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count);
  return <span ref={ref}>{display}{suffix}</span>;
}

// ─── Stats grid sub-component ─────────────────────────────────────────────────

function StatsGrid({ reduced }: { reduced: boolean }) {
  return (
    <>
      <motion.div
        variants={rise}
        className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 w-full max-w-3xl"
      >
        {stats.map(({ label, icon: Icon, iconColor, countEnd, countSuffix, countDecimals }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm"
          >
            <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden />
            <span className="text-2xl font-black text-white tabular-nums">
              <CountUp
                end={countEnd}
                suffix={countSuffix}
                decimals={countDecimals}
                reduced={reduced}
              />
            </span>
            <span className="text-[11px] text-white/60 text-center leading-tight">{label}</span>
          </div>
        ))}
      </motion.div>
      <motion.p variants={rise} className="mt-2.5 text-[11px] text-white/30">
        * Based on platform data and user surveys · Q1 2025
      </motion.p>
    </>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────

export default function HeroSection() {
  const router = useRouter();
  const reduced = useReducedMotion();

  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative flex flex-col items-center px-6 pt-32 pb-16 text-center"
      aria-labelledby="hero-heading"
    >
      {/* Badge */}
      <motion.div variants={rise} className="mb-7">
        <span className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-4 py-1.5 text-sm font-medium text-white/75 backdrop-blur-sm max-w-xs sm:max-w-none">
          <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <span>AI Content Platform</span>
          <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 whitespace-nowrap">
            Free plan available
          </span>
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div variants={rise} className="mb-5">
        <h1 id="hero-heading" className="text-5xl font-black tracking-tight leading-[1.05] md:text-7xl lg:text-[5.5rem]">
          <span className="block text-white">Create Content</span>
          {/* Gradient constrained to violet-purple-indigo family (Experts 1, 9) */}
          <span className={`block mt-1 ${styles.heroGradientText}`}>That Converts</span>
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        variants={rise}
        className="mb-7 max-w-2xl text-lg text-white/70 md:text-xl leading-relaxed"
      >
        The all-in-one AI workspace to generate, edit, analyze, and perfect every piece of
        content — built for speed, clarity, and creative impact.
      </motion.p>

      {/* Social proof ABOVE CTA — reduces pre-CTA anxiety (Expert 7) */}
      <motion.div variants={rise} className="mb-7 flex items-center gap-3">
        <div className="flex -space-x-2" aria-hidden>
          {AVATARS.map(({ initials, gradient }) => (
            <div
              key={initials}
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-[9px] font-black text-white bg-gradient-to-br ${gradient}`}
              style={{ borderColor: '#09090b' }}
            >
              {initials}
            </div>
          ))}
        </div>
        <p className="text-sm text-white/55">
          <span className="font-semibold text-white/85">10,000+</span>{' '}
          creators already using ContentCraft
        </p>
      </motion.div>

      {/* Primary CTA — brand gradient violet→purple (Experts 1, 10) */}
      <motion.div variants={rise} className="flex flex-col items-center gap-4">
        <motion.button
          onClick={() => router.push('/auth/signup')}
          whileHover={reduced ? undefined : { scale: 1.04 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 px-9 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(139,92,246,0.35)] hover:shadow-[0_0_60px_rgba(139,92,246,0.52)] transition-shadow duration-300"
        >
          <span
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
            aria-hidden
          />
          <span className="relative flex items-center gap-2">
            Get Started — It&apos;s Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
          </span>
        </motion.button>

        {/* Micro-copy — contrast raised white/45 → white/55 (Expert 3) */}
        <p className="text-xs text-white/55">
          Free forever on basic plan · No credit card required
        </p>

        <button
          onClick={() => router.push('/auth/login')}
          className="text-sm text-white/45 hover:text-white/80 transition-colors"
        >
          Already have an account?{' '}
          <span className="text-violet-400 hover:text-violet-300 font-medium">Sign in →</span>
        </button>
      </motion.div>

      <StatsGrid reduced={!!reduced} />

      {!reduced && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-1 text-white/25"
          aria-hidden
        >
          <span className="text-[10px] uppercase tracking-[0.2em]">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}
