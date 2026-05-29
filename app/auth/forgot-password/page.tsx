'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/user/appwrite';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Check your email</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We sent a password reset link to <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive it?{' '}
              <button onClick={() => setSent(false)} className="text-primary underline">
                Try again
              </button>
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to sign in
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">Forgot password?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="text-xs font-medium text-foreground/70">Email address</label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focused ? 'text-primary' : 'text-muted-foreground/50'}`} aria-hidden="true" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className={`w-full bg-secondary border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ${focused ? 'border-primary/60 ring-2 ring-primary/20' : 'border-input hover:border-primary/40'}`}
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full grad text-white font-medium py-3 rounded-xl text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px]"
              >
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /><span>Sending...</span></span> : 'Send reset link'}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                <Link href="/auth/login" className="flex items-center justify-center gap-1 hover:text-foreground transition-colors">
                  <ArrowLeft className="h-3 w-3" /> Back to sign in
                </Link>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
