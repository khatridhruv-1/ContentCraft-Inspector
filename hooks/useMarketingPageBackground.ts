'use client';

import { useEffect } from 'react';
import { MARKETING_BG } from '@/lib/marketing/marketingTheme';
import { acquireScrollLock } from '@/lib/loading/scrollLock';

type MarketingBackgroundOptions = {
  /** Lock html/body scroll (auth layout) */
  lockScroll?: boolean;
  /** Apply to html element as well as body */
  includeHtml?: boolean;
};

export function useMarketingPageBackground({
  lockScroll = false,
  includeHtml = false,
}: MarketingBackgroundOptions = {}) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlBg = html.style.background;
    const prevHtmlBgColor = html.style.backgroundColor;
    const prevBodyBg = body.style.background;
    const prevBodyBgColor = body.style.backgroundColor;

    if (includeHtml) {
      html.style.background = MARKETING_BG;
      html.style.backgroundColor = MARKETING_BG;
    }

    body.style.background = MARKETING_BG;
    body.style.backgroundColor = MARKETING_BG;

    const releaseScroll = lockScroll ? acquireScrollLock({ includeHtml }) : undefined;

    return () => {
      releaseScroll?.();
      if (includeHtml) {
        html.style.background = prevHtmlBg;
        html.style.backgroundColor = prevHtmlBgColor;
      }
      body.style.background = prevBodyBg;
      body.style.backgroundColor = prevBodyBgColor;
    };
  }, [lockScroll, includeHtml]);
}
