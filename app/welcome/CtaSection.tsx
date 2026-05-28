'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CtaSection() {
  const router = useRouter();
  const reduced = useReducedMotion();

  return (
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
  );
}
