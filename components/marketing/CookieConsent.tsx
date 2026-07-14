'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const CONSENT_KEY = 'blogcreator_cookie_consent';

type ConsentValue = 'accepted' | 'essential-only';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss('essential-only');
    };
    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  const dismiss = (value: ConsentValue) => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-label="Cookie notice"
      tabIndex={-1}
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 md:left-auto md:right-6"
    >
      <p className="text-sm text-slate-700 dark:text-slate-300">
        We use essential cookies for sign-in sessions and optional analytics to improve the product.{' '}
        <Link
          href="/privacy#cookies"
          className="font-semibold text-violet-700 underline-offset-2 hover:underline dark:text-violet-400"
        >
          Learn more
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => dismiss('accepted')}
          className={cn(
            'rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700',
            marketingFocusRing
          )}
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => dismiss('essential-only')}
          className={cn(
            'rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200',
            marketingFocusRing
          )}
        >
          Essential only
        </button>
      </div>
    </div>
  );
}
