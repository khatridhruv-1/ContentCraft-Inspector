import { marketingGlassCard } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export const dashboardGlassPanel = cn(
  marketingGlassCard,
  'flex flex-col overflow-hidden min-h-0'
);

export const dashboardPanelHeader =
  'flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5 md:px-6';

export const dashboardPanelHeaderCompact =
  'flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-3 py-2.5 sm:px-4';

export const dashboardPanelBody = 'flex-1 min-h-0 overflow-auto p-4 sm:p-5 md:p-6 custom-scrollbar';

export const dashboardPanelBodyCompact = 'flex-1 min-h-0 overflow-auto p-3 sm:p-4 custom-scrollbar';

export const dashboardToolbar =
  'flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 sm:gap-3 md:px-4';

export const dashboardWorkspace = 'flex min-h-0 flex-1 flex-col overflow-hidden';

export const dashboardSplitGrid =
  'grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-3 sm:p-4 md:gap-4 lg:grid-cols-2';

/** Studio: history sidebar left (lg+), workspace right; mobile uses sheet drawer */
export const studioSplitShell =
  'flex h-full min-h-0 flex-1 flex-col overflow-hidden lg:flex-row';

export const studioHistoryColumn =
  'relative hidden h-full min-h-0 w-80 max-w-[35%] shrink-0 flex-col overflow-hidden border-r border-slate-200/80 lg:flex';

export const studioWorkspaceColumn =
  'flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden';

export const dashboardResultCard =
  'rounded-xl border border-slate-200 bg-white shadow-sm';

export const dashboardResultCardHeader = 'border-b border-slate-200 px-4 py-3';

export const dashboardResultCardTitle =
  'flex items-center gap-2 text-base font-semibold text-slate-900';

export const dashboardResultCardBody = 'p-4';

export const dashboardMetricValue = 'text-2xl font-bold text-violet-600';

export const dashboardListItem =
  'flex items-start gap-3 border-b border-slate-200 pb-3 text-sm text-slate-600 last:border-0 last:pb-0';

export const dashboardBullet = 'mt-1 text-violet-500';
