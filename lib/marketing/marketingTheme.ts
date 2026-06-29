/** Shared design tokens — light, minimal, production-ready */

import { cn } from '@/lib/utils';

export const MARKETING_BG = '#f8fafc';
export const MARKETING_SURFACE = '#ffffff';
export const MARKETING_FIELD_BG = '#ffffff';

export const MARKETING_PAGE_GRADIENT = MARKETING_BG;

export const MARKETING_EASE = [0.22, 1, 0.36, 1] as const;

export const marketingPageClass = 'text-slate-900 antialiased';
export const marketingBgClass = 'bg-slate-50';

export const marketingHeaderBar =
  'sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md';

export const marketingNavPill =
  'border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm shadow-slate-900/[0.03]';

export const marketingFocusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

export const marketingLink = 'text-slate-700 hover:text-slate-900 transition-colors';

export const marketingMutedLink = 'text-slate-500 hover:text-slate-800 transition-colors';

export const marketingEyebrow =
  'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600';

export const marketingLabel = 'text-sm font-medium text-slate-700';

export const marketingFieldShell =
  'flex w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-0 shadow-sm transition-colors hover:border-slate-300 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-400/20 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50';

export const marketingInput =
  'min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-[15px] text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors hover:border-slate-300 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-400/20 focus-visible:ring-offset-0';

export const marketingTextarea =
  'min-h-[120px] resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[15px] text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors hover:border-slate-300 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-400/20 focus-visible:ring-offset-0';

export const marketingAuthInput =
  'min-w-0 flex-1 border-0 bg-transparent py-0 text-[15px] text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-0';

/** Shared base for all marketing buttons */
export const marketingButtonBase =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0';

/** Uses semantic primary tokens — always present in the CSS bundle (unlike slate utilities). */
export const marketingPrimaryButtonCore = cn(
  marketingButtonBase,
  'border border-primary bg-primary text-primary-foreground shadow-sm',
  'hover:bg-primary/90',
  'active:opacity-95'
);

export const marketingPrimaryButtonSizes = {
  sm: 'h-9 px-4 text-sm font-medium',
  md: 'h-11 w-full px-5 text-sm font-medium',
  lg: 'h-12 px-8 text-base font-semibold shadow-md',
  xl: 'h-14 px-8 text-base font-bold shadow-lg',
} as const;

export const marketingGhostButton = cn(
  marketingButtonBase,
  'h-11 w-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm',
  'hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
);

export const marketingGhostNav = cn(
  marketingButtonBase,
  'h-9 border border-transparent bg-transparent px-3 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900'
);

export const marketingSecondaryButton = cn(
  marketingButtonBase,
  'h-10 border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 hover:bg-slate-100'
);

export const marketingDestructiveButton = cn(
  marketingButtonBase,
  'h-10 border border-red-200 bg-white px-4 text-sm text-red-600 shadow-sm hover:border-red-300 hover:bg-red-50'
);

/** Skip link + compact icon actions */
export const marketingSkipLink =
  'sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:h-9 focus:items-center focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:text-sm focus:font-medium focus:text-white focus:shadow-sm';

export const marketingSectionTitle =
  'text-4xl font-black tracking-tight text-slate-900 md:text-5xl';

export const marketingAccentSpan = 'text-slate-700';

export const marketingIconTile =
  'flex items-center justify-center rounded-lg bg-slate-100 text-slate-700';
export const marketingIconTileSm = 'h-10 w-10';
export const marketingIconTileMd = 'h-12 w-12';

export const marketingPageContainer = 'mx-auto w-full max-w-6xl px-6 md:px-8';

/** Welcome / marketing landing — hero bottom + section rhythm */
export const marketingLandingHero =
  'relative flex flex-col items-center overflow-visible px-6 pt-32 pb-0 text-center';

/** Sections after a divider — top spacing comes from the divider */
export const marketingLandingSection = 'relative scroll-mt-24 px-6 pb-10 md:pb-12';

export const marketingSectionHeader = 'mb-8 text-center md:mb-10';

/** Equal space above and below every section line */
export const marketingSectionDividerWrap = 'mx-auto w-full max-w-6xl px-6 py-6 md:py-8';

export const marketingSectionDividerLine =
  'h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent';

export const marketingFlatHero = 'border-b border-slate-200 pb-8 md:pb-10';

export const marketingSection = 'border-b border-slate-200 py-8 md:py-10 last:border-b-0';

export const marketingSplitPage =
  'grid grid-cols-1 gap-8 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:gap-12 xl:gap-16';

export const marketingListRow =
  'group flex w-full items-center gap-4 border-b border-slate-200 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 last:border-b-0 md:py-5';

export const marketingGlassCard =
  'relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]';

export const marketingGlassCardDanger =
  'relative overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-sm';
