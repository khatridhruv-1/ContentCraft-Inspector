'use client';

import { Children, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MARKETING_EASE } from '@/lib/marketing/marketingTheme';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: MARKETING_EASE } },
};

export default function AuthFormStagger({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className="space-y-4">{children}</div>;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {Children.map(children, (child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
