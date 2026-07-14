'use client';

import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { MARKETING_EASE } from '@/lib/marketing/marketingTheme';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import HomeNav from '@/components/home/HomeNav';
import HomeFooter from '@/components/home/HomeFooter';
import HomeSectionHeader from '@/components/home/HomeSectionHeader';
import HomeWorkspacePanel from '@/components/home/HomeWorkspacePanel';
import HomeWorkflowCard from '@/components/home/HomeWorkflowCard';
import { type HomeRecentItem } from '@/components/home/HomeRecentSection';
import { homeContainer } from '@/components/home/homeLayout';
import {
  HOME_WORKFLOWS,
  MODE_LABELS,
  type HomeModeId,
} from '@/components/home/homeWorkflows';
import { marketingAccentSpan, marketingSkipLink } from '@/lib/marketing/marketingTheme';
import HomeOnboarding from '@/components/home/HomeOnboarding';
import { cn } from '@/lib/utils';

function previewText(raw: string, max = 72) {
  const plain = raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max)}…`;
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d ago` : new Date(iso).toLocaleDateString();
}

export default function Home() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { user, recentHistory } = useCurrentUser();

  const userName = user.name?.split(' ')[0] || '';
  const recentItems = recentHistory as HomeRecentItem[];

  const goToMode = (mode: HomeModeId) => router.push(`/dashboard?mode=${mode}`);

  const openRecent = (item: HomeRecentItem) => {
    const mode =
      item.mode && item.mode in MODE_LABELS ? (item.mode as HomeModeId) : 'ai-generate';
    router.push(`/dashboard?mode=${mode}`);
  };

  return (
    <div className="relative flex min-h-full flex-col">
      <a href="#main-content" className={marketingSkipLink}>
        Skip to main content
      </a>

      <MarketingDotGrid />
      <HomeNav />

      <motion.main
        id="main-content"
        aria-label="Workspace home"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: MARKETING_EASE }}
        className={cn('relative z-10 flex-1 py-6 md:py-10', homeContainer)}
      >
        <HomeWorkspacePanel
          userName={userName}
          recentItems={recentItems}
          formatRelativeTime={formatRelativeTime}
          previewText={raw => previewText(raw)}
          onOpenRecent={openRecent}
        />

        <HomeOnboarding recentCount={recentItems.length} />

        <div className="mb-8 md:mb-10" aria-hidden>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        <section aria-labelledby="workflows-heading">
          <HomeSectionHeader
            className="mb-8 md:mb-10"
            headingId="workflows-heading"
            centered
            eyebrow="Workflows"
            title={
              <>
                What do you want to{' '}
                <span className={marketingAccentSpan}>work on?</span>
              </>
            }
            description="Each card opens the dashboard in that mode — your only launchers on this page."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {HOME_WORKFLOWS.map((workflow, i) => (
              <HomeWorkflowCard
                key={workflow.id}
                workflow={workflow}
                index={i}
                onSelect={() => goToMode(workflow.id)}
              />
            ))}
          </div>
        </section>
      </motion.main>

      <HomeFooter />
    </div>
  );
}
