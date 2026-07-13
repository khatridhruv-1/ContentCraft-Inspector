import BlogCreatorLogo from '@/components/brand/BlogCreatorLogo';
import { BRAND_ASSETS } from '@/lib/brand/assets';
import { cn } from '@/lib/utils';

interface BlogCreatorNavBrandProps {
  className?: string;
  priority?: boolean;
}

/** Nav/header lockup — icon + readable wordmark */
export default function BlogCreatorNavBrand({
  className,
  priority = false,
}: BlogCreatorNavBrandProps) {
  return (
    <span className={cn('inline-flex min-w-0 items-end gap-2 pb-0.5 sm:gap-2.5', className)}>
      <BlogCreatorLogo
        iconOnly
        className="!h-10 !w-10 shrink-0 sm:!h-11 sm:!w-11"
        priority={priority}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_ASSETS.logoWordmark}
        alt=""
        aria-hidden
        width={420}
        height={72}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        className="hidden h-8 w-auto max-w-[9rem] shrink min-w-0 object-contain sm:block sm:max-w-none sm:h-9 md:h-10"
        draggable={false}
      />
    </span>
  );
}
