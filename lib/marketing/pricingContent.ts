export const PRICING_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to draft, analyze, and publish — no credit card.',
    features: [
      'Humanized drafts for 5 platforms',
      'Unlimited generations',
      'Automatic keyword discovery',
      'Deep SEO & readability analysis',
      'Export to Word and Markdown',
      'MCP, agent skill, and REST API access',
      'BlogCreator Daily newsletter',
    ],
    cta: 'Get started free',
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Coming soon',
    period: '',
    description: 'Higher limits, team features, and priority support for growing teams.',
    features: [
      'Higher generation limits',
      'Team workspaces',
      'Shared brand voice presets',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'Join the waitlist',
    highlighted: false,
    waitlist: true,
  },
] as const;

export const PRICING_FAQ = [
  {
    question: 'Is BlogCreator really free?',
    answer:
      'Yes. The Free plan includes generation, keyword discovery, core analysis, and integrations. Unlimited generations — no credit card required.',
  },
  {
    question: 'Will the free plan change?',
    answer:
      'We plan to introduce a Pro tier for teams and higher limits. Free users will keep core access — we will announce changes before anything ships.',
  },
  {
    question: 'What happens when Pro launches?',
    answer:
      'Existing free accounts stay on Free. Pro adds team features and higher limits for users who need them.',
  },
] as const;
