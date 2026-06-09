'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AiProductLoader } from '@/components/loading/AiProductLoader';
import { AI_PRODUCT_LOADER_PRELOAD } from '@/lib/loading/aiProductLoaderAssets';
import { acquireScrollLock } from '@/lib/loading/scrollLock';

type PageLoadingScreenProps = {
  /** Screen reader label — video shows “Loading…” */
  label?: string;
};

/**
 * Full-viewport Dribbble AI product loader (#6298759) — morphing blob only.
 * @see https://dribbble.com/shots/6298759-AI-technology-product-loading-animation-3
 */
export function PageLoadingScreen({ label = 'Loading' }: PageLoadingScreenProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    const releaseScroll = acquireScrollLock();

    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'video';
    preload.href = AI_PRODUCT_LOADER_PRELOAD;
    document.head.appendChild(preload);

    return () => {
      releaseScroll();
      preload.remove();
    };
  }, []);

  const overlay = (
    <div
      className="page-loading-screen fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 99999, backgroundColor: '#000000' }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <AiProductLoader />
      <span className="sr-only">{label}</span>
    </div>
  );

  if (!portalRoot) return overlay;

  return createPortal(overlay, portalRoot);
}

export default PageLoadingScreen;
