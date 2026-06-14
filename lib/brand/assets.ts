/** ContentCraft brand assets under /public/brand */
export const BRAND_ASSETS = {
  /** Static wordmark — always visible in nav/footer */
  logoHeader: '/brand/contentcraft-logo-header-static.svg',
  logoHeaderDark: '/brand/contentcraft-logo-header-dark-static.svg',
  /** Text-only — pairs with favicon in compact nav */
  logoWordmark: '/brand/contentcraft-logo-wordmark-static.svg',
  logoWordmarkDark: '/brand/contentcraft-logo-wordmark-dark-static.svg',
  /** Animated wordmark — hero / marketing moments */
  logoHeaderAnimated: '/brand/contentcraft-logo-header.svg',
  logoHeaderDarkAnimated: '/brand/contentcraft-logo-header-dark.svg',
  favicon: '/brand/contentcraft-favicon.svg',
} as const;

export type BrandLogoVariant = 'light' | 'dark';
