import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import {
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingPageClass,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';

export const metadata: Metadata = {
  title: 'Page not found — BlogCreator',
  description: 'The page you are looking for does not exist on BlogCreator.',
};

export default function NotFound() {
  return (
    <div
      className={`marketing-page min-h-screen ${marketingPageClass}`}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-violet-600">404</p>
        <h1 className={`${marketingSectionTitle} mt-2 text-balance`}>
          Page not <span className={marketingAccentSpan}>found</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-slate-600">
          The page you are looking for does not exist or may have moved.
        </p>
        <nav className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link href="/" className="text-violet-700 underline-offset-4 hover:underline">
            Home
          </Link>
          <Link href="/samples" className="text-violet-700 underline-offset-4 hover:underline">
            Samples
          </Link>
          <Link href="/pricing" className="text-violet-700 underline-offset-4 hover:underline">
            Pricing
          </Link>
          <Link href="/blog" className="text-violet-700 underline-offset-4 hover:underline">
            Blog
          </Link>
          <Link href="/integrate" className="text-violet-700 underline-offset-4 hover:underline">
            Integrations
          </Link>
          <Link href="/help" className="text-violet-700 underline-offset-4 hover:underline">
            Help Center
          </Link>
          <Link href="/contact" className="text-violet-700 underline-offset-4 hover:underline">
            Contact
          </Link>
        </nav>
      </main>

      <MarketingFooter />
    </div>
  );
}
