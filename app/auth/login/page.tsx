'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { AlertCircle, Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { login } from '@/lib/user/appwrite';

interface ValidationError { field: string; message: string; }

export default function Login() {
  const [error, setError]           = useState<ValidationError | null>(null);
  const [loading, setLoading]       = useState(false);
  const [focused, setFocused]       = useState<string | null>(null);
  const [emailValue, setEmailValue] = useState('');
  const [passValue, setPassValue]   = useState('');
  const router       = useRouter();
  const shakeCtrl    = useAnimation();

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

  return (
    <div>
      <div className="mb-7">
        <h3 className="text-lg font-semibold text-white">Welcome back</h3>
        <p className="text-sm text-white/40 mt-0.5">Sign in to your account to continue</p>
      </div>

      <motion.form onSubmit={handleSubmit} animate={shakeCtrl} className="space-y-4">

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-white/50">Email address</label>
          <div className="relative">
            <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focused === 'email' ? 'text-violet-400' : 'text-white/25'}`} />
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={emailValue}
              onChange={e => setEmailValue(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="you@company.com"
              className={`w-full bg-white/[0.06] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all duration-200
                ${focused === 'email' ? 'border-violet-500/60 ring-2 ring-violet-500/20' : 'border-white/10 hover:border-white/20'}
                ${error?.field === 'email' ? '!border-red-500/60 !ring-red-500/20' : ''}`}
            />
          </div>
          <AnimatePresence>
            {error?.field === 'email' && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-white/50">Password</label>
          <div className="relative">
            <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focused === 'password' ? 'text-violet-400' : 'text-white/25'}`} />
            <input
              id="password" name="password" type="password" autoComplete="current-password" required
              value={passValue}
              onChange={e => setPassValue(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              className={`w-full bg-white/[0.06] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all duration-200
                ${focused === 'password' ? 'border-violet-500/60 ring-2 ring-violet-500/20' : 'border-white/10 hover:border-white/20'}
                ${error?.field === 'password' ? '!border-red-500/60 !ring-red-500/20' : ''}`}
            />
          </div>
          <AnimatePresence>
            {error?.field === 'password' && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error?.field === 'general' && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5" />{error.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={loading}
          className="w-full relative overflow-hidden bg-violet-600 hover:bg-violet-500 disabled:opacity-60 transition-colors text-white font-medium py-2.5 rounded-xl text-sm mt-1"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
            </span>
          ) : 'Sign in'}
        </button>

        <p className="text-center text-xs text-white/35 pt-1">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
