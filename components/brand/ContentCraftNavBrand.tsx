import ContentCraftLogo from '@/components/brand/ContentCraftLogo';
import { BRAND_ASSETS, type BrandLogoVariant } from '@/lib/brand/assets';
import { cn } from '@/lib/utils';

interface ContentCraftNavBrandProps {
  variant?: BrandLogoVariant;
  className?: string;
  priority?: boolean;
}

/** Nav/header lockup — large icon + readable wordmark */
export default function ContentCraftNavBrand({
  variant = 'light',
  className,
  priority = false,
}: ContentCraftNavBrandProps) {
  const wordmarkSrc =
    variant === 'dark' ? BRAND_ASSETS.logoWordmarkDark : BRAND_ASSETS.logoWordmark;

  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2.5 sm:gap-3', className)}>
      <ContentCraftLogo
        iconOnly
        variant={variant}
        className="!h-12 !w-12 shrink-0 sm:!h-14 sm:!w-14"
        priority={priority}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={wordmarkSrc}
        alt=""
        aria-hidden
        width={640}
        height={90}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        className="block h-9 w-auto min-w-[9rem] shrink sm:h-10 sm:min-w-[10rem] md:h-11"
        draggable={false}
      />
    </span>
  );
}
