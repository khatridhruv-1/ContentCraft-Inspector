export type SampleOutput = {
  id: string;
  platform: string;
  topic: string;
  keywords: string[];
  excerpt: string;
  body: string;
};

export const SAMPLE_OUTPUTS: SampleOutput[] = [
  {
    id: 'website-blog',
    platform: 'Personal website',
    topic: 'How to build a B2B SaaS content marketing strategy in 2026',
    keywords: [
      'content marketing strategy',
      'B2B SaaS content',
      'SEO blog writing',
      'keyword research',
    ],
    excerpt:
      'A practical framework for B2B SaaS teams — from search-intent mapping to publish-ready drafts without generic AI filler.',
    body: `## Start with search intent, not a blank page

Most B2B SaaS content fails for one reason: the team writes what they want to say, not what buyers are already searching for. Before you draft, map three clusters — problem-aware, solution-aware, and comparison queries. BlogCreator's keyword discovery surfaces live terms people use when researching tools like yours.

## Build a repeatable weekly rhythm

Pick one pillar topic per week. Generate a long-form website post, then repurpose a LinkedIn summary and a newsletter intro from the same brief. That single-source workflow cuts duplicate effort and keeps messaging consistent across channels.

## Measure what matters before you scale

Readability and SEO scores are useful guardrails, but the real signal is whether a draft answers the query in the first 200 words. Run a content-gap pass, fix thin sections, then publish. Iterate on titles and intros using search console data — not gut feel.

## What to do this week

1. List your top five buyer questions from sales calls.
2. Run keyword discovery on each question.
3. Publish one post that answers the highest-intent query with a specific example from your product category.

That is how small teams compete with bigger content budgets — specificity beats volume.`,
  },
  {
    id: 'linkedin-post',
    platform: 'LinkedIn',
    topic: 'Why platform-specific AI drafts beat generic chat output',
    keywords: ['AI content workflow', 'LinkedIn writing', 'B2B content'],
    excerpt:
      'A feed-native post on why destination-first generation beats dumping blog markdown into LinkedIn.',
    body: `Most "AI for LinkedIn" advice stops at: paste a prompt, get a paragraph, hit post.

That is why so many feed posts read like compressed blog intros — long setup, no hook, wall of text.

Here is what actually works:

→ Pick the destination first (LinkedIn, not "content")
→ Generate with platform structure baked in — hook, short blocks, professional tone
→ Layer keyword discovery before you edit, not after
→ Keep a human line: one specific example, one contrarian take

I have been testing a workflow that does all four in one tab. First post took less time than my old ChatGPT → Docs → copy-paste loop.

If you are still assembling SEO, drafting, and formatting across three tools, you are paying a hidden tax every week.

What is your biggest bottleneck — keywords, drafting, or formatting for the channel?

#contentmarketing #B2B #AIwriting`,
  },
];
