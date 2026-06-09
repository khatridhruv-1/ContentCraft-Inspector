'use client';

import { type ReactNode } from 'react';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';
import AuthFormPanel from '@/components/auth/AuthFormPanel';
import { GuestSessionGate } from '@/components/loading/SessionLoadingGate';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import { marketingBgClass, marketingPageClass } from '@/lib/marketing/marketingTheme';

interface LayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: LayoutProps) {
  useMarketingPageBackground({ lockScroll: true, includeHtml: true });

  return (
    <div
      className={`auth-page marketing-page fixed inset-0 flex h-dvh w-full overflow-hidden ${marketingBgClass} ${marketingPageClass}`}
      style={{ colorScheme: 'dark' }}
    >
      <a
        href="#auth-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to form
      </a>

      <div className="relative hidden h-full w-[42%] max-w-[540px] shrink-0 border-r border-white/[0.06] md:block">
        <AuthBrandPanel />
      </div>

      <div className="flex h-full min-w-0 flex-1 flex-col">
        <AuthFormPanel>
          <GuestSessionGate>{children}</GuestSessionGate>
        </AuthFormPanel>
      </div>
    </div>
  );
}
