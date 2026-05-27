'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { login } from '@/lib/user/appwrite';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { AlertCircle, Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import AuthTextField from '@/components/auth/AuthTextField';
import { useGuestGuard } from '@/hooks/useAuthRedirect';

interface ValidationError {
  field: string;
  message: string;
}

function LoginForm() {
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const shakeControls = useAnimation();

  useGuestGuard();

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
      const returnUrl = searchParams.get('returnUrl');
      const safeUrl =
        returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
          ? returnUrl
          : '/home';
      router.push(safeUrl);
    } catch {
      setError({
        field: 'general',
        message: 'Invalid email or password. Please try again.',
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-1">Sign in to your account to continue</p>
      </div>

      <motion.form onSubmit={handleSubmit} animate={shakeControls} className="space-y-5">
        <AuthTextField
          id="email"
          name="email"
          type="email"
          label="Email Address"
          icon={<Mail className="h-5 w-5" />}
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          error={error?.field === 'email' ? error.message : undefined}
          autoComplete="email"
          required
        />

        <AuthTextField
          id="password"
          name="password"
          type="password"
          label="Password"
          icon={<Lock className="h-5 w-5" />}
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          error={error?.field === 'password' ? error.message : undefined}
          autoComplete="current-password"
          required
        />

        <AnimatePresence>
          {error?.field === 'general' && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-2">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
