'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MARKETING_EASE, marketingAccentSpan } from '@/lib/marketing/marketingTheme';
import HomeRecentSection, { type HomeRecentItem } from '@/components/home/HomeRecentSection';
import HomeSectionHeader from '@/components/home/HomeSectionHeader';
import { cn } from '@/lib/utils';

type HomeWorkspacePanelProps = {
  userName: string;
  recentItems: HomeRecentItem[];
  formatRelativeTime: (iso: string) => string;
  previewText: (raw: string) => string;
  onOpenRecent: (item: HomeRecentItem) => void;
};

function formatTodayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function HomeWorkspacePanel({
  userName,
  recentItems,
  formatRelativeTime,
  previewText,
  onOpenRecent,
}: HomeWorkspacePanelProps) {
  const reduced = useReducedMotion();
  const [todayLabel, setTodayLabel] = useState<string | null>(null);
  const recentCount = recentItems.length;

  useEffect(() => {
    setTodayLabel(formatTodayLabel());
  }, []);

  const description =
    recentCount > 0
      ? `${recentCount} draft${recentCount === 1 ? '' : 's'} ready to resume — or start a new workflow below.`
      : 'Choose a workflow below. Dashboard, history, and help are in the top menu.';

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: MARKETING_EASE }}
      className="relative mb-6 md:mb-7"
      aria-labelledby="workspace-heading"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-sm shadow-black/25 backdrop-blur-sm md:p-6',
          'ring-1 ring-inset ring-white/[0.06]'
        )}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <HomeSectionHeader
              headingLevel="h1"
              headingId="workspace-heading"
              eyebrow="Workspace"
              title={
                userName ? (
                  <>
                    Welcome back,{' '}
                    <span className={marketingAccentSpan}>{userName}</span>
                  </>
                ) : (
                  <>
                    Your creative{' '}
                    <span className={marketingAccentSpan}>command center</span>
                  </>
                )
              }
              description={description}
            />

            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/50">
              <Sparkles className={cn('h-3 w-3 shrink-0', marketingAccentSpan)} aria-hidden />
              {todayLabel ?? '\u00a0'}
            </span>
          </div>

          {recentCount > 0 && (
            <div className="border-t border-white/[0.06] pt-5">
              <HomeRecentSection
                items={recentItems}
                formatRelativeTime={formatRelativeTime}
                previewText={previewText}
                onOpen={onOpenRecent}
                embedded
              />
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
