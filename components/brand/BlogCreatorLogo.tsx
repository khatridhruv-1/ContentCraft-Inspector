import BlogCreatorLogoMark from '@/components/brand/BlogCreatorLogoMark';
import { cn } from '@/lib/utils';

const ICON_SIZE = {
  xs: 'h-6 w-6',
  sm: 'h-7 w-7',
  md: 'h-8 w-8',
  lg: 'h-9 w-9',
  xl: 'h-11 w-11',
} as const;

const WORDMARK_SIZE = {
  xs: 'text-[15px]',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
} as const;

export type BlogCreatorLogoSize = keyof typeof ICON_SIZE;

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
}: BlogCreatorLogoProps) {
  if (iconOnly) {
    return <BlogCreatorLogoMark className={cn(ICON_SIZE[size], className)} />;
  }

  return (
    <span
      className={cn('inline-flex min-w-0 items-center gap-2.5', className)}
      aria-label="BlogCreator"
    >
      <BlogCreatorLogoMark className={ICON_SIZE[size]} />
      <span
        className={cn(
          'select-none font-semibold leading-none tracking-[-0.025em]',
          WORDMARK_SIZE[size]
        )}
      >
        <span className="text-slate-900">Blog</span>
        <span className="text-teal-800">Creator</span>
      </span>
    </span>
  );
}
