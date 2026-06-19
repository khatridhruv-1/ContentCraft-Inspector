'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MarketingPageLoader } from '@/components/loading/MarketingPageLoader';
import MarketingDotGrid from '@/components/marketing/MarketingDotGrid';
import { acquireScrollLock } from '@/lib/loading/scrollLock';
import { marketingGlassCard } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';
import loaderStyles from '@/components/loading/loader.module.css';

type PageLoadingScreenProps = {
  label?: string;
};

/** Full-viewport loader — light marketing UI */
export function PageLoadingScreen({ label = 'Loading' }: PageLoadingScreenProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    const releaseScroll = acquireScrollLock();
    return () => releaseScroll();
  }, []);

  const overlay = (
    <div
      className="page-loading-screen fixed inset-0 z-[99999] flex items-center justify-center bg-slate-50 px-5"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <MarketingDotGrid />

      <div
        className={cn(
          marketingGlassCard,
          'relative flex w-full max-w-md flex-col items-center px-10 py-12 text-center sm:px-12 sm:py-14'
        )}
      >
        <MarketingPageLoader />

        {/* HTML text avoids SVG <text>-node font rendering artifacts */}
        <span
          aria-hidden
          className="mt-8 block select-none text-2xl leading-none font-bold tracking-tight text-slate-900 sm:text-[1.625rem]"
        >
          ContentCraft <span className="font-light">Inspector</span>
        </span>

        <p className="mt-4 text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          {label}
        </p>

        <div className={cn('mt-8 w-full max-w-xs sm:max-w-sm', loaderStyles.pageProgress)}>
          <div className={loaderStyles.pageProgressBar} />
        </div>
      </div>

      <span className="sr-only">{label}</span>
    </div>
  );

  if (!portalRoot) return overlay;

  return createPortal(overlay, portalRoot);
}

export default PageLoadingScreen;
