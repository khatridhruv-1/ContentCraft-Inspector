'use client';

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900 tracking-tight">
              ContentCraft Inspector
            </span>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
