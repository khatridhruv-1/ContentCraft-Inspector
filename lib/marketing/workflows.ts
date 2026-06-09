import { Wand2, FileSearch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type WorkflowModeId = 'ai-generate' | 'analyze';

export type ContentCraftWorkflow = {
  id: WorkflowModeId;
  title: string;
  description: string;
  shortDescription: string;
  icon: LucideIcon;
  gradient: string;
  hoverBorder: string;
  tag: string;
  glowColor: string;
};

export const CONTENTCRAFT_WORKFLOWS: ContentCraftWorkflow[] = [
  {
    id: 'ai-generate',
    title: 'AI Generation',
    description:
      'Draft blog posts, ad copy, and emails from a brief — with structure and tone you control.',
    shortDescription: 'Draft posts, ads, and emails with structure you control.',
    icon: Wand2,
    gradient: 'from-violet-500 to-purple-600',
    hoverBorder: 'hover:border-violet-500/40',
    tag: 'AI Powered',
    glowColor: 'rgba(139,92,246,0.28)',
  },
  {
    id: 'analyze',
    title: 'Deep Analysis',
    description:
      'Get readability, SEO structure, and content-gap insights in one pass.',
    shortDescription: 'SEO, readability, and content-gap insights in one pass.',
    icon: FileSearch,
    gradient: 'from-blue-500 to-indigo-500',
    hoverBorder: 'hover:border-blue-500/40',
    tag: 'Analytics',
    glowColor: 'rgba(99,102,241,0.26)',
  },
];

export const MODE_LABELS: Record<WorkflowModeId, string> = Object.fromEntries(
  CONTENTCRAFT_WORKFLOWS.map(w => [w.id, w.title])
) as Record<WorkflowModeId, string>;
