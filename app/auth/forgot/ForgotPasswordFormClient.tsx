'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { requestPasswordReset } from '@/lib/user/appwrite';
import AuthTextField from '@/components/auth/AuthTextField';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import AuthFormStagger from '@/components/auth/AuthFormStagger';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import { marketingLink } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function ForgotPasswordFormClient() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError((err as Error).message || 'Could not send reset email.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900"
      >
        <p className="font-semibold">Check your inbox</p>
        <p className="mt-1">
          If an account exists for that email, we sent a password reset link.
        </p>
        <Link href="/auth/login" className={cn('mt-3 inline-block font-semibold', marketingLink)}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <AuthFormStagger>
        <AuthTextField
          id="email"
          name="email"
          type="email"
          label="Email address"
          icon={<Mail />}
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <ErrorAlert message={error} />
        <AuthSubmitButton loading={loading} loadingText="Sending link...">
          Send reset link
        </AuthSubmitButton>
        <p className="!mt-6 text-center text-sm text-slate-600">
          Remember your password?{' '}
          <Link href="/auth/login" className={cn('font-semibold', marketingLink)}>
            Sign in
          </Link>
        </p>
      </AuthFormStagger>
    </form>
  );
}
