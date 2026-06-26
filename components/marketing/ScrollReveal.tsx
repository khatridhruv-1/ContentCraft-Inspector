'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import {
  alternateScrollDirection,
  scrollRevealProps,
  type ScrollRevealDirection,
} from '@/lib/marketing/scrollReveal';

interface ScrollRevealProps
  extends Omit<
    HTMLMotionProps<'div'>,
    'initial' | 'whileInView' | 'viewport' | 'transition'
  > {
  direction?: ScrollRevealDirection;
  delay?: number;
  distance?: number;
}

export default function ScrollReveal({
  direction = 'up',
  delay = 0,
  distance,
  children,
  ...rest
}: ScrollRevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div {...scrollRevealProps(direction, { delay, distance, reduced })} {...rest}>
      {children}
    </motion.div>
  );
}

export { alternateScrollDirection };
