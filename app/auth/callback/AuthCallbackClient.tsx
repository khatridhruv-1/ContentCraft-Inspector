'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import { marketingLink } from '@/lib/marketing/marketingTheme';
import { SESSION_TOKEN_KEY } from '@/lib/user/session';
import { cn } from '@/lib/utils';

function safeReturnUrl(returnUrl: string | null): string {
  if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
    return returnUrl;
  }
  return '/home';
}

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function finishOAuth() {
      try {
        const supabase = getSupabaseBrowser();

        const hash = window.location.hash.replace(/^#/, '');
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sessionError) throw sessionError;
          if (!data.session?.access_token) {
            throw new Error('Sign-in could not be completed. Try email login instead.');
          }
          localStorage.setItem(SESSION_TOKEN_KEY, data.session.access_token);
          window.history.replaceState(null, '', '/auth/callback');
        } else {
          const code = searchParams.get('code');
          if (code) {
            const { data, error: exchangeError } =
              await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) throw exchangeError;
            if (!data.session?.access_token) {
              throw new Error('Sign-in could not be completed. Try email login instead.');
            }
            localStorage.setItem(SESSION_TOKEN_KEY, data.session.access_token);
          } else {
            const { data } = await supabase.auth.getSession();
            if (!data.session?.access_token) {
              throw new Error('Sign-in could not be completed. Try email login instead.');
            }
            localStorage.setItem(SESSION_TOKEN_KEY, data.session.access_token);
          }
        }

        if (cancelled) return;
        router.replace(safeReturnUrl(searchParams.get('returnUrl')));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Sign-in could not be completed. Try email login instead.'
          );
        }
      }
    }

    finishOAuth();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900"
      >
        <p className="font-semibold">Could not complete sign-in</p>
        <p className="mt-1">{error}</p>
        <Link href="/auth/login" className={cn('mt-3 inline-block font-semibold', marketingLink)}>
          Back to sign in
        </Link>
      </div>
    );
  }

  return <PageLoadingScreen label="Completing sign-in" />;
}
