import { marketingGlassCard, marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

/** Matches HomeWorkspacePanel glass treatment */
export const profileGlassPanel = cn(
  marketingGlassCard,
  'relative overflow-hidden p-6 md:p-8'
);

export const profileSectionDivider = 'border-t border-slate-200/80 pt-5 sm:pt-6';

export const profileCompactButton = cn(
  'inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50',
  marketingFocusRing
);

export const profileSectionLabel =
  'text-xs font-semibold uppercase tracking-widest text-slate-500';

export const profileSectionHint = 'mt-1 text-sm text-slate-500';
