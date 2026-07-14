import { Suspense } from 'react';
import CookieConsent from '@/components/marketing/CookieConsent';

export default function RootCookieConsent() {
  return (
    <Suspense fallback={null}>
      <CookieConsent />
    </Suspense>
  );
}
