import { Wand2, FileSearch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type WorkflowModeId = 'ai-generate' | 'analyze';

export type ContentCraftWorkflow = {
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

export const CONTENTCRAFT_WORKFLOWS: ContentCraftWorkflow[] = [
  {
    id: 'ai-generate',
    title: 'AI Generation',
    description:
      'Draft blog posts from a brief — auto-discover trending keywords from search trends and autocomplete, then weave them naturally into SEO-ready content.',
    shortDescription: 'Auto keyword discovery + human-sounding drafts with tone control.',
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
  CONTENTCRAFT_WORKFLOWS.map(w => [w.id, w.title])
) as Record<WorkflowModeId, string>;
