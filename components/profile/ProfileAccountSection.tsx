'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Check, Copy, Fingerprint, LogOut, Shield } from 'lucide-react';
import {
  profileCompactButton,
  profileSectionHint,
  profileSectionLabel,
} from '@/components/profile/profileLayout';
import {
  marketingDestructiveButton,
  marketingFocusRing,
  marketingLink,
  marketingMutedLink,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface ProfileAccountSectionProps {
  memberSince: string | null;
  userId: string;
  signingOut: boolean;
  onSignOut: () => void;
}

function SettingRow({
  icon: Icon,
  iconSurface,
  iconColor,
  title,
  description,
  children,
}: {
  icon: typeof Shield;
  iconSurface: string;
  iconColor: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3 border-b border-slate-200 py-4 last:border-b-0 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80',
            iconSurface,
            iconColor
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 pl-[3.25rem] sm:pl-0">{children}</div>
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
      <h2 className={profileSectionLabel}>Account details</h2>
      <p className={cn(profileSectionHint, 'mb-4')}>
        Security, membership, and support reference.
      </p>

      <ul className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-4">
        <SettingRow
          icon={Shield}
          iconSurface="bg-emerald-50"
          iconColor="text-emerald-700"
          title="Sign-in method"
          description="Email and password"
        >
          <Link
            href="/auth/forgot"
            className={cn(profileCompactButton, 'whitespace-nowrap')}
          >
            Change password
          </Link>
        </SettingRow>

        <SettingRow
          icon={Calendar}
          iconSurface="bg-teal-50"
          iconColor="text-teal-700"
          title="Member since"
          description={memberSince ? undefined : 'Join date unavailable'}
        >
          <span className="whitespace-nowrap text-sm font-medium text-slate-700">
            {memberSince ?? '—'}
          </span>
        </SettingRow>

        <SettingRow
          icon={Fingerprint}
          iconSurface="bg-indigo-50"
          iconColor="text-indigo-700"
          title="User ID"
          description="For support"
        >
          <code className="hidden rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-600 sm:inline">
            {shortId}
          </code>
          <button
            type="button"
            onClick={handleCopyId}
            aria-label={copied ? 'User ID copied' : 'Copy user ID'}
            className={profileCompactButton}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
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

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Sign out</p>
            <p className="mt-0.5 text-sm text-slate-500">Ends your session on this device only.</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            disabled={signingOut}
            className={cn(
              marketingDestructiveButton,
              marketingFocusRing,
              'shrink-0 !w-auto px-4 py-2'
            )}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
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
