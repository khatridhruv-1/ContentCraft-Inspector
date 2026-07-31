'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { profileGlassPanel, profileSectionDivider } from '@/components/profile/profileLayout';
import {
  MARKETING_EASE,
  marketingAccentSpan,
  marketingEyebrow,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('') || '?'
  );
}

type ProfileWorkspacePanelProps = {
  userName: string;
  email: string;
  displayNameSection: ReactNode;
  accountSection: ReactNode;
};

export default function ProfileWorkspacePanel({
  userName,
  email,
  displayNameSection,
  accountSection,
}: ProfileWorkspacePanelProps) {
  const reduced = useReducedMotion();
  const firstName = userName.split(/\s+/)[0] || userName;

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: MARKETING_EASE }}
      className="relative mb-8 md:mb-10"
      aria-labelledby="profile-heading"
    >
      <div className={profileGlassPanel}>
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-12 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-md sm:h-16 sm:w-16 sm:text-xl"
                aria-hidden
              >
                {getInitials(userName)}
              </div>

              <div className="min-w-0">
                <span className={cn('mb-2 inline-flex', marketingEyebrow)}>Account</span>
                <h1
                  id="profile-heading"
                  className="text-balance text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
                >
                  {firstName ? (
                    <>
                      Hi, <span className={marketingAccentSpan}>{firstName}</span>
                    </>
                  ) : (
                    <>
                      Your <span className={marketingAccentSpan}>account</span>
                    </>
                  )}
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  Update your display name and manage this session.
                </p>
                <p className="mt-2.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <span className="truncate">{email}</span>
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit shrink-0 items-center gap-1.5 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:self-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              Active session
            </span>
          </div>

          <div className={profileSectionDivider}>{displayNameSection}</div>
          <div className={profileSectionDivider}>{accountSection}</div>
        </div>
      </div>
    </motion.header>
  );
}
