import { BRAND_ASSETS } from '@/lib/brand/assets';
import { cn } from '@/lib/utils';

/** Wordmark height — wide SVG (~4.3:1); use md+ in nav for readability */
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

export type BlogCreatorLogoSize = keyof typeof HEADER_HEIGHT;

export interface BlogCreatorLogoProps {
  size?: BlogCreatorLogoSize;
  iconOnly?: boolean;
  className?: string;
  priority?: boolean;
}

export default function BlogCreatorLogo({
  size = 'md',
  iconOnly = false,
  className,
  priority = false,
}: BlogCreatorLogoProps) {
  const src = iconOnly ? BRAND_ASSETS.favicon : BRAND_ASSETS.logoHeader;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- brand SVG assets
    <img
      src={src}
      alt="BlogCreator"
      width={iconOnly ? 180 : 600}
      height={iconOnly ? 180 : 140}
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
