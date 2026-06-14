import { BRAND_ASSETS, type BrandLogoVariant } from '@/lib/brand/assets';
import { cn } from '@/lib/utils';

/** Wordmark height — wide SVG (~3.6:1); use md+ in nav for readability */
const HEADER_HEIGHT = {
  xs: 'h-7',
  sm: 'h-9',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-14',
} as const;

const ICON_SIZE = {
  xs: 'h-7 w-7',
  sm: 'h-8 w-8',
  md: 'h-9 w-9',
  lg: 'h-11 w-11',
  xl: 'h-14 w-14',
} as const;

export type ContentCraftLogoSize = keyof typeof HEADER_HEIGHT;

export interface ContentCraftLogoProps {
  variant?: BrandLogoVariant;
  size?: ContentCraftLogoSize;
  iconOnly?: boolean;
  /** Animated draw-in SVG (marketing only) */
  animated?: boolean;
  className?: string;
  priority?: boolean;
}

export default function ContentCraftLogo({
  variant = 'light',
  size = 'md',
  iconOnly = false,
  animated = false,
  className,
  priority = false,
}: ContentCraftLogoProps) {
  const src = iconOnly
    ? BRAND_ASSETS.favicon
    : animated
      ? variant === 'dark'
        ? BRAND_ASSETS.logoHeaderDarkAnimated
        : BRAND_ASSETS.logoHeaderAnimated
      : variant === 'dark'
        ? BRAND_ASSETS.logoHeaderDark
        : BRAND_ASSETS.logoHeader;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- brand SVG assets
    <img
      src={src}
      alt="ContentCraft Inspector"
      width={iconOnly ? 240 : 870}
      height={iconOnly ? 240 : 240}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={cn(
        'block shrink-0 select-none',
        iconOnly ? ICON_SIZE[size] : cn('h-auto w-auto', HEADER_HEIGHT[size]),
        className
      )}
      draggable={false}
    />
  );
}
