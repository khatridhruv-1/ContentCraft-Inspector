'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wand2, Edit, FileSearch, Sparkles, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import FaqSection from './FaqSection';

const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  {
    icon: Wand2,
    title: 'AI-Powered',
    description: 'Generate high-quality content with advanced AI in seconds.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.35)',
  },
  {
    icon: Edit,
    title: 'Smart Editor',
    description: 'Rich text editing with real-time structure and formatting tools.',
    gradient: 'from-indigo-500 to-blue-600',
    glow: 'rgba(99,102,241,0.35)',
  },
  {
    icon: FileSearch,
    title: 'Deep Analysis',
    description: 'Detailed readability, tone, and quality scoring for every piece.',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.35)',
  },
  {
    icon: BarChart3,
    title: 'Realness Score',
    description: 'Detect AI vs human writing patterns with precision scoring.',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.35)',
  },
  {
    icon: Zap,
    title: 'Info Gain',
    description: 'Live web research to measure your content\'s informational value.',
    gradient: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.35)',
  },
  {
    icon: Shield,
    title: 'Plagiarism Check',
    description: 'Scan for originality and get an improved rewrite instantly.',
    gradient: 'from-cyan-500 to-sky-600',
    glow: 'rgba(6,182,212,0.35)',
  },
];

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white overflow-x-hidden">

      {/* ── Noise texture overlay ── */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      {/* ── Glow orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight">ContentCraft</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/[0.06]"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push('/auth/signup')}
            className="text-sm font-medium bg-violet-600 hover:bg-violet-500 transition-colors px-4 py-2 rounded-lg"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pt-28 pb-24 text-center">
        <motion.div variants={stagger} initial="hidden" animate="visible">

          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered content intelligence
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Create. Analyze.{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Elevate.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
            Your all-in-one platform for AI content generation, deep analysis, plagiarism detection, and realness scoring.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4">
            <motion.button
              onClick={() => router.push('/auth/signup')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-semibold px-7 py-3.5 rounded-xl text-sm shadow-lg shadow-violet-900/40"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
            <motion.button
              onClick={() => router.push('/auth/login')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium px-7 py-3.5 rounded-xl text-sm border border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
            >
              Sign in
            </motion.button>
          </motion.div>

        </motion.div>
      </section>

      {/* ── Features grid ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map(({ icon: Icon, title, description, gradient, glow }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 cursor-default overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${glow} 0%, transparent 70%)` }} />
              <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="relative text-sm font-semibold text-white mb-1.5">{title}</h3>
              <p className="relative text-xs text-white/45 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-8 pb-24">
        <h2 className="text-2xl font-bold text-center mb-8 text-white/90">Frequently asked questions</h2>
        <FaqSection />
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-8 pb-28 text-center">
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-12">
          <h2 className="text-3xl font-bold mb-3">Ready to craft better content?</h2>
          <p className="text-white/50 mb-8 text-sm">Join teams already using ContentCraft to write, analyze, and improve.</p>
          <motion.button
            onClick={() => router.push('/auth/signup')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 transition-colors text-white font-semibold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-violet-900/40"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        </div>
      </section>

    </div>
  );
}
