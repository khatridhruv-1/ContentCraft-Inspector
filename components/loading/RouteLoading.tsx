'use client';

import PageLoadingScreen from '@/components/loading/PageLoadingScreen';

/** App Router `loading.tsx` default — explicit client boundary for webpack. */
export default function RouteLoading() {
  return <PageLoadingScreen label="Loading page" />;
}
