'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Wand2, Edit3, FileSearch, Gauge } from 'lucide-react';

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

export default function FeaturesSection() {
  const reduced = useReducedMotion();

  return (
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
  );
}
