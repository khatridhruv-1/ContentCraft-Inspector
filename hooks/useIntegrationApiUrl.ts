'use client';

import { useEffect, useState } from 'react';
import { getSiteUrl } from '@/lib/marketing/siteUrl';

/** API origin for install commands — uses the page the user is on after hydration. */
export function useIntegrationApiUrl() {
  const [apiUrl, setApiUrl] = useState(getSiteUrl);

  useEffect(() => {
    setApiUrl(window.location.origin);
  }, []);

  return apiUrl;
}
