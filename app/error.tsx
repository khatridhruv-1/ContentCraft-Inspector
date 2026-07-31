'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import BlogCreatorNavBrand from '@/components/brand/BlogCreatorNavBrand';
import {
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingFocusRing,
  marketingPageClass,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className={cn(
        'marketing-page flex min-h-screen flex-col items-center justify-center px-6',
        marketingPageClass
      )}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <Link href="/" className={cn('mb-8', marketingFocusRing)} aria-label="BlogCreator home">
        <BlogCreatorNavBrand />
      </Link>
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">
        Something went wrong
      </p>
      <h1 className={cn(marketingSectionTitle, 'mt-3 text-center text-balance')}>
        We hit an unexpected <span className={marketingAccentSpan}>error</span>
      </h1>
      <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-slate-600">
        Try again. If it keeps happening, return home or contact support.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className={cn(
            'rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800',
            marketingFocusRing
          )}
        >
          Try again
        </button>
        <Link
          href="/"
          className={cn(
            'rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50',
            marketingFocusRing
          )}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
