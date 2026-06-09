'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail } from 'lucide-react';
import HomeSectionHeader from '@/components/home/HomeSectionHeader';
import { profileGlassPanel, profileSectionDivider } from '@/components/profile/profileLayout';
import { MARKETING_EASE, marketingAccentSpan } from '@/lib/marketing/marketingTheme';
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
      className="relative mb-6 md:mb-7"
      aria-labelledby="profile-heading"
    >
      <div className={profileGlassPanel}>
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-5 sm:gap-6">
          <div className="flex gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-violet-500/25 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-base"
              aria-hidden
            >
              {getInitials(userName)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <HomeSectionHeader
                  headingLevel="h1"
                  headingId="profile-heading"
                  eyebrow="Account"
                  title={
                    <>
                      {firstName ? (
                        <>
                          Hi, <span className={marketingAccentSpan}>{firstName}</span>
                        </>
                      ) : (
                        <>
                          Your <span className={marketingAccentSpan}>account</span>
                        </>
                      )}
                    </>
                  }
                  description="Update your display name and manage this session."
                />
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                  Active
                </span>
              </div>
              <p className="-mt-0.5 flex items-center gap-1.5 text-sm text-white/55">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{email}</span>
              </p>
            </div>
          </div>

          <div className={profileSectionDivider}>{displayNameSection}</div>
          <div className={profileSectionDivider}>{accountSection}</div>
        </div>
      </div>
    </motion.header>
  );
}
