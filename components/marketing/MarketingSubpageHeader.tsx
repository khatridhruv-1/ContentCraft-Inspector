import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BlogCreatorNavBrand from '@/components/brand/BlogCreatorNavBrand';
import {
  marketingFocusRing,
  marketingMutedLink,
  marketingPageContainer,
  marketingPageContainerNarrow,
  marketingPageContainerTight,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface MarketingSubpageHeaderProps {
  maxWidth?: '2xl' | '3xl' | '6xl';
}

const HEADER_CONTAINER = {
  '2xl': marketingPageContainerTight,
  '3xl': marketingPageContainerNarrow,
  '6xl': marketingPageContainer,
} as const;

export default function MarketingSubpageHeader({
  maxWidth = '3xl',
}: MarketingSubpageHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/70 py-4 backdrop-blur-sm">
      <div
        className={cn(
          'flex min-w-0 items-center justify-between gap-2 sm:gap-4',
          HEADER_CONTAINER[maxWidth]
        )}
      >
        <Link
          href="/"
          className={cn(
            'inline-flex min-w-0 shrink items-center gap-2 text-sm rounded-md',
            marketingMutedLink,
            marketingFocusRing
          )}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate max-[359px]:sr-only">Back to home</span>
        </Link>
        <Link
          href="/"
          className={cn('shrink-0 transition-opacity hover:opacity-90', marketingFocusRing)}
          aria-label="BlogCreator home"
        >
          <BlogCreatorNavBrand />
        </Link>
      </div>
    </header>
  );
}
