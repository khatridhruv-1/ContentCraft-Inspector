'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/user/appwrite';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { AlertCircle, Loader2, Mail, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ValidationError {
  field: string;
  message: string;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring' as const, stiffness: 300, damping: 24, delay },
});

export default function Login() {
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const router = useRouter();
  const shakeControls = useAnimation();

  const isEmailValid = Boolean(emailValue.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/));
  const isPasswordValid = passwordValue.length >= 6;

  const validateForm = (email: string, password: string) => {
    if (!email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
      return { field: 'email', message: 'Please enter a valid email address' };
    }
    if (password.length < 6) {
      return { field: 'password', message: 'Password must be at least 6 characters' };
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validationError = validateForm(email, password);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const session = await login(email, password);
      localStorage.setItem('sessionToken', session.secret);
      setSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      router.push('/home');
    } catch {
      setError({
        field: 'general',
        message: 'Invalid email or password. Please try again.'
      });
      shakeControls.start({
        x: [-8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div {...fadeUp(0)} className="text-center mb-6">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 text-transparent bg-clip-text animate-shimmer-text">
          Welcome Back!
        </h3>
        <p className="text-sm text-gray-500 mt-1">Sign in to continue to your account</p>
      </motion.div>

      <motion.form onSubmit={handleSubmit} animate={shakeControls} className="space-y-5">
        {/* Email */}
        <motion.div {...fadeUp(0.07)} className="relative">
          <motion.div
            animate={{
              boxShadow: focusedField === 'email'
                ? '0 0 0 3px rgba(59, 130, 246, 0.2)'
                : '0 0 0 0px rgba(59, 130, 246, 0)',
            }}
            transition={{ duration: 0.2 }}
            className="relative rounded-md"
          >
            <div className="absolute left-3 top-4 pointer-events-none z-10 transition-colors duration-200">
              <Mail className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder=" "
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={`peer pl-10 pr-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                ${focusedField === 'email' ? 'bg-blue-50/30' : ''}
                ${error?.field === 'email' ? 'border-red-500 focus-visible:ring-red-500/40' : 'border-gray-300'}`}
            />
            <label
              htmlFor="email"
              className={`absolute left-10 pointer-events-none transition-all duration-200 origin-left
                ${(focusedField === 'email' || emailValue) ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
            >
              Email Address
            </label>
            <div className="absolute right-3 top-4 pointer-events-none z-10">
              <AnimatePresence>
                {isEmailValid && error?.field !== 'email' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <AnimatePresence>
            {error?.field === 'email' && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Password */}
        <motion.div {...fadeUp(0.14)} className="relative">
          <motion.div
            animate={{
              boxShadow: focusedField === 'password'
                ? '0 0 0 3px rgba(59, 130, 246, 0.2)'
                : '0 0 0 0px rgba(59, 130, 246, 0)',
            }}
            transition={{ duration: 0.2 }}
            className="relative rounded-md"
          >
            <div className="absolute left-3 top-4 pointer-events-none z-10">
              <Lock className={`h-5 w-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder=" "
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className={`peer pl-10 pr-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                ${focusedField === 'password' ? 'bg-blue-50/30' : ''}
                ${error?.field === 'password' ? 'border-red-500 focus-visible:ring-red-500/40' : 'border-gray-300'}`}
            />
            <label
              htmlFor="password"
              className={`absolute left-10 pointer-events-none transition-all duration-200 origin-left
                ${(focusedField === 'password' || passwordValue) ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
            >
              Password
            </label>
            <div className="absolute right-3 top-4 pointer-events-none z-10">
              <AnimatePresence>
                {isPasswordValid && error?.field !== 'password' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <AnimatePresence>
            {error?.field === 'password' && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {error?.field === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div {...fadeUp(0.21)} className="pt-2">
          <motion.div whileTap={!loading && !success ? { scale: 0.97 } : {}}>
            <Button
              type="submit"
              disabled={loading || success}
              className={`w-full relative overflow-hidden py-2.5 rounded-lg font-medium transition-all duration-300 text-white
                ${success
                  ? 'bg-green-500 hover:bg-green-500'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group'}`}
            >
              {!success && (
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
              )}
              <span className="relative">
                {success ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Success!
                  </motion.span>
                ) : loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </span>
            </Button>
          </motion.div>

          <AnimatePresence>
            {loading && !success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 2.5, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors relative group"
            >
              Sign up
              <span className="absolute bottom-0 left-0 h-[1px] bg-blue-500 w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </div>
  );
}
