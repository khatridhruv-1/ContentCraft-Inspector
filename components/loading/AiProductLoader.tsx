'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { AI_PRODUCT_LOADER_ASSETS } from '@/lib/loading/aiProductLoaderAssets';
import loaderStyles from '@/components/loading/loader.module.css';

type AiProductLoaderProps = {
  className?: string;
};

/**
 * Dribbble #6298759 — morphing AI blob (WebM/MP4 + poster).
 * @see https://dribbble.com/shots/6298759-AI-technology-product-loading-animation-3
 */
export function AiProductLoader({ className }: AiProductLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const ensurePlaying = useCallback(() => {
    const video = videoRef.current;
    if (!video || videoFailed || reducedMotion) return;

    if (video.ended || video.paused) {
      try {
        if (video.ended) video.currentTime = 0;
        void video.play().catch(() => undefined);
      } catch {
        /* ignore during unmount */
      }
    }
  }, [videoFailed, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed || reducedMotion) return;

    const onVisibility = () => {
      if (document.visibilityState === 'visible') ensurePlaying();
    };

    video.addEventListener('ended', ensurePlaying);
    video.addEventListener('stalled', ensurePlaying);
    video.addEventListener('waiting', ensurePlaying);
    document.addEventListener('visibilitychange', onVisibility);
    ensurePlaying();

    return () => {
      video.removeEventListener('ended', ensurePlaying);
      video.removeEventListener('stalled', ensurePlaying);
      video.removeEventListener('waiting', ensurePlaying);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ensurePlaying, videoFailed, reducedMotion]);

  if (videoFailed || reducedMotion) {
    return (
      <div
        className={cn(loaderStyles.productMedia, loaderStyles.productFallback, className)}
        aria-hidden
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className={cn(loaderStyles.productMedia, className)}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster={AI_PRODUCT_LOADER_ASSETS.poster}
      width={800}
      height={600}
      aria-hidden
      onLoadedData={ensurePlaying}
      onCanPlay={ensurePlaying}
      onError={() => setVideoFailed(true)}
    >
      <source src={AI_PRODUCT_LOADER_ASSETS.mp4} type="video/mp4" />
      <source src={AI_PRODUCT_LOADER_ASSETS.webm} type="video/webm" />
    </video>
  );
}
