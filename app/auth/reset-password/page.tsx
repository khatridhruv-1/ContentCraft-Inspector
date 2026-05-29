'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { resetPassword } from '@/lib/user/appwrite';

export default function ResetPassword() {
  const [accessToken, setAccessToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);
  const router = useRouter();

  // Supabase puts the token in the URL hash: #access_token=...&type=recovery
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const token = params.get('access_token');
    const type   = params.get('type');
    if (token && type === 'recovery') {
      setAccessToken(token);
    } else {
      setError('Invalid or expired reset link. Please request a new one.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      await resetPassword(accessToken, password);
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full bg-secondary border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ${focused === field ? 'border-primary/60 ring-2 ring-primary/20' : 'border-input hover:border-primary/40'}`;

  if (done) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Password updated!</h3>
          <p className="text-sm text-muted-foreground mt-1">Redirecting you to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Set new password</h2>
        <p className="text-sm text-muted-foreground mt-1">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="text-xs font-medium text-foreground/70">New password</label>
          <div className="relative">
            <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focused === 'pw' ? 'text-primary' : 'text-muted-foreground/50'}`} aria-hidden="true" />
            <input
              id="new-password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocused('pw')}
              onBlur={() => setFocused(null)}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              className={inputCls('pw')}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-xs font-medium text-foreground/70">Confirm password</label>
          <div className="relative">
            <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focused === 'cf' ? 'text-primary' : 'text-muted-foreground/50'}`} aria-hidden="true" />
            <input
              id="confirm-password"
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onFocus={() => setFocused('cf')}
              onBlur={() => setFocused(null)}
              placeholder="Repeat password"
              autoComplete="new-password"
              className={inputCls('cf')}
            />
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !accessToken || !password || !confirm}
          className="w-full grad text-white font-medium py-3 rounded-xl text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px]"
        >
          {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /><span>Updating...</span></span> : 'Update password'}
        </button>
      </form>
    </motion.div>
  );
}
