'use client';

import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

type OAuthProvider = 'google' | 'github';

const PROVIDERS: { id: OAuthProvider; label: string }[] = [
  { id: 'google', label: 'Google' },
  { id: 'github', label: 'GitHub' },
];

export default function OAuthButtons({
  mode,
  returnUrl,
}: {
  mode: 'login' | 'signup';
  returnUrl?: string | null;
}) {
  const [loading, setLoading] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuth = async (provider: OAuthProvider) => {
    setLoading(provider);
    setError(null);
    try {
      const supabase = getSupabaseBrowser();
      const callbackUrl = new URL(absoluteUrl('/auth/callback'));
      if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
        callbackUrl.searchParams.set('returnUrl', returnUrl);
      }
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not start social sign-in. Try email instead.';
      setError(message);
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-500">
        Or continue with
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PROVIDERS.map(p => (
          <button
            key={p.id}
            type="button"
            disabled={loading !== null}
            onClick={() => handleOAuth(p.id)}
            className={cn(
              'rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60',
              marketingFocusRing
            )}
          >
            {loading === p.id ? 'Redirecting…' : p.label}
          </button>
        ))}
      </div>
      {error ? (
        <p role="alert" className="text-center text-xs text-red-600">
          {error}
        </p>
      ) : null}
      <p className="text-center text-xs text-slate-500">
        {mode === 'signup' ? 'Sign up' : 'Sign in'} with Google or GitHub — same free workspace.
      </p>
    </div>
  );
}
