'use client';

import { useEffect } from 'react';
import { MARKETING_BG } from '@/lib/marketing/marketingTheme';

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
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyBg = body.style.background;
    const prevBodyBgColor = body.style.backgroundColor;
    const prevBodyOverflow = body.style.overflow;

    if (includeHtml) {
      html.style.background = MARKETING_BG;
      html.style.backgroundColor = MARKETING_BG;
      if (lockScroll) html.style.overflow = 'hidden';
    }

    body.style.background = MARKETING_BG;
    body.style.backgroundColor = MARKETING_BG;
    if (lockScroll) body.style.overflow = 'hidden';

    return () => {
      if (includeHtml) {
        html.style.background = prevHtmlBg;
        html.style.backgroundColor = prevHtmlBgColor;
        html.style.overflow = prevHtmlOverflow;
      }
      body.style.background = prevBodyBg;
      body.style.backgroundColor = prevBodyBgColor;
      body.style.overflow = prevBodyOverflow;
    };
  }, [lockScroll, includeHtml]);
}
