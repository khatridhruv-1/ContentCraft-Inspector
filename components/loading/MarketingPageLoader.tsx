'use client';

import ContentCraftLogo from '@/components/brand/ContentCraftLogo';
import { cn } from '@/lib/utils';
import loaderStyles from '@/components/loading/loader.module.css';

type MarketingPageLoaderProps = {
  className?: string;
};

/** Light-theme branded loader for full-page overlays */
export function MarketingPageLoader({ className }: MarketingPageLoaderProps) {
  return (
    <div className={cn(loaderStyles.pageLoader, className)} aria-hidden>
      <span className={loaderStyles.pageGlow} />
      <span className={loaderStyles.pageRingOuter} />
      <span className={loaderStyles.pageRingInner} />
      <div className={loaderStyles.pageIcon}>
        <ContentCraftLogo iconOnly className="!h-16 !w-16 sm:!h-[4.5rem] sm:!w-[4.5rem]" />
      </div>
    </div>
  );
}
