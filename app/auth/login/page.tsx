'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { login } from '@/lib/user/appwrite';
import { motion, AnimatePresence, useAnimation, useReducedMotion } from 'framer-motion';
import { AlertCircle, Loader2, Mail, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ValidationError {
  field: string;
  message: string;
}

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: PREMIUM_EASE },
  },
};

export default function Login() {
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const emailShakeControls = useAnimation();
  const passwordShakeControls = useAnimation();

  const triggerShake = (controls: ReturnType<typeof useAnimation>) => {
    if (shouldReduceMotion) return;
    controls.start({
      x: [-8, 8, -6, 6, -3, 3, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    });
  };

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
      if (validationError.field === 'email') triggerShake(emailShakeControls);
      if (validationError.field === 'password') triggerShake(passwordShakeControls);
      return;
    }

    try {
      const session = await login(email, password);
      localStorage.setItem('sessionToken', session.secret);
      setSuccess(true);
      setTimeout(() => router.push('/home'), 700);
    } catch {
      setError({
        field: 'general',
        message: 'Invalid email or password. Please try again.',
      });
      triggerShake(emailShakeControls);
      triggerShake(passwordShakeControls);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
    setTimeout(() => setRipple(null), 600);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Welcome Back!</h3>
        <p className="text-sm text-gray-500 mt-1">Sign in to continue to your account</p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        variants={shouldReduceMotion ? undefined : containerVariants}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'visible'}
        className="space-y-5"
      >
        {/* Email field */}
        <motion.div variants={shouldReduceMotion ? undefined : fieldVariants}>
          <motion.div className="relative" animate={emailShakeControls}>
            <motion.div
              className="absolute left-3 top-4 pointer-events-none z-10"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: focusedField === 'email' ? 1.15 : 1,
                      color: focusedField === 'email' ? '#3b82f6' : '#9ca3af',
                    }
              }
              transition={{ duration: 0.15 }}
            >
              <Mail className="h-5 w-5" />
            </motion.div>

            <AnimatePresence>
              {focusedField === 'email' && !shouldReduceMotion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 rounded-md ring-2 ring-blue-400/40 pointer-events-none z-10"
                />
              )}
            </AnimatePresence>

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
              className={`peer pl-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                ${error?.field === 'email' ? 'border-red-500 focus-visible:ring-red-500/40' : 'border-gray-300'}`}
            />
            <label
              htmlFor="email"
              className={`absolute left-10 pointer-events-none transition-all duration-200 origin-left
                ${(focusedField === 'email' || emailValue) ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
            >
              Email Address
            </label>
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
        </motion.div>

        {/* Password field */}
        <motion.div variants={shouldReduceMotion ? undefined : fieldVariants}>
          <motion.div className="relative" animate={passwordShakeControls}>
            <motion.div
              className="absolute left-3 top-4 pointer-events-none z-10"
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: focusedField === 'password' ? 1.15 : 1,
                      color: focusedField === 'password' ? '#3b82f6' : '#9ca3af',
                    }
              }
              transition={{ duration: 0.15 }}
            >
              <Lock className="h-5 w-5" />
            </motion.div>

            <AnimatePresence>
              {focusedField === 'password' && !shouldReduceMotion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 rounded-md ring-2 ring-blue-400/40 pointer-events-none z-10"
                />
              )}
            </AnimatePresence>

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
              className={`peer pl-10 h-14 pt-5 pb-1 text-sm transition-all duration-200
                focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-0
                ${error?.field === 'password' ? 'border-red-500 focus-visible:ring-red-500/40' : 'border-gray-300'}`}
            />
            <label
              htmlFor="password"
              className={`absolute left-10 pointer-events-none transition-all duration-200 origin-left
                ${(focusedField === 'password' || passwordValue) ? 'top-2 text-xs text-blue-600' : 'top-4 text-sm text-gray-500'}`}
            >
              Password
            </label>
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

        <motion.div className="pt-2" variants={shouldReduceMotion ? undefined : fieldVariants}>
          <motion.button
            type="submit"
            disabled={loading || success}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            onClick={handleButtonClick}
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 group disabled:opacity-70"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
            <AnimatePresence>
              {ripple && (
                <motion.span
                  key={ripple.id}
                  initial={{ scale: 0, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute rounded-full bg-white/40 pointer-events-none"
                  style={{
                    width: 300,
                    height: 300,
                    left: ripple.x - 150,
                    top: ripple.y - 150,
                  }}
                />
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.span
                  key="success"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="relative flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Success!
                </motion.span>
              ) : loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative flex items-center justify-center gap-2"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  Sign in
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="relative font-medium text-blue-600">
              <motion.span
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="inline-block relative"
              >
                Sign up
                {!shouldReduceMotion && (
                  <motion.span
                    variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 left-0 h-px w-full bg-blue-500 origin-left"
                  />
                )}
              </motion.span>
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </div>
  );
}
