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
/** Matches `marketingPrimaryButtonSizes.xl` (`h-14`). */
const CTA_BUTTON_HEIGHT_PX = 56;
const DOODLE_TOP_PX = 8;
const DOODLE_GAP_PX = 4;

/** In-flow height so the section divider stays below the absolutely positioned doodle. */
export const heroCtaDoodleSpacerHeightPx =
  DOODLE_TOP_PX + DOODLE_HEIGHT - CTA_BUTTON_HEIGHT_PX;

interface HeroHandwrittenCalloutProps {
  className?: string;
  style?: CSSProperties;
  /** When true, fade-in starts once the callout scrolls into view. */
  animateOnView?: boolean;
  /** Shared hero mount flag — keeps doodle in sync with other hero entrances. */
  ready?: boolean;
}

export default function HeroHandwrittenCallout({
  className,
  style,
  animateOnView = false,
  ready = true,
}: HeroHandwrittenCalloutProps) {
  const reduced = useReducedMotion();

  const motionProps = animateOnView
    ? scrollRevealProps('right', { delay: 0.15, distance: 32, reduced })
    : {
        initial: reduced ? false : { opacity: 0 },
        animate: ready ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 0.7, delay: 0.55, ease: MARKETING_EASE },
      };

  return (
    <div
      className={cn('pointer-events-none z-10 max-md:hidden', className)}
      style={{
        position: 'absolute',
        left: `calc(100% + ${DOODLE_GAP_PX}px)`,
        top: `${DOODLE_TOP_PX}px`,
        width: DOODLE_WIDTH,
        height: DOODLE_HEIGHT,
        ...style,
      }}
      aria-hidden
    >
      <motion.div {...motionProps}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DOODLE_SRC}
          alt=""
          width={DOODLE_WIDTH}
          height={DOODLE_HEIGHT}
          className="block max-w-none"
          style={{ width: DOODLE_WIDTH, height: DOODLE_HEIGHT }}
          loading={animateOnView ? 'lazy' : 'eager'}
          decoding="async"
        />
      </motion.div>
    </div>
  );
}
