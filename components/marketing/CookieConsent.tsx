'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const CONSENT_KEY = 'blogcreator_cookie_consent';

type ConsentValue = 'accepted' | 'essential-only';

function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth/');
}

export default function CookieConsent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthRoute(pathname)) return;
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const dismiss = (value: ConsentValue) => {
      localStorage.setItem(CONSENT_KEY, value);
      setVisible(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss('essential-only');
        return;
      }
      if (e.key !== 'Tab' || focusable.length === 0) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    first?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  const dismiss = (value: ConsentValue) => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible || isAuthRoute(pathname)) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Cookie notice"
      tabIndex={-1}
      className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 md:left-auto md:right-6"
    >
      <p className="text-sm text-slate-700 dark:text-slate-300">
        We use essential cookies for sign-in sessions and optional analytics to improve the product.{' '}
        <Link
          href="/privacy#cookies"
          className="font-semibold text-teal-700 underline-offset-2 hover:underline dark:text-teal-400"
        >
          Learn more
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => dismiss('accepted')}
          className={cn(
            'rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700',
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
          Reject all
        </button>
      </div>
    </div>
  );
}
