'use client';

import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { cn } from '@/lib/utils';

interface AuthSubmitButtonProps {
  type?: 'submit' | 'button';
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function AuthSubmitButton({
  type = 'submit',
  disabled = false,
  loading = false,
  loadingText,
  children,
  onClick,
  className,
}: AuthSubmitButtonProps) {
  return (
    <MarketingPrimaryButton
      type={type}
      size="md"
      disabled={disabled}
      loading={loading}
      loadingText={loadingText}
      onClick={onClick}
      className={cn(className)}
      fullWidth
    >
      {children}
    </MarketingPrimaryButton>
  );
}
