import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import {
  marketingBrandIcon,
  marketingBrandIconSm,
  marketingFocusRing,
  marketingMutedLink,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface MarketingSubpageHeaderProps {
  badge: string;
  maxWidth?: '3xl' | '6xl';
}

export default function MarketingSubpageHeader({
  badge,
  maxWidth = '3xl',
}: MarketingSubpageHeaderProps) {
  const container = maxWidth === '6xl' ? 'max-w-6xl' : 'max-w-3xl';

  return (
    <header className="border-b border-white/[0.08] px-6 py-4">
      <div className={cn('mx-auto flex items-center justify-between', container)}>
        <Link
          href="/welcome"
          className={cn(
            'inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white rounded-md',
            marketingFocusRing
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
        <div className="flex items-center gap-2">
          <div className={cn(marketingBrandIconSm, marketingBrandIcon)}>
            <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden />
          </div>
          <span className="text-sm font-semibold text-white/80">{badge}</span>
        </div>
      </div>
    </header>
  );
}

export { MarketingSubpageFooter } from '@/components/marketing/MarketingFooter';
