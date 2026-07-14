export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  keywords: string[];
  body: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'platform-first-ai-content',
    title: 'Why platform-first AI beats generic chat for content teams',
    excerpt:
      'Destination-first generation changes the economics of weekly publishing — here is what practitioners are doing differently.',
    date: 'July 8, 2026',
    readMinutes: 6,
    keywords: ['AI content workflow', 'platform-specific writing', 'content marketing'],
    body: `Most teams still treat AI as a blank-page typing assistant. The better frame: pick where the piece will live first, then generate structure, tone, and length for that channel.

LinkedIn is not a compressed blog post. Quora is not a landing page in disguise. Medium essays need a narrative arc that feed posts do not.

When generation starts with platform intent, editors spend time on ideas — not reformatting.

**What to try this week:** Take one pillar topic. Generate website, LinkedIn, and newsletter versions from the same brief. Compare edit time versus your old ChatGPT → Docs loop.`,
  },
  {
    slug: 'keyword-discovery-before-editing',
    title: 'Keyword discovery belongs before your first edit, not after',
    excerpt:
      'Live search-intent signals should shape the draft — not get bolted on in a second pass.',
    date: 'July 3, 2026',
    readMinutes: 5,
    keywords: ['keyword research', 'SEO writing', 'content strategy'],
    body: `The hidden tax in most AI workflows is the "SEO pass" — a second round where someone tries to weave keywords into prose that was never built for search intent.

Practitioners getting better results run keyword discovery on the brief before generation. High-intent terms land in headings and intros naturally because the outline was shaped around them.

**Practical rhythm:** Map one buyer question from sales calls → run discovery → generate → gap analysis → publish. One loop, one tab.`,
  },
  {
    slug: 'mcp-content-generation-for-developers',
    title: 'MCP content tools: generate and analyze without local API keys',
    excerpt:
      'How developer teams wire BlogCreator into Cursor and other agents with one install command.',
    date: 'June 28, 2026',
    readMinutes: 4,
    keywords: ['MCP', 'AI agents', 'developer workflow'],
    body: `Agent-native content workflows should not require pasting API keys into five config files.

Hosted MCP tools let agents call generate, analyze, and outline against your production API — authenticated through the install script, not scattered secrets on disk.

**Start here:** Run the one-line install on /integrate, verify with a test prompt in your agent, and keep draft history in the web workspace for human review.`,
  },
  {
    slug: 'readability-scores-that-matter',
    title: 'Readability scores are guardrails, not goals',
    excerpt:
      'When SEO metrics help — and when they distract from answering the query in the first 200 words.',
    date: 'June 20, 2026',
    readMinutes: 5,
    keywords: ['readability', 'SEO analysis', 'content quality'],
    body: `Teams sometimes optimize for green readability badges while the draft still fails the only test that matters: does it answer the search query immediately?

Use scores to catch wall-of-text problems and thin sections. Do not use them to sand down voice until the piece sounds like everyone else in the SERP.

Pair readability with content-gap analysis — fix missing subtopics before you tweak sentence length.`,
  },
  {
    slug: 'newsletter-workflow-without-generic-ai',
    title: 'A newsletter workflow that does not sound like a robot wrote it',
    excerpt:
      'Three editorial checks before you hit send on AI-assisted newsletter drafts.',
    date: 'June 12, 2026',
    readMinutes: 4,
    keywords: ['newsletter writing', 'Substack', 'editorial workflow'],
    body: `Substack readers scan on mobile. Short blocks. One idea per paragraph. A first line that could only come from your experience.

Generate with newsletter structure baked in, then add one specific detail — a client story, a number, a contrarian line — that search snippets cannot fake.

Subscribe to BlogCreator Daily for weekly practitioner notes on what is actually working in AI-assisted publishing.`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}
