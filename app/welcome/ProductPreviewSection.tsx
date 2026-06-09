'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Wand2, FileSearch } from 'lucide-react';

export default function ProductPreviewSection() {
  const reduced = useReducedMotion();

  return (
    <section className="relative px-6 py-14 md:py-20" aria-labelledby="preview-heading">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/60">
            Product preview
          </span>
          <h2 id="preview-heading" className="text-3xl font-black tracking-tight text-white md:text-4xl">
            One workspace for{' '}
            <span className="text-violet-400">generation and analysis</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/70">
            Generate drafts, then run SEO, readability, and content-gap analysis — without switching tools.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduced ? undefined : { y: -4 }}
          className="overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.04] p-2 shadow-2xl shadow-violet-500/10 backdrop-blur-sm md:p-3"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.08] px-3 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" aria-hidden />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" aria-hidden />
            <span className="ml-2 text-xs text-white/45">ContentCraft Inspector — Dashboard</span>
          </div>

          <div className="grid gap-2 p-2 md:grid-cols-2 md:gap-3 md:p-3">
            <div className="rounded-xl border border-white/[0.08] bg-[#0f0f12] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white/70">
                <Wand2 className="h-3.5 w-3.5 text-violet-400" aria-hidden />
                AI Generation
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full rounded bg-white/[0.08]" />
                <div className="h-2 w-[92%] rounded bg-white/[0.08]" />
                <div className="h-2 w-[78%] rounded bg-white/[0.06]" />
                <div className="mt-4 h-16 rounded-lg border border-violet-500/20 bg-violet-500/[0.08] p-3 text-[11px] text-violet-200/80">
                  Generated draft: blog intro with SEO-friendly structure and tone controls.
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#0f0f12] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white/70">
                <FileSearch className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
                Deep Analysis
              </div>
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-black text-emerald-400">82</span>
                  <span className="text-[10px] text-white/45">Readability score</span>
                </div>
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.08] p-3 text-[11px] text-cyan-200/80">
                  Outline, info gain, and SEO insights in one pass.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
