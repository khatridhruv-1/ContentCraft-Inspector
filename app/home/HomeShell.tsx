'use client';

import { type ReactNode } from 'react';
import { useMarketingPageBackground } from '@/hooks/useMarketingPageBackground';
import {
  MARKETING_PAGE_GRADIENT,
  marketingBgClass,
  marketingPageClass,
} from '@/lib/marketing/marketingTheme';

export default function HomeShell({ children }: { children: ReactNode }) {
  useMarketingPageBackground({ includeHtml: true });

  return (
    <div
      className={`home-page marketing-page fixed inset-0 flex flex-col overflow-y-auto ${marketingBgClass} ${marketingPageClass}`}
      style={{
        colorScheme: 'dark',
        background: MARKETING_PAGE_GRADIENT,
      }}
    >
      {children}
    </div>
  );
}
