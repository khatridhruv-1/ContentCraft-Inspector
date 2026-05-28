'use client';

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2, FileSearch, BarChart3 } from 'lucide-react';

const bullets = [
  { icon: Wand2,      text: 'Generate content with GPT-powered AI' },
  { icon: FileSearch, text: 'Deep analysis: readability, tone & score' },
  { icon: BarChart3,  text: 'Detect AI writing & humanize instantly' },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#0a0a12]">

          {/* ── Left panel – branding ── */}
          <div className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between p-12 relative overflow-hidden border-r border-white/[0.06]">

            {/* Glow orbs */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }} />
              <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }} />
            </div>

            {/* Logo */}
            <div className="relative flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-white tracking-tight">ContentCraft Inspector</span>
            </div>

            {/* Hero copy */}
            <div className="relative">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl font-bold text-white leading-snug mb-4"
              >
                Create smarter content with AI
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm text-white/45 leading-relaxed mb-8"
              >
                Generate, analyze, score, and humanize — everything your content workflow needs in one place.
              </motion.p>

              <ul className="space-y-4">
                {bullets.map(({ icon: Icon, text }, i) => (
                  <motion.li
                    key={text}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <span className="text-sm text-white/60">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <p className="relative text-xs text-white/25">© 2025 ContentCraft Inspector</p>
          </div>

          {/* ── Right panel – form ── */}
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="w-full max-w-sm"
            >
              {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-2.5 justify-center mb-8">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm text-white tracking-tight">ContentCraft Inspector</span>
              </div>

              <div className="bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/[0.09] p-8 shadow-2xl">
                {children}
              </div>
            </motion.div>
          </div>

        </div>
  );
}
