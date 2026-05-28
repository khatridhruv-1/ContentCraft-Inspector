'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import NavBar from './NavBar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import FaqSection from './FaqSection';
import UserGuideSection from './UserGuideSection';
import CtaSection from './CtaSection';

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
      <FeaturesSection />

      {/* ── How It Works + FAQ ────────────────────────────────────────────── */}
      <div className="relative px-6">
        <div className="mx-auto max-w-6xl">
          <UserGuideSection />
          <FaqSection />
        </div>
      </div>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <CtaSection />

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
