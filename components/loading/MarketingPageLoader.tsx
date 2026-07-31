'use client';

import BlogCreatorLogo from '@/components/brand/BlogCreatorLogo';
import { cn } from '@/lib/utils';
import loaderStyles from '@/components/loading/loader.module.css';

type MarketingPageLoaderProps = {
  className?: string;
};

/**
 * Ranked Draft Pulse — logo breathe, teal ripples, orbiting workflow dots,
 * drafting lines + SEO bars echoing the BlogCreator icon.
 */
export function MarketingPageLoader({ className }: MarketingPageLoaderProps) {
  return (
    <div className={cn(loaderStyles.pageLoader, className)} aria-hidden>
      <span className={loaderStyles.pageRipple} />
      <span className={loaderStyles.pageRipple} />
      <span className={loaderStyles.pageRipple} />

      <div className={loaderStyles.pageOrbit}>
        <span className={cn(loaderStyles.pageOrbitDot, loaderStyles.pageOrbitDotSeo)} />
        <span className={cn(loaderStyles.pageOrbitDot, loaderStyles.pageOrbitDotDraft)} />
        <span className={cn(loaderStyles.pageOrbitDot, loaderStyles.pageOrbitDotRank)} />
      </div>

      <div className={loaderStyles.pageOrbitReverse}>
        <span className={loaderStyles.pageOrbitSpark} />
      </div>

      <div className={loaderStyles.pageStage}>
        <div className={loaderStyles.pageLogoWrap}>
          <BlogCreatorLogo iconOnly className="!h-16 !w-16 sm:!h-[4.5rem] sm:!w-[4.5rem]" />
        </div>

        <div className={loaderStyles.pageDraft}>
          <span className={loaderStyles.pageDraftLine} />
          <span className={loaderStyles.pageDraftLine} />
          <span className={loaderStyles.pageDraftLine} />
        </div>

        <div className={loaderStyles.pageBars}>
          <span className={loaderStyles.pageBar} />
          <span className={loaderStyles.pageBar} />
          <span className={loaderStyles.pageBarAccent} />
        </div>
      </div>
    </div>
  );
}
