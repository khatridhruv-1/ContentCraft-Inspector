/** Shared design tokens — ink + teal production identity */

import { cn } from '@/lib/utils';

export const MARKETING_BG = '#f4f9f8';
export const MARKETING_SURFACE = '#ffffff';
export const MARKETING_FIELD_BG = '#ffffff';

/** Soft teal/sky mist — no violet wash */
export const MARKETING_PAGE_GRADIENT =
  'linear-gradient(180deg, #f0fafa 0%, #f4f9f8 28%, #eef6fb 62%, #f8fafc 100%)';

export const MARKETING_EASE = [0.22, 1, 0.36, 1] as const;

export const marketingPageClass = 'text-slate-900 antialiased';
export const marketingBgClass = 'bg-slate-50';

export const marketingHeaderBar =
  'sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md';

export const marketingNavPill =
  'border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm shadow-slate-900/[0.03]';

export const marketingFocusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white';

export const marketingLink = 'text-teal-800 hover:text-slate-900 transition-colors';

export const marketingMutedLink = 'text-slate-500 hover:text-slate-800 transition-colors';

export const marketingHeroEyebrow =
  'inline-flex items-center rounded-full border border-teal-200/80 bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-800 shadow-sm sm:px-4 sm:text-xs';

export const marketingEyebrow =
  'inline-flex items-center gap-2 rounded-full border border-teal-200/80 bg-teal-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-900';

export const marketingLabel = 'text-sm font-medium text-slate-700';

export const marketingFieldShell =
  'flex w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-0 shadow-sm transition-colors hover:border-slate-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50';

export const marketingInput =
  'min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-[15px] text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors hover:border-slate-300 focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20 focus-visible:ring-offset-0';

export const marketingTextarea =
  'min-h-[120px] resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[15px] text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors hover:border-slate-300 focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600/20 focus-visible:ring-offset-0';

export const marketingAuthInput =
  'min-w-0 flex-1 border-0 bg-transparent py-0 text-[15px] text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-0';

/** Shared base for all marketing buttons */
export const marketingButtonBase =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0';

/** Deep ink primary — hardcoded so dark-mode theme tokens cannot flip CTAs white */
export const marketingPrimaryButtonCore = cn(
  marketingButtonBase,
  'border border-slate-900 bg-slate-900 text-white shadow-sm',
  'hover:bg-slate-800 hover:border-slate-800',
  'active:bg-slate-950 active:border-slate-950'
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
  'text-3xl font-black tracking-tight text-slate-900 md:text-4xl lg:text-5xl';

export const marketingAccentSpan = 'text-teal-800';

/** Accent line for hero / section titles — solid color so text never goes invisible */
export const marketingGradientText = 'text-teal-800';

export const marketingIconTile =
  'flex items-center justify-center rounded-lg bg-teal-50 text-teal-800';
export const marketingIconTileSm = 'h-10 w-10';
export const marketingIconTileMd = 'h-12 w-12';

/** Shared horizontal gutters — use on nav, sections (via containers), and footers */
export const marketingPageGutter = 'px-6 sm:px-8 lg:px-12';

export const marketingPageContainer = 'mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12';

export const marketingPageContainerMedium =
  'mx-auto w-full max-w-4xl px-6 sm:px-8 lg:px-12';

export const marketingPageContainerNarrow =
  'mx-auto w-full max-w-3xl px-6 sm:px-8 lg:px-12';

export const marketingPageContainerTight =
  'mx-auto w-full max-w-2xl px-6 sm:px-8 lg:px-12';

/** Marketing subpages — consistent vertical + horizontal rhythm */
export const marketingSubpageMain =
  'mx-auto w-full max-w-3xl px-6 py-12 sm:px-8 md:py-16 lg:px-12';

export const marketingSubpageMainWide =
  'mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 md:py-16 lg:px-12';

/**
 * Landing hero — nav clearance only; inner content owns vertical rhythm.
 */
export const marketingLandingHero = cn(
  'relative z-0 flex flex-col',
  'pt-[4.75rem] md:pt-[5.25rem]'
);

/** Landing sections — consistent vertical band */
export const marketingLandingSection = 'relative scroll-mt-24 py-16 md:py-20 lg:py-24';

export const marketingSectionHeader = 'mb-10 text-center md:mb-12';

/** Divider line — no extra vertical padding (sections own the rhythm) */
export const marketingSectionDividerWrap = cn(marketingPageContainer, 'py-0');

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
