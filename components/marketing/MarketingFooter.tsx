import Link from 'next/link';
import BlogCreatorLogo from '@/components/brand/BlogCreatorLogo';
import { marketingMutedLink } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

export const FOOTER_NAV_LINKS = [
  { label: 'Samples', href: '/samples' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Newsletter', href: '/#newsletter' },
  { label: 'Help Center', href: '/help' },
  { label: 'Integrations', href: '/integrate' },
  { label: 'Status', href: '/status' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
] as const;

export type FooterNavLink = { label: string; href: string };

interface MarketingFooterProps {
  className?: string;
  containerClassName?: string;
  extraLinks?: FooterNavLink[];
}

export default function MarketingFooter({
  className,
  containerClassName = 'mx-auto w-full max-w-6xl px-4 sm:px-6',
  extraLinks = [],
}: MarketingFooterProps) {
  const links: FooterNavLink[] = [...extraLinks, ...FOOTER_NAV_LINKS];

  return (
    <footer className={cn('border-t border-slate-200 bg-white/50 py-10', className)}>
      <div className={containerClassName}>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="max-w-[11rem] self-center transition-opacity hover:opacity-90 sm:max-w-none sm:self-auto"
            aria-label="BlogCreator home"
          >
            <BlogCreatorLogo
              size="lg"
              className="h-11 sm:h-12 md:h-14"
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
          © {new Date().getFullYear()} BlogCreator
        </p>
      </div>
    </footer>
  );
}
