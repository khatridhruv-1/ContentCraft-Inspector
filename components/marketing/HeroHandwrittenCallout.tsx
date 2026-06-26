'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { enterRevealProps, scrollRevealProps } from '@/lib/marketing/scrollReveal';
import { cn } from '@/lib/utils';

/** Memberstack hero doodle — chevrons + handwritten label in one SVG. */
const DOODLE_SRC = '/marketing/hero-cta-doodle.svg';
const DOODLE_WIDTH = 193;
const DOODLE_HEIGHT = 139;
const DOODLE_MARGIN_TOP_PX = 40;

interface HeroHandwrittenCalloutProps {
  className?: string;
  /** When true, fade-in starts once the callout scrolls into view. */
  animateOnView?: boolean;
  /** Shared hero mount flag — keeps doodle in sync with other hero entrances. */
  ready?: boolean;
}

export default function HeroHandwrittenCallout({
  className,
  animateOnView = false,
  ready = true,
}: HeroHandwrittenCalloutProps) {
  const reduced = useReducedMotion();

  const motionProps = animateOnView
    ? scrollRevealProps('right', { delay: 0.15, distance: 32, reduced })
    : enterRevealProps('right', { delay: 0.55, distance: 32, reduced, ready });

  return (
    <div
      className={cn('pointer-events-none hidden shrink-0 md:block', className)}
      style={{ marginTop: DOODLE_MARGIN_TOP_PX }}
      aria-hidden
    >
      <motion.div {...motionProps}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DOODLE_SRC}
          alt=""
          width={DOODLE_WIDTH}
          height={DOODLE_HEIGHT}
          className="block h-[139px] w-[193px] max-w-none"
          loading={animateOnView ? 'lazy' : 'eager'}
          decoding="async"
        />
      </motion.div>
    </div>
  );
}
