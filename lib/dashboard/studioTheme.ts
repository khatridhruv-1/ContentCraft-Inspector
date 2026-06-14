import {
  marketingFocusRing,
  marketingGhostButton,
  marketingGlassCard,
  marketingLabel,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export const studioComposer = cn(
  marketingGlassCard,
  'relative overflow-hidden backdrop-blur-sm'
);

export const studioSectionLabel =
  'text-[10px] font-bold uppercase tracking-widest text-slate-500';

export const studioCanvas = cn(marketingGlassCard, 'bg-white');

export const studioChip =
  'inline-flex shrink-0 items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50/50 hover:text-slate-800';

export const studioChipActive =
  'border-violet-300 bg-violet-50 text-violet-900 ring-1 ring-violet-200';

export const studioFormatChip =
  'inline-flex shrink-0 items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-violet-200 hover:bg-violet-50/60 hover:text-violet-900';

export const studioField =
  'min-w-0 flex-1 resize-none border-0 bg-transparent text-[15px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0';

export const studioInputRow = cn(
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm',
  'placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20'
);

export const studioActionGhost = cn(marketingGhostButton, '!h-9 !w-auto shrink-0 px-3');

export function studioModePill(active: boolean) {
  return cn(
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all',
    active
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
    marketingFocusRing
  );
}

export { marketingLabel as studioFieldLabel };
