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
      'A practical framework for B2B SaaS teams — from search-intent mapping to publish-ready drafts without generic filler.',
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
    topic: 'Why platform-specific drafts beat generic chat output',
    keywords: ['humanized content', 'LinkedIn writing', 'B2B content'],
    excerpt:
      'A feed-native post on why destination-first drafting beats dumping blog markdown into LinkedIn.',
    body: `Most LinkedIn writing advice stops at: paste a prompt, get a paragraph, hit post.

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
  {
    id: 'quora-answer',
    platform: 'Quora',
    topic: 'What is the best way to repurpose blog content for Quora without sounding promotional?',
    keywords: ['content repurposing', 'Quora marketing', 'B2B thought leadership'],
    excerpt:
      'A direct Quora-style answer with practical steps — credibility-first, not a disguised sales pitch.',
    body: `The best repurposing is not copy-paste. Quora readers punish anything that reads like a landing page in answer clothing.

Here is a workflow that works:

Start with one strong insight from your blog post — not the whole article. Quora rewards a single clear takeaway backed by experience.

Rewrite in first person. "We tried X and saw Y" beats "Companies should consider X."

Answer the exact question in the first two sentences. Context can come after.

Add one specific example — a number, a timeframe, a mistake you made.

Only mention your product if it is directly relevant to the question. One neutral line max.

I have been using platform-specific generation so the tone stays conversational and the structure matches Q&A — not a chopped blog intro.

If your answer could appear unchanged on your company blog, it is not ready for Quora yet.`,
  },
  {
    id: 'medium-article',
    platform: 'Medium',
    topic: 'The hidden cost of generic content workflows',
    keywords: ['writing workflow', 'content quality', 'editorial process'],
    excerpt:
      'A Medium-length essay with narrative hook — opinionated, readable, and publication-ready.',
    body: `## You are not slow. Your stack is.

Every week I talk to creators who blame themselves for how long content takes. They are not slow. They are running five tools that were never designed to work together.

A chat box for drafting. A keyword spreadsheet. Hemingway for readability. Google Docs for collaboration. Canva for social crops. Each handoff adds friction — and each tool optimizes for its own output, not for where the piece will actually live.

## Generic output has a format problem

Generic tools write "content." They do not write a LinkedIn post, a Quora answer, or a Medium essay. The structure is wrong, the hook is wrong, and you spend the next hour reformatting instead of improving ideas.

Destination-first drafting changes the economics. When the platform is chosen before the first line, you edit for quality — not for layout.

## What a sane weekly rhythm looks like

Monday: pick one pillar topic from search intent, not brainstorm roulette.

Tuesday: draft the long-form piece with keywords woven in.

Wednesday: repurpose two platform-native versions from the same brief.

Thursday: run analysis — readability, gaps, thin sections.

Friday: publish one, queue one, learn from metrics.

That is four outputs from one strategic input. Most teams still treat each channel as a separate project.

## The real bottleneck is assembly, not intelligence

Models are good enough. The gap is workflow — one workspace where drafting, keywords, analysis, and export share the same draft history.

If you are still copying between tabs, you are paying a tax every week that no prompt engineering will fix.`,
  },
  {
    id: 'substack-newsletter',
    platform: 'Substack',
    topic: 'Three editorial checks before you hit publish on humanized drafts',
    keywords: ['newsletter writing', 'editorial process', 'Substack growth'],
    excerpt:
      'A newsletter intro with personal voice — short paragraphs, one clear promise, subscriber-friendly tone.',
    body: `Most newsletters fail for boring reasons. Not because the draft is bad — because nobody edited for *your* voice before send.

Here are three checks I run on every draft:

**1. The first line test**
If the opening could belong to any newsletter in your niche, rewrite it. One specific detail — a client story, a number, a contrarian take — is worth more than a polished generic hook.

**2. The "so what" scan**
Read only the subheads. Do they promise a outcome the reader cares about this week? If not, the body will not save you.

**3. The platform skim**
Substack readers scan on mobile. Short paragraphs. One idea per block. No blog-style section walls.

I draft platform-native structure first, then layer keyword discovery, then edit for voice last. That order matters — editing tone into a badly structured draft is twice the work.

If you are publishing without a human pass, your subscribers can tell. They might not unsubscribe. They will just stop opening.

What is your non-negotiable edit before publish?`,
  },
];
