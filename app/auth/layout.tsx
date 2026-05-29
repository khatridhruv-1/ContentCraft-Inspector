'use client';

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wand2, FileSearch, BarChart3 } from 'lucide-react';
import Link from 'next/link';

const bullets = [
  { icon: Wand2,      text: 'Generate content with GPT-powered AI' },
  { icon: FileSearch, text: 'Deep analysis: readability, tone & score' },
  { icon: BarChart3,  text: 'Detect AI writing & humanize instantly' },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left panel ── */}
      <aside className="hidden lg:flex w-[460px] shrink-0 flex-col justify-between p-12 relative overflow-hidden bg-background">

        {/* Soft orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-40"
            style={{ background: 'radial-gradient(circle, rgba(67,56,202,0.2) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
        </div>

        {/* Logo */}
        <Link href="/welcome" className="relative flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 rounded-lg grad flex items-center justify-center" aria-hidden="true">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-foreground tracking-tight">ContentCraft Inspector</span>
        </Link>

        {/* Hero copy */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-foreground leading-snug mb-4"
          >
            Create smarter content with AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-muted-foreground leading-relaxed mb-8"
          >
            Generate, analyze, score, and humanize — everything your content workflow needs in one place.
          </motion.p>

          <ul className="space-y-4" aria-label="Platform features">
            {bullets.map(({ icon: Icon, text }, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm" aria-hidden="true">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground/60">© {new Date().getFullYear()} ContentCraft Inspector</p>
      </aside>

      {/* ── Right panel – form ── */}
      <main className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg grad flex items-center justify-center" aria-hidden="true">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-foreground tracking-tight">ContentCraft Inspector</span>
          </div>

          <div className="bg-white border border-border rounded-2xl p-7 sm:p-8 shadow-[0_4px_24px_rgba(67,56,202,0.10)]">
            {children}
          </div>
        </motion.div>
      </main>

    </div>
  );
}
