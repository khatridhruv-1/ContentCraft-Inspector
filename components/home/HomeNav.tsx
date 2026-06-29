'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { History, LayoutDashboard, User } from 'lucide-react';
import BlogCreatorNavBrand from '@/components/brand/BlogCreatorNavBrand';
import {
  MARKETING_EASE,
  marketingFocusRing,
  marketingGhostNav,
  marketingNavPill,
} from '@/lib/marketing/marketingTheme';
import { homeContainer } from '@/components/home/homeLayout';
import { cn } from '@/lib/utils';

export default function HomeNav() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isProfile = pathname === '/profile';

  const navBtn = (active = false) =>
    cn(
      marketingGhostNav,
      '!h-9 px-2.5 text-sm sm:px-3',
      active && 'bg-slate-100 text-slate-900 font-medium',
      marketingFocusRing
    );

  return (
    <motion.nav
      initial={reduced ? false : { y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: MARKETING_EASE }}
      className="sticky top-0 z-50 px-4 py-2.5 md:px-6"
      aria-label="Workspace navigation"
    >
      <div
        className={cn(
          homeContainer,
          'relative flex min-h-[3.75rem] items-center justify-between gap-3 !px-3 py-2 sm:!px-4'
        )}
      >
        <div
          className={cn('absolute inset-x-0 inset-y-0 rounded-2xl -z-10', marketingNavPill)}
        />

        <Link
          href="/home"
          className={cn('flex min-w-0 max-w-[58%] items-center sm:max-w-none', marketingFocusRing)}
          aria-label="BlogCreator home"
        >
          <BlogCreatorNavBrand priority />
        </Link>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className={navBtn()}
            aria-label="Dashboard"
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/history')}
            className={navBtn()}
            aria-label="History"
          >
            <History className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">History</span>
          </button>
          <Link
            href="/profile"
            className={navBtn(isProfile)}
            aria-label="Profile"
            aria-current={isProfile ? 'page' : undefined}
          >
            <User className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">Profile</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
