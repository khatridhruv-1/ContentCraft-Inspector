'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function NavBar() {
  const router = useRouter();
  const reduced = useReducedMotion();

  return (
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
  );
}
