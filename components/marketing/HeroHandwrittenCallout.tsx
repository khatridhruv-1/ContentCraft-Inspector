'use client';

import type { CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { scrollRevealProps } from '@/lib/marketing/scrollReveal';
import { MARKETING_EASE } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

/** Memberstack hero doodle — chevrons + handwritten label in one SVG. */
const DOODLE_SRC = '/marketing/hero-cta-doodle.svg';
const DOODLE_WIDTH = 176;
const DOODLE_HEIGHT = 160;

interface HeroHandwrittenCalloutProps {
  className?: string;
  style?: CSSProperties;
  /** When true, fade-in starts once the callout scrolls into view. */
  animateOnView?: boolean;
  /** Shared hero mount flag — keeps doodle in sync with other hero entrances. */
  ready?: boolean;
}

/**
 * Place below the CTA row (in normal flow) — never absolute beside the primary
 * button, which collided with "See sample output" on desktop.
 */
export default function HeroHandwrittenCallout({
  className,
  style,
  animateOnView = false,
  ready = true,
}: HeroHandwrittenCalloutProps) {
  const reduced = useReducedMotion();

  const motionProps = animateOnView
    ? scrollRevealProps('up', { delay: 0.15, distance: 24, reduced })
    : {
        initial: reduced ? false : { opacity: 0, y: 8 },
        animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
        transition: { duration: 0.7, delay: 0.55, ease: MARKETING_EASE },
      };

  return (
    <div
      className={cn(
        'pointer-events-none mx-auto mt-2 flex justify-center max-md:hidden',
        className
      )}
      style={style}
      aria-hidden
    >
      <motion.div {...motionProps}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DOODLE_SRC}
          alt=""
          width={DOODLE_WIDTH}
          height={DOODLE_HEIGHT}
          className="block max-w-none origin-top scale-75"
          style={{ width: DOODLE_WIDTH, height: DOODLE_HEIGHT }}
          loading={animateOnView ? 'lazy' : 'eager'}
          decoding="async"
        />
      </motion.div>
    </div>
  );
}
