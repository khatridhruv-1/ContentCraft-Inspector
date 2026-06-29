import { CONTENT_PLATFORM_OPTIONS, type ContentPlatformId } from '@/types/contentPlatform';

export type LandingPlatform = {
  id: ContentPlatformId;
  label: string;
  description: string;
};

/** Marketing copy aligned with studio platform picker + generation prompts. */
export const LANDING_PLATFORMS: LandingPlatform[] = [
  {
    id: 'website',
    label: 'Personal website',
    description:
      'SEO-ready blog posts with clear headings, natural keyword weaving, and a publish-ready structure for your site.',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description:
      'Long-form feed posts with a strong hook, short paragraphs, and a professional voice — formatted for LinkedIn, not generic blog markdown.',
  },
  {
    id: 'quora',
    label: 'Quora',
    description:
      'Direct, credible answers that lead with the point, explain the why, and read like a practitioner — not a padded article.',
  },
  {
    id: 'medium',
    label: 'Medium',
    description:
      'Thoughtful essays with a narrative opening, specific section headings, and flowing prose tuned for Medium readers.',
  },
  {
    id: 'substack',
    label: 'Substack',
    description:
      'Newsletter-style essays with a clear subject line, intimate tone, and structured sections built for email subscribers.',
  },
];

export const LANDING_PLATFORM_LABELS = CONTENT_PLATFORM_OPTIONS.map(option => option.label).join(
  ', '
);
