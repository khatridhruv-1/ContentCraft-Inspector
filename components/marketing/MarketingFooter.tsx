import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import {
  marketingBrandIcon,
  marketingBrandIconSm,
  marketingMutedLink,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export const FOOTER_NAV_LINKS = [
  { label: 'Help Center', href: '/help' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
] as const;

export type FooterNavLink = { label: string; href: string };

interface MarketingFooterProps {
  className?: string;
  /** Inner container classes — defaults to centered max-w-6xl */
  containerClassName?: string;
  /** Extra links before standard nav (e.g. Features on welcome) */
  extraLinks?: FooterNavLink[];
}

export default function MarketingFooter({
  className,
  containerClassName = 'mx-auto w-full max-w-6xl px-6',
  extraLinks = [],
}: MarketingFooterProps) {
  const links: FooterNavLink[] = [...extraLinks, ...FOOTER_NAV_LINKS];

  return (
    <footer className={cn('border-t border-white/[0.06] py-10', className)}>
      <div className={containerClassName}>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/welcome"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label="ContentCraft Inspector home"
          >
            <div className={cn(marketingBrandIconSm, marketingBrandIcon)}>
              <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden />
            </div>
            <span className="text-sm font-semibold text-white/75">ContentCraft Inspector</span>
          </Link>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end"
          >
            {links.map(({ label, href }) => (
              <Link key={`${href}-${label}`} href={href} className={cn('text-sm', marketingMutedLink)}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 h-px w-full bg-white/[0.06]" aria-hidden />

        <p className="mt-4 text-center text-xs text-white/40">
          © {new Date().getFullYear()} ContentCraft Inspector
        </p>
      </div>
    </footer>
  );
}

/** @deprecated Use MarketingFooter */
export function MarketingSubpageFooter(props: Omit<MarketingFooterProps, 'extraLinks'>) {
  return <MarketingFooter {...props} />;
}
