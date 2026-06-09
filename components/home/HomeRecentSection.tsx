'use client';

import { ArrowRight, Clock } from 'lucide-react';
import { homeFocusRing } from '@/components/home/homeLayout';
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
  /** When true, omit outer section margin (nested in workspace panel) */
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
      className={embedded ? undefined : 'mb-6 md:mb-7'}
      aria-labelledby="recent-heading"
    >
      <h2
        id="recent-heading"
        className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-white/45"
      >
        Continue
      </h2>
      <ul className="flex flex-col gap-2 sm:flex-row sm:gap-3">
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
                  'flex w-full items-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 py-2.5 text-left transition-colors hover:border-violet-500/30 hover:bg-white/[0.06]',
                  homeFocusRing
                )}
              >
                <span className="flex shrink-0 items-center gap-1 text-[11px] text-white/45">
                  <Clock className="h-3 w-3" aria-hidden />
                  {formatRelativeTime(item.updatedAt || item.createdAt)}
                  {modeLabel ? (
                    <>
                      <span aria-hidden> · </span>
                      {modeLabel}
                    </>
                  ) : null}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-white/80">
                  {previewText(item.content) || 'Untitled draft'}
                </p>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
