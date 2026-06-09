'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AppLoader } from '@/components/loading/AppLoader';
import {
  marketingFocusRing,
  marketingPrimaryButtonBase,
  marketingPrimaryButtonSizes,
  marketingShimmer,
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
}: MarketingPrimaryButtonProps) {
  const reduced = useReducedMotion();
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={reduced || isDisabled ? undefined : { scale: 1.02 }}
      whileTap={reduced || isDisabled ? undefined : { scale: 0.98 }}
      className={cn(
        marketingPrimaryButtonBase,
        marketingPrimaryButtonSizes[size],
        fullWidth !== false && size === 'md' && 'w-full',
        marketingFocusRing,
        className
      )}
    >
      <span className={marketingShimmer} aria-hidden />
      <span className="relative flex items-center justify-center gap-2">
        {loading && <AppLoader decorative />}
        {loading && loadingText ? loadingText : children}
      </span>
    </motion.button>
  );
}
