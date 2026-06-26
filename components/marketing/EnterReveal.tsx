'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { useMountReveal } from '@/hooks/useMountReveal';
import {
  enterRevealProps,
  type ScrollRevealDirection,
} from '@/lib/marketing/scrollReveal';

type MotionTag = 'div' | 'span' | 'p';

interface EnterRevealProps
  extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'transition'> {
  direction?: ScrollRevealDirection;
  delay?: number;
  distance?: number;
  as?: MotionTag;
  /** Pass a shared ready flag when multiple elements should start together. */
  ready?: boolean;
}

export default function EnterReveal({
  direction = 'up',
  delay = 0,
  distance,
  children,
  as = 'div',
  ready: readyProp,
  ...rest
}: EnterRevealProps) {
  const reduced = useReducedMotion();
  const mountReady = useMountReveal();
  const ready = readyProp ?? mountReady;
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      {...enterRevealProps(direction, { delay, distance, reduced, ready })}
      {...rest}
    >
      {children}
    </Component>
  );
}
