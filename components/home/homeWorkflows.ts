import type { LucideIcon } from 'lucide-react';
import {
  CONTENTCRAFT_WORKFLOWS,
  MODE_LABELS,
  type WorkflowModeId,
} from '@/lib/marketing/workflows';

export type HomeModeId = WorkflowModeId;

export type HomeWorkflow = {
  id: HomeModeId;
  title: string;
  description: string;
  icon: LucideIcon;
  iconSurface: string;
  iconColor: string;
  hoverBorder: string;
  tag: string;
};

export const HOME_WORKFLOWS: HomeWorkflow[] = CONTENTCRAFT_WORKFLOWS.map(w => ({
  id: w.id,
  title: w.title,
  description: w.description,
  icon: w.icon,
  iconSurface: w.iconSurface,
  iconColor: w.iconColor,
  hoverBorder: w.hoverBorder,
  tag: w.tag,
}));

export { MODE_LABELS };
