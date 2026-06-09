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
  gradient: string;
  hoverBorder: string;
  tag: string;
  glowColor: string;
};

export const HOME_WORKFLOWS: HomeWorkflow[] = CONTENTCRAFT_WORKFLOWS.map(w => ({
  id: w.id,
  title: w.title,
  description: w.shortDescription,
  icon: w.icon,
  gradient: w.gradient,
  hoverBorder: w.hoverBorder,
  tag: w.tag,
  glowColor: w.glowColor,
}));

export { MODE_LABELS };
