'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import {
  Wand2,
  Edit3,
  FileSearch,
  Gauge,
  Sparkles,
  ArrowRight,
  Zap,
  Star,
  Shield,
  TrendingUp,
  ChevronDown,
  Quote,
} from 'lucide-react';
import FaqSection from './FaqSection';
import UserGuideSection from './UserGuideSection';

// ─── Feature data ────────────────────────────────────────────────────────────

const features = [
  {
    icon: Wand2,
    title: 'AI Generation',
    description:
      'Draft polished blog posts, ad copy, and email sequences in seconds with guided prompts and smart AI structure.',
    gradient: 'from-violet-500 to-purple-600',
    hoverBorder: 'hover:border-violet-500/40',
    tag: 'AI Powered',
    glowColor: 'rgba(139,92,246,0.28)',
  },
  {
    icon: Edit3,
    title: 'Smart Editor',
    description:
      'Write, refine, and shape your unique voice in a focused workspace with real-time inline AI suggestions.',
    gradient: 'from-cyan-400 to-sky-500',
    hoverBorder: 'hover:border-cyan-400/40',
    tag: 'Real-time',
    glowColor: 'rgba(34,211,238,0.22)',
  },
  {
    icon: FileSearch,
    title: 'Deep Analysis',
    description:
      'Unlock readability scores, SEO insights, content-gap detection, and competitive intelligence instantly.',
    gradient: 'from-blue-500 to-indigo-500',
    hoverBorder: 'hover:border-blue-500/40',
    tag: 'Analytics',
    glowColor: 'rgba(99,102,241,0.26)',
  },
  {
    icon: Gauge,
    title: 'Realness Score',
    description:
      'Measure AI influence in any text and humanise tone with surgical precision so your content feels authentically human.',
    gradient: 'from-pink-500 to-rose-500',
    hoverBorder: 'hover:border-pink-500/40',
    tag: 'Detection',
    glowColor: 'rgba(236,72,153,0.24)',
  },
];

// Semantic icon colors — Experts 4, 10: amber=speed/quality, emerald=trust/accuracy
const stats = [
  { label: 'Faster content creation', icon: Zap,        iconColor: 'text-amber-400',   countEnd: 10,  countSuffix: '×', countDecimals: 0 },
  { label: 'AI detection accuracy',   icon: Shield,     iconColor: 'text-emerald-400', countEnd: 98,  countSuffix: '%', countDecimals: 0 },
  { label: 'Content formats',         icon: TrendingUp, iconColor: 'text-violet-400',  countEnd: 50,  countSuffix: '+', countDecimals: 0 },
  { label: 'User satisfaction',       icon: Star,       iconColor: 'text-amber-400',   countEnd: 4.9, countSuffix: '★', countDecimals: 1 },
];

// Testimonials — Experts 6, 8, 10: critical credibility layer between Features and Guide
const testimonials = [
  {
    quote:
      'ContentCraft cut our content production time by 70%. The AI generation + SEO analysis combo is unbeatable.',
    name: 'Sarah M.',
    role: 'Content Director, TechFlow',
    initials: 'SM',
    gradient: 'from-violet-500 to-purple-600',
    rating: 5,
  },
  {
    quote:
      'The Realness Score changed everything. Our blog posts now pass every AI detector while keeping the quality high.',
    name: 'James K.',
    role: 'SEO Lead, GrowthHQ',
    initials: 'JK',
    gradient: 'from-cyan-400 to-sky-500',
    rating: 5,
  },
  {
    quote:
      'Finally a tool that does generation AND analysis in one place. Stopped switching between 4 different tools.',
    name: 'Priya R.',
    role: 'Founder, NeuralCopy',
    initials: 'PR',
    gradient: 'from-emerald-400 to-teal-500',
    rating: 5,
  },
];

