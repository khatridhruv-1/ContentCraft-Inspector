'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { updatePassword } from '@/lib/user/appwrite';
import AuthTextField from '@/components/auth/AuthTextField';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import AuthFormStagger from '@/components/auth/AuthFormStagger';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import { marketingLink } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function ResetPasswordFormClient() {
  const router = useRouter();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function bootstrapRecoverySession() {
      try {
        const supabase = getSupabaseBrowser();
        const hash = window.location.hash.replace(/^#/, '');
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          if (!cancelled && data.session?.access_token) {
            setSessionToken(data.session.access_token);
            window.history.replaceState(null, '', '/auth/reset');
          }
          return;
        }

        const { data } = await supabase.auth.getSession();
        if (!cancelled && data.session?.access_token) {
          setSessionToken(data.session.access_token);
        }
      } catch {
        if (!cancelled) setError('This reset link is invalid or expired.');
      } finally {
        if (!cancelled) setBooting(false);
      }
    }

    bootstrapRecoverySession();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sessionToken) {
      setError('Your reset link has expired. Request a new one.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await updatePassword(sessionToken, password);
      localStorage.setItem('sessionToken', sessionToken);
      router.push('/home');
    } catch (err) {
      setError((err as Error).message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  if (booting) return <PageLoadingScreen label="Verifying reset link" />;

  if (!sessionToken && !error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
        <p className="font-semibold">Reset link expired</p>
        <p className="mt-1">Request a new password reset email to continue.</p>
        <Link href="/auth/forgot" className={cn('mt-3 inline-block font-semibold', marketingLink)}>
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <AuthFormStagger>
        <AuthTextField
          id="password"
          name="password"
          type="password"
          label="New password"
          icon={<Lock />}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <ErrorAlert message={error} />
        <AuthSubmitButton loading={loading} loadingText="Updating password...">
          Update password
        </AuthSubmitButton>
      </AuthFormStagger>
    </form>
  );
}
