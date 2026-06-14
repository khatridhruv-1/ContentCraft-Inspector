'use client';

import { ArrowRight, Clock } from 'lucide-react';
import { homeFocusRing } from '@/components/home/homeLayout';
import { marketingGlassCard } from '@/lib/marketing/marketingTheme';
import { MODE_LABELS, type HomeModeId } from '@/components/home/homeWorkflows';
import { cn } from '@/lib/utils';

export type HomeRecentItem = {
  $id: string;
  content: string;
  mode?: string;
  createdAt: string;
  updatedAt: string;
};

interface HomeRecentSectionProps {
  items: HomeRecentItem[];
  formatRelativeTime: (iso: string) => string;
  previewText: (raw: string) => string;
  onOpen: (item: HomeRecentItem) => void;
  embedded?: boolean;
}

export default function HomeRecentSection({
  items,
  formatRelativeTime,
  previewText,
  onOpen,
  embedded = false,
}: HomeRecentSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      className={embedded ? undefined : 'mb-8 md:mb-10'}
      aria-labelledby="recent-heading"
    >
      <h2
        id="recent-heading"
        className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500"
      >
        Continue
      </h2>
      <ul className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {items.map(item => {
          const modeLabel =
            item.mode && item.mode in MODE_LABELS
              ? MODE_LABELS[item.mode as HomeModeId]
              : null;

          return (
            <li key={item.$id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => onOpen(item)}
                className={cn(
                  marketingGlassCard,
                  'group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:border-violet-200',
                  homeFocusRing
                )}
              >
                <span className="flex shrink-0 flex-col gap-0.5 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:gap-1">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden />
                    {formatRelativeTime(item.updatedAt || item.createdAt)}
                  </span>
                  {modeLabel ? (
                    <span className="font-medium text-violet-700">{modeLabel}</span>
                  ) : null}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                  {previewText(item.content) || 'Untitled draft'}
                </p>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-violet-600"
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
