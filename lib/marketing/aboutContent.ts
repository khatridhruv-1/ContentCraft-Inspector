export type AboutTeamMember = {
  name: string;
  role: string;
  bio: string;
  initials: string;
};

export const ABOUT_ORIGIN = {
  headline: 'Why we built BlogCreator',
  body: `Generic chat tools dump the same structure into every channel — and it usually sounds
machine-written. We built BlogCreator so practitioners pick the destination first — website,
LinkedIn, Quora, Medium, or Substack — then draft with live keyword signals and SEO scoring in
one workspace. The goal is humanized content that fits where it will live.`,
} as const;

export const ABOUT_FOUNDERS: AboutTeamMember[] = [
  {
    name: 'Dhruv K.',
    role: 'Founder & product',
    bio: 'Built BlogCreator after years of shipping B2B content workflows — tired of copying between ChatGPT, keyword tools, and readability checkers.',
    initials: 'DK',
  },
];

export const ABOUT_PROOF_POINTS = [
  '4 posts in her first week — customer story',
  'MCP install in one Terminal command',
  'Platform-native LinkedIn structure, not blog dumps',
] as const;
