import Link from 'next/link';
import ContentCraftLogo from '@/components/brand/ContentCraftLogo';
import { marketingMutedLink } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export const FOOTER_NAV_LINKS = [
  { label: 'Help Center', href: '/help' },
  { label: 'Integrations', href: '/integrate' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
  { label: 'Sitemap', href: '/sitemap.xml' },
] as const;

export type FooterNavLink = { label: string; href: string };

interface MarketingFooterProps {
  className?: string;
  containerClassName?: string;
  extraLinks?: FooterNavLink[];
  /** Wordmark for dark footer backgrounds */
  logoVariant?: 'light' | 'dark';
}

export default function MarketingFooter({
  className,
  containerClassName = 'mx-auto w-full max-w-6xl px-6',
  extraLinks = [],
  logoVariant = 'light',
}: MarketingFooterProps) {
  const links: FooterNavLink[] = [...extraLinks, ...FOOTER_NAV_LINKS];

  return (
    <footer className={cn('border-t border-slate-200 bg-white/50 py-10', className)}>
      <div className={containerClassName}>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/welcome"
            className="transition-opacity hover:opacity-90"
            aria-label="ContentCraft Inspector home"
          >
            <ContentCraftLogo
              variant={logoVariant}
              size="lg"
              className="h-11 w-auto sm:h-12 md:h-14"
            />
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

        <div className="mt-6 h-px w-full bg-slate-200" aria-hidden />

        <p className="mt-4 text-center text-xs text-slate-400">
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
