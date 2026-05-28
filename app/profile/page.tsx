'use client';

import { useEffect, useState } from 'react';
import { getUser, logout, updateUserName } from '@/lib/user/appwrite';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Edit,
  Check,
  X,
  ArrowLeft,
  User,
  Mail,
  Shield,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; $id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
          router.push('/auth/login');
          return;
        }

        const userData = await getUser(sessionToken);
        setUser(userData);
        setNewName(userData.name);
        setMemberSince(formatDate(userData.$createdAt));
        setAuthChecked(true);
      } catch (err: unknown) {
        console.error('Profile fetch failed:', err);
        const msg = (err as Error)?.message ?? '';
        if (msg === 'SESSION_EXPIRED') {
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('documentId');
          router.push('/auth/login');
          return;
        }
        setAuthChecked(true);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        await logout(sessionToken);
        localStorage.removeItem('sessionToken');
      }
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (newName.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        router.push('/auth/login');
        return;
      }

      const updatedUser = await updateUserName(sessionToken, newName);
      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      console.error('Name update failed:', error);
      setError('Failed to update name. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setNewName(user?.name || '');
    setError(null);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  if (!authChecked) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(var(--sidebar-background))' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 text-center"
        >
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-muted-foreground">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--sidebar-background))' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-lg">Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-foreground">Profile Settings</h1>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <LogOut className="h-5 w-5" />
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl shadow-sm p-8"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-violet-500/15 border border-violet-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-violet-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  {user?.name}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Name Edit Section */}
            <div className="space-y-4">
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-muted-foreground" />
                    Display Name
                  </h3>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {editing ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Enter your name"
                      />

                      {error && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-destructive text-sm flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </motion.p>
                      )}

                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleUpdateName}
                          disabled={updating}
                          className="flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 rounded-xl text-sm font-medium transition-opacity"
                        >
                          {updating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={updating}
                          className="flex items-center gap-2 bg-secondary text-muted-foreground hover:bg-secondary/80 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-foreground"
                    >
                      {user?.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Account Security</h3>
                  <p className="text-sm text-muted-foreground">Your account is secure</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Member Since</h3>
                  <p className="text-sm text-muted-foreground">{memberSince}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
