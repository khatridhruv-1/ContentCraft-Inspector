import { Wand2, FileSearch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type WorkflowModeId = 'ai-generate' | 'analyze';

export type BlogCreatorWorkflow = {
  id: WorkflowModeId;
  title: string;
  description: string;
  shortDescription: string;
  icon: LucideIcon;
  iconSurface: string;
  iconColor: string;
  hoverBorder: string;
  tag: string;
};

export const BLOGCREATOR_WORKFLOWS: BlogCreatorWorkflow[] = [
  {
    id: 'ai-generate',
    title: 'AI Generation',
    description:
      'Choose a platform — website, LinkedIn, Quora, Medium, or Substack — then draft with auto-discovered keywords woven into format-specific, publish-ready content.',
    shortDescription: 'Platform picker + keyword discovery + tone control in one flow.',
    icon: Wand2,
    iconSurface: 'bg-violet-100',
    iconColor: 'text-violet-700',
    hoverBorder: 'hover:border-violet-200',
    tag: 'AI Powered',
  },
  {
    id: 'analyze',
    title: 'Deep Analysis',
    description:
      'Get readability, SEO structure, and content-gap insights in one pass.',
    shortDescription: 'SEO, readability, and content-gap insights in one pass.',
    icon: FileSearch,
    iconSurface: 'bg-sky-50',
    iconColor: 'text-sky-700',
    hoverBorder: 'hover:border-sky-200',
    tag: 'Analytics',
  },
];

export const MODE_LABELS: Record<WorkflowModeId, string> = Object.fromEntries(
  BLOGCREATOR_WORKFLOWS.map(w => [w.id, w.title])
) as Record<WorkflowModeId, string>;
