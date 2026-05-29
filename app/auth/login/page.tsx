'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { AlertCircle, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { login } from '@/lib/user/appwrite';

interface ValidationError { field: string; message: string; }

export default function Login() {
  const [error, setError]           = useState<ValidationError | null>(null);
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState('');
  const [passValue, setPassValue]   = useState('');
  const [showPass, setShowPass]     = useState(false);
  const router    = useRouter();
  const shakeCtrl = useAnimation();

  const validate = (email: string, password: string) => {
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
      return { field: 'email', message: 'Please enter a valid email address' };
    if (password.length < 6)
      return { field: 'password', message: 'Password must be at least 6 characters' };
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd       = new FormData(e.currentTarget);
    const email    = fd.get('email') as string;
    const password = fd.get('password') as string;
    const vErr     = validate(email, password);
    if (vErr) { setError(vErr); setLoading(false); return; }
    try {
      const session = await login(email, password);
      localStorage.setItem('sessionToken', session.secret);
      router.push('/home');
    } catch {
      setError({ field: 'general', message: 'Invalid email or password. Please try again.' });
      shakeCtrl.start({ x: [-8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.5 } });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full bg-secondary border rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200
    ${focused === field ? 'border-primary/60 ring-2 ring-primary/20' : 'border-input hover:border-primary/40'}
    ${error?.field === field ? '!border-red-500/60 !ring-red-500/20' : ''}`;

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue</p>
      </div>

      <motion.form onSubmit={handleSubmit} animate={shakeCtrl} className="space-y-4" noValidate aria-label="Sign in form">

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-foreground/70">Email address</label>
          <div className="relative">
            <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focused === 'email' ? 'text-primary' : 'text-muted-foreground/50'}`} aria-hidden="true" />
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={emailValue}
              onChange={e => setEmailValue(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="you@company.com"
              aria-invalid={error?.field === 'email' ? 'true' : 'false'}
              aria-describedby={error?.field === 'email' ? 'email-error' : undefined}
              className={inputCls('email')}
            />
          </div>
          <AnimatePresence>
            {error?.field === 'email' && (
              <motion.p id="email-error" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />{error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-medium text-foreground/70">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-primary hover:opacity-80 transition-opacity">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focused === 'password' ? 'text-primary' : 'text-muted-foreground/50'}`} aria-hidden="true" />
            <input
              id="password" name="password" type={showPass ? 'text' : 'password'} autoComplete="current-password" required
              value={passValue}
              onChange={e => setPassValue(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              aria-invalid={error?.field === 'password' ? 'true' : 'false'}
              aria-describedby={error?.field === 'password' ? 'password-error' : undefined}
              className={inputCls('password') + ' pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              {showPass ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
          <AnimatePresence>
            {error?.field === 'password' && (
              <motion.p id="password-error" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />{error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error?.field === 'general' && (
            <motion.div role="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{error.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          className="w-full grad hover:opacity-90 disabled:opacity-60 transition-opacity text-white font-medium py-3 rounded-xl text-sm mt-1 min-h-[44px]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Signing in...</span>
            </span>
          ) : 'Sign in'}
        </button>

        <p className="text-center text-sm text-muted-foreground pt-1">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:opacity-80 transition-opacity font-medium">
            Create one free
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
