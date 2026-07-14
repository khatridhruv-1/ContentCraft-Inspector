'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { logout, updateUserName } from '@/lib/user/appwrite';
import { clearAuthSession, getSessionToken } from '@/lib/user/session';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { MARKETING_EASE } from '@/lib/marketing/marketingTheme';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import HomeNav from '@/components/home/HomeNav';
import HomeFooter from '@/components/home/HomeFooter';
import { homeContainer } from '@/components/home/homeLayout';
import ProfileWorkspacePanel from '@/components/profile/ProfileWorkspacePanel';
import ProfileDisplayNameRow from '@/components/profile/ProfileDisplayNameRow';
import ProfileAccountSection from '@/components/profile/ProfileAccountSection';
import { marketingSkipLink } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: MARKETING_EASE } },
};

function formatMemberSince(timestamp: string) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export default function ProfilePage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { user, updateUser } = useCurrentUser();

  const [newName, setNewName] = useState(user.name);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const memberSince = formatMemberSince(user.$createdAt);

  const handleLogout = async () => {
    if (editing) {
      const leave = window.confirm('You have unsaved changes. Sign out anyway?');
      if (!leave) return;
    }

    try {
      setSigningOut(true);
      setError(null);
      const sessionToken = getSessionToken();
      if (sessionToken) await logout(sessionToken);
      clearAuthSession();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Sign out failed. Please try again.');
    } finally {
      setSigningOut(false);
    }
  };

  const handleUpdateName = async () => {
    const trimmed = newName.trim();
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }
  if (trimmed === user.name.trim()) {
      setEditing(false);
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      setSaved(false);

      const sessionToken = getSessionToken();
      if (!sessionToken) {
        router.push('/auth/login?returnUrl=/profile');
        return;
      }

      const updatedUser = await updateUserName(sessionToken, trimmed);
      updateUser({ name: updatedUser.name });
      setNewName(updatedUser.name);
      setEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      console.error('Name update failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to update name. Please try again.';
      setError(message.includes('expired') ? 'Your session expired. Please sign in again.' : message);
    } finally {
      setUpdating(false);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setNewName(user.name || '');
    setError(null);
  };

  return (
    <div className="relative flex flex-col">
      <a
        href="#main-content"
        className={marketingSkipLink}
      >
        Skip to main content
      </a>

      <MarketingDotGrid />
      <HomeNav />

      <motion.main
        id="main-content"
        aria-label="Profile settings"
        initial={reduced ? false : 'hidden'}
        animate="show"
        variants={rise}
        className={cn('relative z-10 py-6 md:py-10', homeContainer)}
      >
        {error && !editing && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <ProfileWorkspacePanel
          userName={user.name}
          email={user.email}
          displayNameSection={
            <ProfileDisplayNameRow
              name={user.name}
              newName={newName}
              editing={editing}
              updating={updating}
              error={editing ? error : null}
              saved={saved}
              onNewNameChange={setNewName}
              onStartEdit={() => {
                setEditing(true);
                setError(null);
                setSaved(false);
              }}
              onCancel={cancelEditing}
              onSave={handleUpdateName}
            />
          }
          accountSection={
            <ProfileAccountSection
              memberSince={memberSince}
              userId={user.$id}
              signingOut={signingOut}
              onSignOut={handleLogout}
            />
          }
        />
      </motion.main>

      <HomeFooter />
    </div>
  );
}
