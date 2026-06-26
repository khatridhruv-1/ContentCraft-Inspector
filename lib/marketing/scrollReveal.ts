import { MARKETING_EASE } from '@/lib/marketing/marketingTheme';

export type ScrollRevealDirection = 'left' | 'right' | 'up';

const DEFAULT_DISTANCE = 56;

export function alternateScrollDirection(index: number): 'left' | 'right' {
  return index % 2 === 0 ? 'left' : 'right';
}

export function scrollRevealHidden(
  direction: ScrollRevealDirection,
  distance = DEFAULT_DISTANCE
) {
  switch (direction) {
    case 'left':
      return { opacity: 0, x: -distance };
    case 'right':
      return { opacity: 0, x: distance };
    case 'up':
      return { opacity: 0, y: distance * 0.5 };
  }
}

export function scrollRevealProps(
  direction: ScrollRevealDirection,
  options?: {
    delay?: number;
    distance?: number;
    reduced?: boolean | null;
  }
) {
  if (options?.reduced) {
    return { initial: false as const };
  }

  const distance = options?.distance ?? DEFAULT_DISTANCE;

  return {
    initial: scrollRevealHidden(direction, distance),
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport: { once: false, margin: '-60px' as const, amount: 0.25 },
    transition: {
      duration: 0.7,
      delay: options?.delay ?? 0,
      ease: MARKETING_EASE,
    },
  };
}

/** Same motion as scroll reveal, but plays on initial mount (hero, above-the-fold). */
export function enterRevealProps(
  direction: ScrollRevealDirection,
  options?: {
    delay?: number;
    distance?: number;
    reduced?: boolean | null;
    /** Wait until true (post-hydration) before animating in. */
    ready?: boolean;
  }
) {
  if (options?.reduced) {
    return { initial: false as const };
  }

  const distance = options?.distance ?? DEFAULT_DISTANCE;
  const hidden = scrollRevealHidden(direction, distance);
  const shown = { opacity: 1, x: 0, y: 0 };
  const ready = options?.ready ?? true;

  return {
    initial: hidden,
    animate: ready ? shown : hidden,
    transition: {
      duration: 0.7,
      delay: options?.delay ?? 0,
      ease: MARKETING_EASE,
    },
  };
}
