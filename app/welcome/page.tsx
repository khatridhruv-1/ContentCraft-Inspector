'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wand2, Edit, FileSearch, Sparkles, ArrowRight, Star, CheckCircle2, Zap } from 'lucide-react';
import Head from 'next/head';
import FaqSection from './FaqSection';

const PARTICLES = [
  { id: 0, size: 4, left: 8, top: 20, duration: 20, delay: 0 },
  { id: 1, size: 3, left: 18, top: 65, duration: 25, delay: 1 },
  { id: 2, size: 5, left: 30, top: 40, duration: 18, delay: 2.5 },
  { id: 3, size: 2, left: 45, top: 10, duration: 22, delay: 0.5 },
  { id: 4, size: 4, left: 55, top: 80, duration: 28, delay: 3 },
  { id: 5, size: 3, left: 70, top: 25, duration: 20, delay: 1.5 },
  { id: 6, size: 5, left: 82, top: 55, duration: 24, delay: 4 },
  { id: 7, size: 2, left: 92, top: 70, duration: 19, delay: 0.8 },
  { id: 8, size: 4, left: 25, top: 85, duration: 23, delay: 2 },
  { id: 9, size: 3, left: 60, top: 90, duration: 17, delay: 1.2 },
  { id: 10, size: 4, left: 75, top: 45, duration: 21, delay: 3.5 },
  { id: 11, size: 2, left: 38, top: 60, duration: 26, delay: 0.3 },
  { id: 12, size: 5, left: 12, top: 45, duration: 16, delay: 4.5 },
  { id: 13, size: 3, left: 48, top: 30, duration: 29, delay: 2.8 },
  { id: 14, size: 4, left: 85, top: 15, duration: 22, delay: 1.7 },
  { id: 15, size: 2, left: 65, top: 75, duration: 20, delay: 0.6 },
  { id: 16, size: 5, left: 95, top: 35, duration: 18, delay: 3.2 },
  { id: 17, size: 3, left: 20, top: 92, duration: 24, delay: 1.9 },
  { id: 18, size: 4, left: 42, top: 5, duration: 27, delay: 4.2 },
  { id: 19, size: 2, left: 78, top: 88, duration: 21, delay: 2.3 },
];

const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const heroItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8 } },
};

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const illustrationVariants = {
  hidden: { x: 40, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.9, ease: 'easeOut' } },
};

