'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const CONSENT_KEY = 'blogcreator_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(CONSENT_KEY) !== '1') {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm md:left-auto md:right-6"
    >
      <p className="text-sm text-slate-700">
        We use essential cookies for sign-in sessions and optional analytics to improve the product.{' '}
        <Link href="/privacy#cookies" className="font-semibold text-violet-700 underline-offset-2 hover:underline">
          Learn more
        </Link>
      </p>
      <button
        type="button"
        onClick={accept}
        className={cn(
          'mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700',
          marketingFocusRing
        )}
      >
        Accept
      </button>
    </div>
  );
}
