'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { marketingFocusRing, marketingGhostNav } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const SECTION_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#platforms', label: 'Platforms' },
  { href: '#integrations', label: 'Integrations' },
  { href: '#newsletter', label: 'Newsletter' },
  { href: '#faq', label: 'FAQ' },
] as const;

const PAGE_LINKS = [
  { href: '/samples', label: 'Samples' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/help', label: 'Help Center' },
] as const;

export default function LandingMobileNav() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isMobile) {
    return null;
  }

  const closeAndNavigate = (href: string) => {
    setOpen(false);
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="shrink-0">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-lg',
              marketingGhostNav,
              marketingFocusRing
            )}
            aria-label="Open section menu"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[min(100vw-2rem,20rem)]">
          <SheetHeader>
            <SheetTitle className="text-left text-base">Explore BlogCreator</SheetTitle>
          </SheetHeader>

          <nav className="mt-6 flex flex-col gap-1" aria-label="Section links">
            {SECTION_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  closeAndNavigate(link.href);
                }}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100',
                  marketingFocusRing
                )}
              >
                {link.label}
              </a>
            ))}
            {PAGE_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100',
                  marketingFocusRing
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-6">
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100',
                marketingFocusRing
              )}
            >
              Sign in
            </Link>
            <MarketingPrimaryButton
              type="button"
              size="sm"
              onClick={() => {
                setOpen(false);
                router.push('/auth/signup');
              }}
            >
              Get started
            </MarketingPrimaryButton>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
