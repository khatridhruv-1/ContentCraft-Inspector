import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ContentCraftNavBrand from '@/components/brand/ContentCraftNavBrand';
import { marketingFocusRing, marketingMutedLink } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface MarketingSubpageHeaderProps {
  maxWidth?: '2xl' | '3xl' | '6xl';
}

export default function MarketingSubpageHeader({
  maxWidth = '3xl',
}: MarketingSubpageHeaderProps) {
  const container =
    maxWidth === '6xl' ? 'max-w-6xl' : maxWidth === '2xl' ? 'max-w-2xl' : 'max-w-3xl';

  return (
    <header className="border-b border-slate-200 bg-white/70 px-6 py-4 backdrop-blur-sm">
      <div className={cn('mx-auto flex items-center justify-between gap-4', container)}>
        <Link
          href="/welcome"
          className={cn(
            'inline-flex items-center gap-2 text-sm rounded-md',
            marketingMutedLink,
            marketingFocusRing
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to home
        </Link>
        <Link
          href="/welcome"
          className={cn('shrink-0 transition-opacity hover:opacity-90', marketingFocusRing)}
          aria-label="ContentCraft Inspector home"
        >
          <ContentCraftNavBrand />
        </Link>
      </div>
    </header>
  );
}

export { MarketingSubpageFooter } from '@/components/marketing/MarketingFooter';
