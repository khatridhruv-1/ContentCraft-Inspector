'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Check, Copy, Fingerprint, LogOut, Shield } from 'lucide-react';
import {
  marketingDestructiveButton,
  marketingLink,
  marketingMutedLink,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const profileSubtleFocus =
  'focus:outline-none focus-visible:ring-1 focus-visible:ring-white/25 focus-visible:ring-offset-1 focus-visible:ring-offset-[#09090b]';

interface ProfileAccountSectionProps {
  memberSince: string | null;
  userId: string;
  signingOut: boolean;
  onSignOut: () => void;
}

function SettingRow({
  icon: Icon,
  iconClass,
  title,
  description,
  children,
}: {
  icon: typeof Shield;
  iconClass: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 border-b border-white/[0.06] py-3 last:border-b-0">
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]',
          iconClass
        )}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/90">{title}</p>
        {description ? <p className="mt-0.5 text-xs text-white/45">{description}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </li>
  );
}

export default function ProfileAccountSection({
  memberSince,
  userId,
  signingOut,
  onSignOut,
}: ProfileAccountSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const shortId = userId.length > 12 ? `${userId.slice(0, 8)}…${userId.slice(-4)}` : userId;

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-white/45">Account details</h2>
      <p className="mt-1 mb-3 text-xs text-white/45">Security, membership, and support reference.</p>

      <ul className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3">
        <SettingRow
          icon={Shield}
          iconClass="text-emerald-400"
          title="Sign-in method"
          description="Email and password"
        >
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            Verified
          </span>
        </SettingRow>

        {memberSince && (
          <SettingRow icon={Calendar} iconClass="text-violet-400" title="Member since">
            <span className="whitespace-nowrap text-sm text-white/70">{memberSince}</span>
          </SettingRow>
        )}

        <SettingRow
          icon={Fingerprint}
          iconClass="text-indigo-300"
          title="User ID"
          description="For support"
        >
          <code className="hidden rounded-md border border-white/[0.08] bg-[#141418] px-2 py-1 font-mono text-[11px] text-white/70 sm:inline">
            {shortId}
          </code>
          <button
            type="button"
            onClick={handleCopyId}
            aria-label={copied ? 'User ID copied' : 'Copy user ID'}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white/80',
              profileSubtleFocus
            )}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'User ID copied to clipboard' : ''}
          </span>
        </SettingRow>
      </ul>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/90">Sign out</p>
          <p className="mt-0.5 text-xs text-white/45">This device only</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          disabled={signingOut}
          className={cn(marketingDestructiveButton, profileSubtleFocus, 'shrink-0 px-4 py-2')}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-white/40 sm:text-left">
        Need help?{' '}
        <Link href="/help" className={marketingLink}>
          Help Center
        </Link>
        {' · '}
        <Link href="/contact" className={marketingMutedLink}>
          Contact support
        </Link>
      </p>
    </div>
  );
}
