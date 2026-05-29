'use client';

import { useEffect, useState } from 'react';
import { getUser, logout, updateUserName } from '@/lib/user/appwrite';
import { useRouter } from 'next/navigation';
import { LogOut, Edit, Check, X, ArrowLeft, User, Mail, Shield, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; $id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) { router.push('/auth/login'); return; }
        const userData = await getUser(sessionToken);
        setUser(userData);
        setNewName(userData.name);
        setMemberSince(new Date(userData.$createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' }));
        setAuthChecked(true);
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? '';
        if (msg === 'SESSION_EXPIRED') {
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('documentId');
        }
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) { await logout(sessionToken); localStorage.removeItem('sessionToken'); }
      router.push('/auth/login');
    } catch { setError('Logout failed. Please try again.'); }
  };

  const handleUpdateName = async () => {
    if (newName.trim().length < 2) { setError('Name must be at least 2 characters'); return; }
    try {
      setUpdating(true); setError(null);
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) { router.push('/auth/login'); return; }
      const updatedUser = await updateUserName(sessionToken, newName);
      setUser(updatedUser); setEditing(false);
    } catch { setError('Failed to update name. Please try again.'); }
    finally { setUpdating(false); }
  };

  if (!authChecked) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Back */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group min-h-[40px]"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Page heading */}
          <h1 className="text-xl font-bold text-foreground">Your Profile</h1>

          {/* Avatar + name + email */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0" aria-hidden="true">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                <Mail className="w-3 h-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{user?.email}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:opacity-80 transition-opacity px-3 py-2 rounded-lg border border-destructive/30 hover:bg-destructive/5 min-h-[36px] shrink-0"
              aria-label="Sign out of your account"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> Sign out
            </button>
          </div>

          <div className="border-t border-border" />

          {/* Display name edit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground" htmlFor={editing ? 'display-name-input' : undefined}>
                Display Name
              </label>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs text-primary hover:opacity-80 transition-opacity"
                  aria-label="Edit display name"
                >
                  <Edit className="w-3.5 h-3.5" aria-hidden="true" /> Edit
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div key="edit" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="space-y-2">
                  <input
                    id="display-name-input"
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="Your display name"
                    aria-label="Display name"
                    aria-describedby={error ? 'name-update-error' : undefined}
                    autoFocus
                  />
                  {error && <p id="name-update-error" role="alert" className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />{error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateName}
                      disabled={updating}
                      className="flex items-center gap-1.5 text-xs font-medium grad text-white px-3 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity min-h-[36px]"
                    >
                      {updating ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" /><span>Saving...</span></> : <><Check className="w-3.5 h-3.5" aria-hidden="true" />Save</>}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setNewName(user?.name || ''); setError(null); }}
                      disabled={updating}
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors min-h-[36px]"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" /> Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.p key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-foreground font-medium">
                  {user?.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-border" />

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-foreground">Security</p>
                <p className="text-xs text-muted-foreground">Account secure</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border">
              <Calendar className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-foreground">Member since</p>
                <p className="text-xs text-muted-foreground">{memberSince}</p>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
