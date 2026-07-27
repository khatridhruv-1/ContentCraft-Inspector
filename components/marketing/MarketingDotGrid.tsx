'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function MarketingDotGrid() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(13,148,136,0.1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
        animate={reduced ? undefined : { opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(45,212,191,0.14), transparent 55%)',
        }}
      />
      {!reduced && (
        <>
          <motion.div
            className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-teal-300/25 blur-3xl"
            animate={{ x: [0, 48, 0], y: [0, 32, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-16 top-[38%] h-96 w-96 rounded-full bg-sky-300/20 blur-3xl"
            animate={{ x: [0, -40, 0], y: [0, -28, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          />
          <motion.div
            className="absolute bottom-16 left-1/4 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl"
            animate={{ x: [0, 28, 0], y: [0, -24, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 h-48 w-48 rounded-full bg-sky-100/30 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </>
      )}
    </div>
  );
}
