'use client';

import { AppLoader } from '@/components/loading/AppLoader';
import {
  marketingFocusRing,
  marketingPrimaryButtonCore,
  marketingPrimaryButtonSizes,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

type MarketingPrimaryButtonSize = keyof typeof marketingPrimaryButtonSizes;

interface MarketingPrimaryButtonProps {
  type?: 'submit' | 'button';
  size?: MarketingPrimaryButtonSize;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
  'aria-label'?: string;
}

export default function MarketingPrimaryButton({
  type = 'submit',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText,
  children,
  onClick,
  className,
  fullWidth,
  'aria-label': ariaLabel,
}: MarketingPrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={cn(
        marketingPrimaryButtonCore,
        marketingPrimaryButtonSizes[size],
        fullWidth === false && size === 'md' && 'w-auto',
        'group',
        marketingFocusRing,
        className
      )}
    >
      {loading && <AppLoader decorative />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
