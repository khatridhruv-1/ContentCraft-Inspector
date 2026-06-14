'use client';

import { cn } from '@/lib/utils';
import loaderStyles from '@/components/loading/loader.module.css';

/** Inline button loader size */
export const APP_LOADER_SIZE_SM = 20;

export interface AppLoaderProps {
  className?: string;
  /** Use inside buttons — parent provides aria-busy / loading text */
  decorative?: boolean;
  label?: string;
}

/** Small violet + primary ring for buttons and inline actions */
export function AppLoader({
  className,
  label = 'Loading',
  decorative = false,
}: AppLoaderProps) {
  const glyph = (
    <span
      className={loaderStyles.ai}
      style={{
        ['--app-loader-size' as string]: `${APP_LOADER_SIZE_SM}px`,
        width: APP_LOADER_SIZE_SM,
        height: APP_LOADER_SIZE_SM,
      }}
      aria-hidden
    >
      <span className={loaderStyles.glow} />
      <span className={loaderStyles.ring} />
      <span className={loaderStyles.core} />
    </span>
  );

  if (decorative) {
    return (
      <span className={cn('inline-flex shrink-0 items-center justify-center', className)}>
        {glyph}
      </span>
    );
  }

  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {glyph}
      <span className="sr-only">{label}</span>
    </span>
  );
}
