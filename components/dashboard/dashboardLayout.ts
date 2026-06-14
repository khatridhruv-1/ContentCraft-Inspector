import { marketingGlassCard } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export const dashboardGlassPanel = cn(
  marketingGlassCard,
  'flex flex-col overflow-hidden min-h-0'
);

export const dashboardPanelHeader =
  'flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 md:px-6';

export const dashboardPanelHeaderCompact =
  'flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5';

export const dashboardPanelBody = 'flex-1 min-h-0 overflow-auto p-5 md:p-6 custom-scrollbar';

export const dashboardPanelBodyCompact = 'flex-1 min-h-0 overflow-auto p-4 custom-scrollbar';

export const dashboardToolbar =
  'flex shrink-0 flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2 md:px-4';

export const dashboardWorkspace = 'flex min-h-0 flex-1 flex-col overflow-hidden';

export const dashboardSplitGrid =
  'grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-3 md:gap-4 md:p-4 lg:grid-cols-2';

/** Studio: history sidebar left, workspace right */
export const studioSplitShell =
  'flex h-full min-h-0 flex-1 flex-row overflow-hidden max-sm:flex-col';

export const studioHistoryColumn =
  'relative flex h-full min-h-0 w-80 max-w-[34%] shrink-0 flex-col overflow-hidden border-r border-slate-200/80 max-sm:h-[40%] max-sm:w-full max-sm:max-w-none max-sm:border-r-0 max-sm:border-b';

export const studioWorkspaceColumn =
  'flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden max-sm:h-[60%]';

/** @deprecated Use studioHistoryColumn */
export const studioChatColumn = studioHistoryColumn;

/** @deprecated Use studioWorkspaceColumn */
export const studioOutputColumn = studioWorkspaceColumn;

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
