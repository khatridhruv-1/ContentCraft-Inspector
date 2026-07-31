'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { login } from '@/lib/user/appwrite';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import OAuthButtons from '@/components/auth/OAuthButtons';
import AuthTextField from '@/components/auth/AuthTextField';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import AuthFormStagger from '@/components/auth/AuthFormStagger';
import { MARKETING_EASE, marketingLink } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';

interface ValidationError {
  field: string;
  message: string;
}

function getReturnUrlLabel(returnUrl: string | null): string | null {
  if (!returnUrl || !returnUrl.startsWith('/') || returnUrl.startsWith('//')) return null;
  if (returnUrl === '/home' || returnUrl.startsWith('/home')) return 'your dashboard';
  if (returnUrl.startsWith('/dashboard')) return 'the dashboard';
  return 'where you left off';
}

export default function LoginFormClient() {
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const shakeControls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  const returnUrl = searchParams.get('returnUrl');
  const returnLabel = getReturnUrlLabel(returnUrl);

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
      const safeUrl =
        returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
          ? returnUrl
          : '/home';
      setIsRedirecting(true);
      router.push(safeUrl);
    } catch (err) {
      const msg = (err as Error).message;
      const normalized = msg.toLowerCase();

      const isCredentialError =
        normalized.includes('invalid login credentials') ||
        normalized.includes('invalid email or password');

      const friendlyMessage = isCredentialError
        ? 'Invalid email or password. Please try again.'
        : msg || 'Sign in failed. Please try again.';

      setError({
        field: 'general',
        message: friendlyMessage,
      });
      if (!shouldReduceMotion) {
        shakeControls.start({
          x: [-8, 8, -6, 6, -3, 3, 0],
          transition: { duration: 0.5, ease: MARKETING_EASE },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isRedirecting) {
    return <PageLoadingScreen label="Opening workspace" />;
  }

  return (
    <>
      {returnLabel && (
        <p className="-mt-2 mb-6 rounded-xl border border-teal-200/80 bg-white/70 px-4 py-3 text-sm text-teal-900/90">
          After sign in you&apos;ll return to{' '}
          <span className="font-semibold text-teal-950">{returnLabel}</span>.
        </p>
      )}

      <motion.form onSubmit={handleSubmit} animate={shakeControls}>
        <AuthFormStagger>
          <OAuthButtons mode="login" returnUrl={returnUrl} placement="above" />

          <AuthTextField
            id="email"
            name="email"
            type="email"
            label="Email address"
            icon={<Mail />}
            value={emailValue}
            onChange={e => setEmailValue(e.target.value)}
            error={error?.field === 'email' ? error.message : undefined}
            autoComplete="email"
            required
          />

          <div>
            <AuthTextField
              id="password"
              name="password"
              type="password"
              label="Password"
              icon={<Lock />}
              value={passwordValue}
              onChange={e => setPasswordValue(e.target.value)}
              error={error?.field === 'password' ? error.message : undefined}
              autoComplete="current-password"
              required
            />
            <p className="mt-2 text-right">
              <Link href="/auth/forgot" className={cn('text-xs font-medium', marketingLink)}>
                Forgot password?
              </Link>
            </p>
          </div>

          <ErrorAlert message={error?.field === 'general' ? error.message : ''} />

          <AuthSubmitButton loading={loading} loadingText="Signing in...">
            Sign in
          </AuthSubmitButton>

          <p className="!mt-5 text-center text-sm text-slate-600">
            New here?{' '}
            <Link
              href="/auth/signup"
              className={cn(
                'font-semibold text-teal-800 underline-offset-2 hover:underline',
                marketingLink
              )}
            >
              Start creating for free
            </Link>
          </p>
        </AuthFormStagger>
      </motion.form>
    </>
  );
}
