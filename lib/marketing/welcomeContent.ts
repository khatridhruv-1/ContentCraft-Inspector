export type WelcomeFaqItem = {
  question: string;
  answer: string;
  tag: string;
};

export const WELCOME_FAQ_ITEMS: WelcomeFaqItem[] = [
  {
    question: 'What is BlogCreator?',
    answer:
      'BlogCreator is an AI content platform that combines platform-based generation, automatic keyword discovery, and deep SEO analysis in one workspace — so you can draft, optimize, and publish faster.',
    tag: 'Overview',
  },
  {
    question: 'Can I generate content for different platforms?',
    answer:
      'Yes. Choose a platform before you generate — Personal website, LinkedIn, Quora, Medium, or Substack. BlogCreator adapts structure, length, and voice to match where you publish, then discovers keywords for your topic.',
    tag: 'Generation',
  },
  {
    question: 'How does automatic keyword discovery work?',
    answer:
      'Enter your topic and BlogCreator searches the web for related, high-intent keywords people are actively searching for. Those terms are woven naturally into your draft for better SEO without manual research.',
    tag: 'SEO',
  },
  {
    question: 'What does Deep Analysis include?',
    answer:
      'Deep Analysis scores readability, tone, and structure; surfaces key insights and improvements; and generates outlines and content-gap suggestions so you know exactly what to fix before publishing.',
    tag: 'Analysis',
  },
  {
    question: 'Is BlogCreator free to use?',
    answer:
      'Yes — BlogCreator is currently free for everyone. Sign up to access AI generation, keyword discovery, and core analysis features. No paid tier is required to start.',
    tag: 'Pricing',
  },
  {
    question: 'Who owns the content I create?',
    answer:
      'You own everything you generate or upload. BlogCreator does not claim rights over your work and does not use your content to train models.',
    tag: 'Ownership',
  },
  {
    question: 'Is my content private and secure?',
    answer:
      'Your drafts and projects are private to your account. Data is encrypted in transit and at rest, and we do not sell or share your content with third parties.',
    tag: 'Security',
  },
  {
    question: 'How is this different from ChatGPT?',
    answer:
      'BlogCreator is built for the full content workflow — platform-specific generation, keyword discovery, SEO scoring, outlines, and content-gap analysis in one tool. General chat assistants require you to assemble those steps manually.',
    tag: 'Comparison',
  },
  {
    question: 'Can I use BlogCreator inside Cursor, Claude, or other AI agents?',
    answer:
      'Yes. Install the MCP tool or agent skill with one Terminal command — it connects to our hosted API so your agent can generate content, run analysis, and build outlines without local API keys. See the Integrations section on this page or visit /integrate for the full setup guide.',
    tag: 'Integrations',
  },
  {
    question: 'What is the BlogCreator MCP server?',
    answer:
      'The MCP (Model Context Protocol) server exposes generate_content, analyze_content, and create_outline to any MCP-capable agent. Run the install script in Terminal, restart your agent, then ask it to use BlogCreator tools.',
    tag: 'Integrations',
  },
];

/** Memberstack-style hero doodle (SVG includes chevrons + handwritten label). */
export const HERO_CTA_DOODLE_SRC = '/marketing/hero-cta-doodle.svg';

export { LANDING_KEYWORDS as WELCOME_SEO_KEYWORDS } from '@/lib/marketing/landingSeo';
