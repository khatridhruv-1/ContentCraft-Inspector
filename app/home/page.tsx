'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { getUser } from '@/lib/user/appwrite';
import { clearAuthSession, getSessionToken } from '@/lib/user/session';
import { fetchHistory } from '@/lib/content/appwrite';
import { AUTH_EASE } from '@/components/auth/authFeatures';
import HomeBackground from '@/components/home/HomeBackground';
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
import { cn } from '@/lib/utils';

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: AUTH_EASE } },
};

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

  const [userName, setUserName] = useState('');
  const [recentItems, setRecentItems] = useState<HomeRecentItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const sessionToken = getSessionToken();
        if (!sessionToken) return;

        const user = await getUser(sessionToken);
        if (cancelled) return;
        if (!user) {
          clearAuthSession();
          router.replace('/auth/login?returnUrl=/home');
          return;
        }
        setUserName(user.name?.split(' ')[0] || '');

        const history = await fetchHistory(user.$id, 1, 2);
        if (cancelled) return;
        setRecentItems((history.documents as HomeRecentItem[]) || []);
      } catch {
        if (!cancelled) setRecentItems([]);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const goToMode = (mode: HomeModeId) => router.push(`/dashboard?mode=${mode}`);

  const openRecent = (item: HomeRecentItem) => {
    const mode =
      item.mode && item.mode in MODE_LABELS ? (item.mode as HomeModeId) : 'ai-generate';
    router.push(`/dashboard?mode=${mode}`);
  };

  return (
    <div className="relative flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <HomeBackground />
      <HomeNav />

      <motion.main
        id="main-content"
        aria-label="Workspace home"
        initial={reduced ? false : 'hidden'}
        animate="show"
        variants={rise}
        className={cn('relative z-10 pb-6 pt-5 md:pb-8 md:pt-7', homeContainer)}
      >
        <HomeWorkspacePanel
          userName={userName}
          recentItems={recentItems}
          formatRelativeTime={formatRelativeTime}
          previewText={raw => previewText(raw)}
          onOpenRecent={openRecent}
        />

        <section aria-labelledby="workflows-heading">
          <HomeSectionHeader
            className="mb-5 md:mb-6"
            headingId="workflows-heading"
            eyebrow="Workflows"
            title={
              <>
                What do you want to{' '}
                <span className="text-violet-400">work on?</span>
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
