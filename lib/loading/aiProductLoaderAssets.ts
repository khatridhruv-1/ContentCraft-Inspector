/** Dribbble #6298759 — paths under /public/loading */
export const AI_PRODUCT_LOADER_ASSETS = {
  mp4: '/loading/ai-product-loader.mp4',
  webm: '/loading/ai-product-loader.webm',
  poster: '/loading/ai-product-loader-poster.png',
} as const;

/** Primary preload target (smallest, broad support) */
export const AI_PRODUCT_LOADER_PRELOAD = AI_PRODUCT_LOADER_ASSETS.mp4;
