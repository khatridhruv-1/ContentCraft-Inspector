/** Shared design tokens for welcome, auth, home, help, and legal pages */

export const MARKETING_BG = '#09090b';
export const MARKETING_FIELD_BG = '#141418';

export const MARKETING_PAGE_GRADIENT =
  'radial-gradient(ellipse 110% 55% at 50% -5%, rgba(139,92,246,0.13) 0%, transparent 55%), #09090b';

export const MARKETING_EASE = [0.22, 1, 0.36, 1] as const;

export const marketingPageClass = 'text-white antialiased';
export const marketingBgClass = 'bg-[#09090b]';

export const marketingHeaderBar =
  'sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/90 backdrop-blur-md';

export const marketingNavPill = 'border border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl';

export const marketingFocusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]';

export const marketingBrandIcon =
  'bg-gradient-to-br from-violet-500 to-purple-600';

export const marketingBrandIconSm = 'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg';
export const marketingBrandIconMd = 'flex h-8 w-8 items-center justify-center rounded-xl shadow-lg shadow-violet-500/30';

export const marketingGhostNav =
  'text-sm text-white/70 transition-colors hover:text-white rounded-xl hover:bg-white/[0.05]';

export const marketingLink =
  'text-violet-400 hover:text-violet-300 transition-colors';

export const marketingMutedLink =
  'text-white/55 hover:text-white/85 transition-colors';

export const marketingEyebrow =
  'inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/[0.05] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/60';

export const marketingLabel = 'text-sm font-medium text-white/80';

export const marketingFieldShell =
  'flex w-full items-center gap-1.5 rounded-xl border border-white/[0.12] bg-[#141418] py-0 shadow-inner shadow-black/25 transition-colors hover:border-white/[0.2] hover:bg-[#18181c] focus-within:border-violet-500/50 focus-within:ring-2 focus-within:ring-violet-400/25 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50';

export const marketingInput =
  'min-h-11 rounded-xl border border-white/[0.12] bg-[#141418] px-3 text-[15px] text-white shadow-inner shadow-black/25 placeholder:text-white/35 transition-colors hover:border-white/[0.2] hover:bg-[#18181c] focus-visible:border-violet-500/50 focus-visible:ring-2 focus-visible:ring-violet-400/25 focus-visible:ring-offset-0';

export const marketingTextarea =
  'min-h-[120px] resize-y rounded-xl border border-white/[0.12] bg-[#141418] px-3 py-2.5 text-[15px] text-white shadow-inner shadow-black/25 placeholder:text-white/35 transition-colors hover:border-white/[0.2] hover:bg-[#18181c] focus-visible:border-violet-500/50 focus-visible:ring-2 focus-visible:ring-violet-400/25 focus-visible:ring-offset-0';

export const marketingAuthInput =
  'min-w-0 flex-1 border-0 bg-transparent py-0 text-[15px] text-white outline-none ring-0 placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-0';

export const marketingPrimaryButtonBase =
  'group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 text-white transition-shadow duration-300 disabled:cursor-not-allowed disabled:opacity-60';

export const marketingPrimaryButtonSizes = {
  sm: 'px-5 py-2.5 text-sm font-semibold shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30',
  md: 'w-full px-4 py-3 text-base font-bold shadow-[0_0_32px_rgba(139,92,246,0.32)] hover:shadow-[0_0_48px_rgba(139,92,246,0.48)]',
  lg: 'px-9 py-4 text-base font-bold shadow-[0_0_40px_rgba(139,92,246,0.35)] hover:shadow-[0_0_60px_rgba(139,92,246,0.52)]',
  xl: 'px-10 py-4 text-base font-bold shadow-[0_0_40px_rgba(139,92,246,0.38)] hover:shadow-[0_0_60px_rgba(139,92,246,0.55)]',
} as const;

export const marketingShimmer =
  'absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12';

export const marketingSectionTitle =
  'text-4xl font-black tracking-tight text-white md:text-5xl';

export const marketingAccentSpan = 'text-violet-400';

/** Full-width page column (aligned with /home) — not a narrow centered card stack */
export const marketingPageContainer = 'mx-auto w-full max-w-6xl px-6 md:px-8';

/** Page hero / intro band — divider only, no card chrome */
export const marketingFlatHero = 'border-b border-white/[0.06] pb-8 md:pb-10';

/** Section separated by horizontal rules */
export const marketingSection =
  'border-b border-white/[0.06] py-8 md:py-10 last:border-b-0';

/** Settings: sticky sidebar + main column */
export const marketingSplitPage =
  'grid grid-cols-1 gap-8 lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:gap-12 xl:gap-16';

/** Full-width interactive row (workflows, recents, settings) */
export const marketingListRow =
  'group flex w-full items-center gap-4 border-b border-white/[0.06] py-4 text-left transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.03] last:border-b-0 md:py-5';

/** @deprecated Prefer marketingSection / marketingListRow for app pages */
export const marketingGlassCard =
  'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-sm shadow-black/25 backdrop-blur-sm ring-1 ring-inset ring-white/[0.06]';

export const marketingGlassCardDanger =
  'relative overflow-hidden rounded-2xl border border-red-500/20 bg-red-950/20 shadow-sm shadow-black/25 backdrop-blur-sm';

export const marketingGhostButton =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50';

export const marketingDestructiveButton =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50';

/** @deprecated Use marketingPageContainer — flat full-width layout */
export const marketingSettingsContainer = marketingPageContainer;
