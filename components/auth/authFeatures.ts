import type { LucideIcon } from 'lucide-react';
import { BLOGCREATOR_WORKFLOWS } from '@/lib/marketing/workflows';

export type AuthFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
  iconSurface: string;
  iconColor: string;
};

export const AUTH_FEATURES: AuthFeature[] = BLOGCREATOR_WORKFLOWS.map(w => ({
  icon: w.icon,
  title: w.title,
  description: w.shortDescription,
  iconSurface: w.iconSurface,
  iconColor: w.iconColor,
}));
