export type WelcomeFaqItem = {
  question: string;
  answer: string;
  tag: string;
};

export const WELCOME_FAQ_ITEMS: WelcomeFaqItem[] = [
  {
    question: 'What is ContentCraft Inspector?',
    answer:
      'ContentCraft Inspector is an AI content platform that combines blog post generation, automatic keyword discovery, and deep SEO analysis in one workspace — so you can draft, optimize, and publish faster.',
    tag: 'Overview',
  },
  {
    question: 'What types of content can I generate?',
    answer:
      'Generate blog posts, articles, social captions, product descriptions, ad copy, and email drafts. Provide a topic or brief, set tone and keywords, and receive a ready-to-edit draft in seconds.',
    tag: 'Generation',
  },
  {
    question: 'How does automatic keyword discovery work?',
    answer:
      'Enter your topic and ContentCraft searches the web for related, high-intent keywords people are actively searching for. Those terms are woven naturally into your draft for better SEO without manual research.',
    tag: 'SEO',
  },
  {
    question: 'What does Deep Analysis include?',
    answer:
      'Deep Analysis scores readability, tone, and structure; surfaces key insights and improvements; and generates outlines and content-gap suggestions so you know exactly what to fix before publishing.',
    tag: 'Analysis',
  },
  {
    question: 'Is ContentCraft Inspector free to use?',
    answer:
      'Yes — you can sign up for a free plan with no credit card required. The free tier includes AI generation and core analysis features with monthly usage limits.',
    tag: 'Pricing',
  },
  {
    question: 'Who owns the content I create?',
    answer:
      'You own everything you generate or upload. ContentCraft Inspector does not claim rights over your work and does not use your content to train models.',
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
      'ContentCraft Inspector is built for the full content workflow — generation, keyword discovery, SEO scoring, outlines, and content-gap analysis in one tool. General chat assistants require you to assemble those steps manually.',
    tag: 'Comparison',
  },
  {
    question: 'Can I integrate ContentCraft into Cursor or my own project?',
    answer:
      'Yes. Install the ContentCraft MCP tool or agent skill via a single CLI command to generate and analyze content from Cursor, Claude Code, Antigravity, and other agents. You can also call our REST API (/api/ai-content, /api/analyze, /api/outline) from your own apps or pipelines. See the Integrations page for setup steps.',
    tag: 'Integrations',
  },
  {
    question: 'What is the ContentCraft MCP server?',
    answer:
      'The MCP (Model Context Protocol) server exposes ContentCraft tools — generate_content, analyze_content, and create_outline — to AI assistants like Cursor and Claude Desktop. Install it globally or per-project with one terminal command.',
    tag: 'Integrations',
  },
];

export const WELCOME_SEO_KEYWORDS = [
  'AI content generator',
  'SEO content analysis',
  'blog post generator',
  'keyword discovery tool',
  'content marketing AI',
  'readability checker',
  'content gap analysis',
  'AI writing assistant',
  'MCP content generation',
  'agent skill AI writing',
  'AI content API',
  'integrate content generation',
] as const;
