import { BRAND_LOGO } from '@/lib/brand/logoColors';
import { cn } from '@/lib/utils';

type BlogCreatorLogoMarkProps = {
  className?: string;
};

/**
 * Solid app mark — teal tile, white page + clean rise stroke.
 * No kinked paths; fills the viewBox so it never looks broken small.
 */
export default function BlogCreatorLogoMark({ className }: BlogCreatorLogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block shrink-0', className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill={BRAND_LOGO.teal} />
      {/* Page */}
      <rect x="9" y="7" width="14" height="18" rx="2.5" fill="white" />
      {/* Draft lines */}
      <path
        d="M12 11.5h8"
        stroke={BRAND_LOGO.teal}
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 14.5h6"
        stroke={BRAND_LOGO.teal}
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Continuous rise — one smooth curve */}
      <path
        d="M12.5 21C14.5 17.5 18 13.5 22 10"
        stroke={BRAND_LOGO.tealBright}
        strokeWidth="2.25"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="12.5" cy="21" r="1.5" fill={BRAND_LOGO.ink} />
    </svg>
  );
}
