'use client';

import { useEffect, useState, type ReactNode } from 'react';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import { PAGE_LOADER_MIN_MS } from '@/lib/loading/minDisplay';

/**
 * Fullscreen loader on first mount while route content mounts underneath.
 * Content must render during the overlay so post-loader views are not blank.
 */
export function InitialMountLoader({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), PAGE_LOADER_MIN_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={ready ? undefined : 'invisible'} aria-hidden={!ready}>
        {children}
      </div>
      {!ready && <PageLoadingScreen label="Loading page" />}
    </>
  );
}