// Social proof avatars
const AVATARS = [
  { initials: 'SB', gradient: 'from-violet-500 to-purple-600' },
  { initials: 'JK', gradient: 'from-cyan-400 to-sky-500' },
  { initials: 'AM', gradient: 'from-blue-500 to-indigo-500' },
  { initials: 'RT', gradient: 'from-pink-500 to-rose-500' },
  { initials: 'LW', gradient: 'from-amber-400 to-orange-500' },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

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

// ─── Background canvas ────────────────────────────────────────────────────────

function BackgroundCanvas({ reduced }: { reduced: boolean }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {!reduced && (
        <>
          {/* Primary violet orb — left */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '55vw',
              height: '55vw',
              left: '-15vw',
              top: '-18vh',
              background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 68%)',
            }}
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Indigo orb — right (Expert 2: changed from cyan to match brand) */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '45vw',
              height: '45vw',
              right: '-12vw',
              top: '8vh',
              background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 68%)',
            }}
            animate={{ x: [0, -35, 0], y: [0, 22, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Violet mid-page orb */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '60vw',
              height: '60vw',
              left: '20%',
              top: '45%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 68%)',
            }}
            animate={{ x: [0, 25, 0], y: [0, -22, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Amber warmth orb — bottom right (Expert 10: color temperature variety) */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: '30vw',
              height: '30vw',
              right: '5%',
              bottom: '22%',
              background: 'radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 68%)',
            }}
            animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {/* Dot grid — refined: opacity 0.05, 40px spacing (Experts 2, 9) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.05,
        }}
      />

      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{ background: 'linear-gradient(to top, #09090b, transparent)' }}
      />
    </div>
  );
}

// ─── Testimonials section (Experts 6, 8, 10) ─────────────────────────────────

function TestimonialsSection({ reduced }: { reduced: boolean }) {
  return (
    <section className="relative py-16 md:py-20" aria-labelledby="testimonials-heading">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 text-center"
      >
        {/* Amber-tinted badge — differentiates from other section badges (Expert 5) */}
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/[0.05] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/55">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
          Loved by creators
        </span>
        <h2 id="testimonials-heading" className="text-4xl font-black tracking-tight text-white md:text-5xl">
          Trusted by{' '}
          <span className="text-violet-400">10,000+ creators</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60 text-base">
          Here&apos;s what they say after switching to ContentCraft Inspector.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={reduced ? undefined : { y: -5 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.14]"
          >
            <Quote className="mb-4 h-6 w-6 text-violet-400/40" aria-hidden />

            <div className="mb-3 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
              ))}
            </div>

            <p className="mb-5 text-sm leading-relaxed text-white/70">&ldquo;{t.quote}&rdquo;</p>

            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-[11px] font-black text-white`}
              >
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/85">{t.name}</p>
                <p className="text-xs text-white/45">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Welcome() {
  const router = useRouter();
  const reduced = useReducedMotion();

  useEffect(() => {
    const prev = document.body.style.background;
    const prevColor = document.body.style.backgroundColor;
    document.body.style.background = '#09090b';
    document.body.style.backgroundColor = '#09090b';
    return () => {
      document.body.style.background = prev;
      document.body.style.backgroundColor = prevColor;
    };
  }, []);

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        /* Dimensional dark — subtle violet aurora at top (Expert 7) */
        background:
          'radial-gradient(ellipse 110% 55% at 50% -5%, rgba(139,92,246,0.13) 0%, transparent 55%), #09090b',
        color: 'white',
      }}
    >
      <BackgroundCanvas reduced={!!reduced} />

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3.5 md:px-12"
        aria-label="Main navigation"
      >
        {/* More opaque nav backdrop (Expert 2) */}
        <div className="absolute inset-x-3 top-1.5 bottom-1 rounded-2xl border border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl -z-10" />

        {/* Logo — gradient aligned to brand (Expert 8) */}
        <a href="/welcome" className="flex items-center gap-2.5" aria-label="ContentCraft Inspector home">
          <motion.div
            whileHover={reduced ? undefined : { rotate: [0, 12, -8, 0], transition: { duration: 0.5 } }}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30"
          >
            <Sparkles className="h-4 w-4 text-white" />
          </motion.div>
          <span className="font-bold text-white tracking-tight text-sm">ContentCraft</span>
          <span className="hidden sm:inline text-white/40 text-sm font-normal">Inspector</span>
        </a>

        {/* Nav actions — rounded-xl consistency (Expert 3) */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-sm text-white/55 hover:text-white/90 transition-colors px-3 py-1.5 rounded-xl hover:bg-white/[0.05]"
          >
            Sign in
          </button>
          <motion.button
            onClick={() => router.push('/auth/signup')}
            whileHover={reduced ? undefined : { scale: 1.03 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20"
          >
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              aria-hidden
            />
            <span className="relative">Get started free</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
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
            <span className="block mt-1 hero-gradient-text">That Converts</span>
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

        {/* Stats grid — count-up animation + semantic icon colors (Experts 4, 6) */}
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
                  reduced={!!reduced}
                />
              </span>
              <span className="text-[11px] text-white/60 text-center leading-tight">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.p variants={rise} className="mt-2.5 text-[11px] text-white/30">
          * Based on platform data and user surveys · Q1 2025
        </motion.p>

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

      {/* ── Section divider ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6" aria-hidden>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
      </div>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-16 md:py-24" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 text-center"
          >
            {/* Violet-tinted badge — differentiates Features section (Expert 5) */}
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.05] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/55">
              Everything you need
            </span>
            <h2 id="features-heading" className="text-4xl font-black tracking-tight text-white md:text-5xl">
              Your complete content{' '}
              {/* Downgraded violet-300 → violet-400 for visual hierarchy (Expert 9) */}
              <span className="text-violet-400">workflow in one place</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60 text-lg">
              Four powerful tools, one seamless experience — from blank page to published.
            </p>
          </motion.div>

          {/* Feature cards — per-card colored hover glow (Experts 4, 8) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {features.map(({ icon: Icon, title, description, gradient, hoverBorder, tag, glowColor }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduced ? undefined : { y: -6, boxShadow: `0 12px 40px ${glowColor}` }}
                className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 md:p-7 backdrop-blur-sm transition-colors duration-300 cursor-pointer ${hoverBorder}`}
              >
                <div
                  className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25`}
                  aria-hidden
                />

                <div className="mb-5 flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="rounded-full border border-white/[0.1] bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/55">
                    {tag}
                  </span>
                </div>

                <h3 className="mb-2.5 text-xl font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-white/65">{description}</p>

                <div
                  className={`mt-5 h-px w-0 rounded-full bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:w-full`}
                  aria-hidden
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials — between Features and Guide (Expert 7, 10) ─────── */}
      <div className="relative px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4" aria-hidden>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          </div>
          <TestimonialsSection reduced={!!reduced} />
        </div>
      </div>

      {/* ── How It Works + FAQ ────────────────────────────────────────────── */}
      <div className="relative px-6">
        <div className="mx-auto max-w-6xl">
          <UserGuideSection />
          <FaqSection />
        </div>
      </div>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-16 md:py-24" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-violet-950/60 via-purple-950/40 to-violet-950/50 p-10 text-center backdrop-blur-xl md:p-16"
          >
            {!reduced && (
              <>
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" aria-hidden />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/12 blur-3xl pointer-events-none" aria-hidden />
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                  }}
                  aria-hidden
                />
              </>
            )}

            <div className="relative">
              <motion.div
                animate={reduced ? undefined : { rotate: [0, 12, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="mb-5 inline-flex"
                aria-hidden
              >
                <Sparkles className="h-10 w-10 text-violet-400" />
              </motion.div>

              <h2 id="cta-heading" className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                Ready to create
                <span className="block text-violet-400">exceptional content?</span>
              </h2>

              <p className="mb-8 text-lg text-white/60 max-w-lg mx-auto">
                Join 10,000+ creators who use ContentCraft Inspector to build better content, faster.
              </p>

              <motion.button
                onClick={() => router.push('/auth/signup')}
                whileHover={reduced ? undefined : { scale: 1.04 }}
                whileTap={reduced ? undefined : { scale: 0.97 }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 px-10 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(139,92,246,0.38)] hover:shadow-[0_0_60px_rgba(139,92,246,0.55)] transition-shadow duration-300"
              >
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  aria-hidden
                />
                <span className="relative flex items-center gap-2">
                  Start Building for Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
                </span>
              </motion.button>

              <p className="mt-3 text-xs text-white/35">
                No credit card required · Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-white/70">ContentCraft Inspector</span>
            </div>

            <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                { label: 'Features', href: '/dashboard' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm text-white/40 hover:text-white/75 transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-6 h-px w-full bg-white/[0.06]" aria-hidden />

          <p className="mt-4 text-center text-xs text-white/25">
            © {new Date().getFullYear()} ContentCraft Inspector · Built with AI, powered by creativity.
          </p>
        </div>
      </footer>

      {/* ── Styles ────────────────────────────────────────────────────────── */}
      <style jsx>{`
        /* Global font smoothing on dark bg (Experts 3, 9) */
        .min-h-screen {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Hero gradient — constrained to violet-purple-indigo family (Experts 1, 9) */
        .hero-gradient-text {
          background: linear-gradient(
            135deg,
            #a78bfa 0%,
            #818cf8 22%,
            #c084fc 45%,
            #a78bfa 68%,
            #818cf8 100%
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: #a78bfa;
          -webkit-text-fill-color: transparent;
          animation: hero-gradient-shift 5s ease infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-gradient-text {
            animation: none;
            background-position: 0% 50%;
          }
        }

        @media (forced-colors: active) {
          .hero-gradient-text {
            -webkit-text-fill-color: ButtonText;
            color: ButtonText;
            background: none;
          }
        }

        @keyframes hero-gradient-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
