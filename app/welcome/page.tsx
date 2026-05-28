'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Wand2,
  Edit3,
  FileSearch,
  Gauge,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
} from 'lucide-react';
import NavBar from './NavBar';
import HeroSection from './HeroSection';
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

// ─── Trust strip ─────────────────────────────────────────────────────────────

const trustItems = [
  { icon: Shield,      label: 'Encrypted & private',   detail: 'All data protected in transit and at rest' },
  { icon: TrendingUp,  label: 'You own your content',  detail: 'We never claim rights to your work' },
  { icon: Zap,         label: 'Free plan available',   detail: 'No credit card required to start' },
];

function TrustStrip() {
  return (
    <section className="relative px-6 py-5" aria-label="Platform trust signals">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-4 backdrop-blur-sm"
        >
          {trustItems.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 shrink-0 text-violet-400" aria-hidden />
              <span className="text-sm font-medium text-white/75">{label}</span>
              <span className="hidden text-xs text-white/40 sm:inline">— {detail}</span>
            </div>
          ))}
        </motion.div>
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
      <NavBar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <TrustStrip />

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
      `}</style>
    </div>
  );
}
