import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BlogCreatorNavBrand from '@/components/brand/BlogCreatorNavBrand';
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
    <header className="border-b border-slate-200 bg-white/70 px-4 py-4 backdrop-blur-sm sm:px-6">
      <div className={cn('mx-auto flex min-w-0 items-center justify-between gap-2 sm:gap-4', container)}>
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
