import type { LucideIcon } from 'lucide-react';
import { CONTENTCRAFT_WORKFLOWS } from '@/lib/marketing/workflows';
import { MARKETING_EASE } from '@/lib/marketing/marketingTheme';

export type AuthFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
};

export const AUTH_FEATURES: AuthFeature[] = CONTENTCRAFT_WORKFLOWS.map(w => ({
  icon: w.icon,
  title: w.title,
  description: w.shortDescription,
  gradient: w.gradient,
}));

/** @deprecated Use MARKETING_EASE from @/lib/marketing/marketingTheme */
export const AUTH_EASE = MARKETING_EASE;
