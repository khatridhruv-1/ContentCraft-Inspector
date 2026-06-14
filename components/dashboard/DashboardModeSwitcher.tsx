'use client';

import { FileSearch, Wand2 } from 'lucide-react';
import { MODE_LABELS, type HomeModeId } from '@/components/home/homeWorkflows';
import { studioModePill } from '@/lib/dashboard/studioTheme';
import { marketingNavPill } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const MODES: HomeModeId[] = ['ai-generate', 'analyze'];

const MODE_ICONS = {
  'ai-generate': Wand2,
  analyze: FileSearch,
} as const;

type DashboardModeSwitcherProps = {
  mode: HomeModeId;
  onModeChange: (mode: HomeModeId) => void;
  className?: string;
};

export default function DashboardModeSwitcher({
  mode,
  onModeChange,
  className,
}: DashboardModeSwitcherProps) {
  return (
    <div
      className={cn('inline-flex rounded-full p-1', marketingNavPill, className)}
      role="tablist"
      aria-label="Dashboard workflow"
    >
      {MODES.map(id => {
        const Icon = MODE_ICONS[id];
        const active = mode === id;

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onModeChange(id)}
            className={studioModePill(active)}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="hidden sm:inline">{MODE_LABELS[id]}</span>
            <span className="sm:hidden">{id === 'ai-generate' ? 'Create' : 'Analyze'}</span>
          </button>
        );
      })}
    </div>
  );
}
