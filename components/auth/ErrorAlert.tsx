'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export function ErrorAlert({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
