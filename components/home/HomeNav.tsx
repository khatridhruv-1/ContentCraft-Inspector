'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HelpCircle, History, LayoutDashboard, Sparkles, User } from 'lucide-react';
import { homeContainer } from '@/components/home/homeLayout';
import {
  marketingBrandIcon,
  marketingHeaderBar,
  marketingBrandIconSm,
  marketingFocusRing,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function HomeNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isProfile = pathname === '/profile';

  const navBtn = cn(
    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white sm:px-3',
    marketingFocusRing
  );

  const profileNavClass = cn(
    navBtn,
    isProfile && 'bg-white/[0.08] text-white',
    'px-2.5'
  );

  return (
    <header className={marketingHeaderBar}>
      <div className={cn(homeContainer, 'flex h-12 items-center justify-between gap-3 md:h-14')}>
        <Link
          href="/home"
          className={cn('flex min-w-0 items-center gap-2', marketingFocusRing)}
          aria-label="ContentCraft home"
        >
          <div className={cn(marketingBrandIconSm, marketingBrandIcon)}>
            <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white/90">
            ContentCraft
            <span className="hidden text-white/40 sm:inline"> Inspector</span>
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-0.5" aria-label="Workspace navigation">
          <button type="button" onClick={() => router.push('/dashboard')} className={navBtn}>
            <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">Dashboard</span>
          </button>
          <button type="button" onClick={() => router.push('/history')} className={navBtn}>
            <History className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">History</span>
          </button>
          <Link href="/help" className={navBtn}>
            <HelpCircle className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">Help</span>
          </Link>
          <Link
            href="/profile"
            className={profileNavClass}
            aria-label="Profile"
            aria-current={isProfile ? 'page' : undefined}
          >
            <User className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden lg:inline">Profile</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
