/** Production domain and contact addresses for BlogCreator. */
export const SITE_DOMAIN = 'blogcreator.dev';

export const PRODUCTION_SITE_URL = `https://${SITE_DOMAIN}`;

export const SITE_EMAILS = {
  support: `support@${SITE_DOMAIN}`,
  legal: `legal@${SITE_DOMAIN}`,
  privacy: `privacy@${SITE_DOMAIN}`,
  newsletter: `newsletter@${SITE_DOMAIN}`,
} as const;
