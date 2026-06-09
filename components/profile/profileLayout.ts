import { marketingGlassCard } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

/** Matches HomeWorkspacePanel glass treatment */
export const profileGlassPanel = cn(
  marketingGlassCard,
  'relative overflow-hidden p-5 md:p-6'
);

/** Section divider inside the panel — matches home recent block */
export const profileSectionDivider = 'border-t border-white/[0.06] pt-4 sm:pt-5';