const features = [
  {
    icon: Wand2,
    title: 'AI-Powered',
    description: 'Generate high-quality content with advanced AI technology',
    bg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: Edit,
    title: 'Smart Editor',
    description: 'Create and edit content with powerful tools',
    bg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: FileSearch,
    title: 'Deep Analysis',
    description: 'Get detailed insights and content optimization tips',
    bg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
];

const MOCK_LINES = [
  { w: 'w-full', color: 'bg-gray-800', h: 'h-3' },
  { w: 'w-5/6', color: 'bg-gray-700', h: 'h-3' },
  { w: 'w-4/6', color: 'bg-blue-400', h: 'h-3' },
  { w: 'w-full', color: 'bg-gray-700', h: 'h-3' },
  { w: 'w-3/4', color: 'bg-gray-600', h: 'h-3' },
];

function HeroIllustration() {
  return (
    <motion.div
      variants={illustrationVariants}
      className="relative w-full max-w-md mx-auto md:ml-auto"
    >
      {/* Outer glow */}
      <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-2xl" />

      {/* Editor window */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="ml-3 flex-1 bg-gray-200 rounded-full h-4 w-32" />
          <div className="ml-auto flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-600">AI</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Document title */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-900 rounded-full w-3/4" />
            <div className="h-3 bg-gray-300 rounded-full w-1/2" />
          </div>

          {/* Content lines with animated highlight */}
          <div className="space-y-2.5">
            {MOCK_LINES.map((line, i) => (
              <motion.div
                key={i}
                className={`${line.h} ${line.w} ${line.color} rounded-full opacity-70`}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
              />
            ))}
          </div>

          {/* SEO score card */}
          <motion.div
            className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">SEO Score</span>
              <span className="text-xs font-bold text-green-600">92 / 100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                transition={{ duration: 1, delay: 1.4, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            {[
              { label: 'Words', value: '847' },
              { label: 'Read time', value: '4 min' },
              { label: 'Keywords', value: '12' },
            ].map(({ label, value }) => (
              <div key={label} className="flex-1 text-center bg-gray-50 rounded-lg py-2 px-1">
                <div className="text-sm font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Floating badge: AI Generating */}
      <motion.div
        className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Zap className="w-3 h-3" />
        AI Writing
      </motion.div>

      {/* Floating badge: Score */}
      <motion.div
        className="absolute -bottom-3 -left-4 bg-white border border-gray-200 shadow-lg text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
        <span className="text-gray-700">WCAG AA Compliant</span>
      </motion.div>
    </motion.div>
  );
}

export default function Welcome() {
  const router = useRouter();

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>ContentCraft-Inspector — Craft &amp; Inspect Content with AI</title>
        <meta
          name="description"
          content="Craft, analyze, and optimize content smarter with AI. ContentCraft-Inspector gives content teams AI generation, smart editing, and deep SEO insights in one place. Try it free."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />
          <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-3000" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-5000" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-blue-400/20 animate-float-particle"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-6xl w-full py-16">

          {/* ── Hero: two-column on desktop ── */}
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center mb-24"
          >
            {/* Left column: copy + CTAs */}
            <div className="flex flex-col items-start text-left">
              {/* Badge */}
              <motion.div variants={heroItemVariants} className="mb-5">
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-blue-300" />
                  AI-Powered Content Platform
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={heroItemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5"
              >
                Craft &amp; Inspect Content{' '}
                <span className="animate-gradient-x bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-[length:200%_auto] text-transparent bg-clip-text">
                  Smarter with AI
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={heroItemVariants}
                className="text-lg text-blue-100/80 max-w-lg mb-8 leading-relaxed"
              >
                Generate publication-ready drafts, optimize for SEO, and get actionable insights — all in one place. Save hours every week and publish content that actually ranks.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={heroItemVariants}
                className="flex flex-wrap gap-4 mb-6"
              >
                <motion.button
                  onClick={() => router.push('/auth/signup')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-7 py-3.5 rounded-xl text-base font-semibold shadow-lg hover:shadow-blue-500/30 hover:shadow-xl transition-shadow group"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
                  <span className="relative flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 inline-block transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </motion.button>

                <motion.button
                  onClick={scrollToFeatures}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/10 border border-white/25 text-white px-7 py-3.5 rounded-xl text-base font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  See How It Works
                </motion.button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                variants={heroItemVariants}
                className="flex items-center gap-3 text-sm text-blue-200/70"
              >
                <div className="flex -space-x-1">
                  {[
                    'bg-blue-400',
                    'bg-purple-400',
                    'bg-pink-400',
                    'bg-indigo-400',
                  ].map((color, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-full ${color} border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span>Trusted by <strong className="text-white">1,000+</strong> content teams</span>
              </motion.div>
            </div>

            {/* Right column: animated illustration */}
            <motion.div
              variants={heroItemVariants}
              className="flex justify-center md:justify-end"
            >
              <HeroIllustration />
            </motion.div>
          </motion.div>

          {/* ── Feature Cards ── */}
          <motion.div
            id="features"
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
          >
            {features.map(({ icon: Icon, title, description, bg, iconColor }) => (
              <motion.div
                key={title}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/15 hover:border-white/30 transition-all duration-200 cursor-default"
              >
                <motion.div
                  className={`${bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                  whileHover={{ rotate: 12, scale: 1.15, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                >
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
                <p className="text-blue-100/70">{description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── FAQ Section ── */}
          <FaqSection />

          {/* ── Bottom sign-in nudge ── */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-blue-200/60 text-sm mt-4"
          >
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-blue-300 hover:text-white font-semibold underline underline-offset-2 transition-colors"
            >
              Sign in
            </button>
          </motion.p>
        </div>

        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-3000 { animation-delay: 3s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animation-delay-5000 { animation-delay: 5s; }

          @keyframes float-particle {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.4; }
            33% { transform: translateY(-15px) translateX(8px); opacity: 0.8; }
            66% { transform: translateY(-8px) translateX(-6px); opacity: 0.6; }
          }
          .animate-float-particle { animation: float-particle ease-in-out infinite; }

          @media (prefers-reduced-motion: reduce) {
            .animate-blob,
            .animate-float-particle {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
