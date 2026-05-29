'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wand2, Edit, FileSearch, Sparkles, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';

const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  { icon: Wand2,      title: 'AI-Powered Generation', description: 'Generate high-quality, 1000+ word articles with advanced AI in seconds.',           gradient: 'from-indigo-500 to-blue-600',   glow: 'rgba(67,56,202,0.1)'  },
  { icon: Edit,       title: 'Smart Editor',           description: 'Rich text editing with real-time structure, formatting, and auto-save.',              gradient: 'from-blue-500 to-indigo-600',   glow: 'rgba(99,102,241,0.1)' },
  { icon: FileSearch, title: 'Deep Analysis',          description: 'Detailed readability, tone, key insights, and quality scoring for every piece.',       gradient: 'from-indigo-600 to-violet-600', glow: 'rgba(79,70,229,0.1)'  },
  { icon: BarChart3,  title: 'Realness Score',         description: 'Detect AI vs human writing patterns with precision scoring and humanized rewrites.',   gradient: 'from-blue-600 to-indigo-700',   glow: 'rgba(37,99,235,0.1)'  },
  { icon: Zap,        title: 'Info Gain',              description: "Live web research to measure and expand your content's informational value.",           gradient: 'from-indigo-500 to-blue-500',   glow: 'rgba(67,56,202,0.1)'  },
  { icon: Shield,     title: 'Plagiarism Check',       description: 'Scan for originality against web sources and get an improved rewrite instantly.',      gradient: 'from-violet-500 to-indigo-600', glow: 'rgba(99,102,241,0.1)' },
];

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Soft gradient orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(67,56,202,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
      </div>

      {/* ── Nav ── */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg grad flex items-center justify-center" aria-hidden="true">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">ContentCraft Inspector</span>
        </div>
        <nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.push('/auth/login')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 sm:px-4 py-2 rounded-lg hover:bg-secondary min-h-[40px]"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push('/auth/signup')}
            className="text-sm font-medium grad hover:opacity-90 transition-opacity text-white px-4 py-2 rounded-lg shadow-sm min-h-[40px]"
          >
            Get started
          </button>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 pt-20 sm:pt-28 pb-20 sm:pb-24 text-center" aria-labelledby="hero-heading">
        <motion.div variants={stagger} initial="hidden" animate="visible">

          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            AI-powered content intelligence
          </motion.div>

          <motion.h1 id="hero-heading" variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6 text-foreground">
            Create. Analyze.{' '}
            <span className="grad-text">Elevate.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Your all-in-one platform for AI content generation, deep analysis, plagiarism detection, and realness scoring.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <motion.button
              onClick={() => router.push('/auth/signup')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group btn-shimmer relative flex items-center gap-2 grad hover:opacity-90 transition-opacity text-white font-semibold px-7 py-3.5 rounded-xl text-sm shadow-md shadow-indigo-200 w-full sm:w-auto min-h-[48px] justify-center"
              aria-label="Get started for free — create your account"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </motion.button>
            <motion.button
              onClick={() => router.push('/auth/login')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium px-7 py-3.5 rounded-xl text-sm border border-border hover:bg-secondary w-full sm:w-auto min-h-[48px] justify-center"
            >
              Sign in
            </motion.button>
          </motion.div>

        </motion.div>
      </section>

      {/* ── Features grid ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 pb-20 sm:pb-24" aria-labelledby="features-heading">
        <motion.h2
          id="features-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-2xl font-bold text-foreground mb-10"
        >
          Everything your content workflow needs
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="list"
        >
          {features.map(({ icon: Icon, title, description, gradient, glow }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group relative rounded-2xl border border-border bg-card p-6 cursor-default overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              role="listitem"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${glow} 0%, transparent 70%)` }} aria-hidden="true" />
              <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-md`} aria-hidden="true">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="relative text-sm font-semibold text-foreground mb-1.5">{title}</h3>
              <p className="relative text-xs text-muted-foreground leading-relaxed">{description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

{/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} ContentCraft Inspector. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
