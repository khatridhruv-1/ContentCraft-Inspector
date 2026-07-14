export const NEWSLETTER_SAMPLE_ISSUES = [
  {
    id: 'july-12-2026',
    date: 'July 12, 2026',
    topic: 'How small teams are using AI content workflows without sounding generic',
    keywords: [
      'AI content workflow',
      'content marketing automation',
      'humanized AI writing',
      'SEO content strategy',
    ],
    intro:
      'Search interest in “AI content workflow” keeps climbing — but most teams still struggle with one thing: output that reads like a person wrote it. Here is a practitioner take on what is actually working this week.',
    sections: [
      {
        heading: 'Start with platform intent, not a blank prompt',
        body:
          'The teams seeing the best results pick a destination first — website, LinkedIn, newsletter — then generate. Platform-aware structure beats dumping everything into a generic chat thread and hoping the tone lands.',
      },
      {
        heading: 'Layer keyword discovery before you edit',
        body:
          'Live keyword signals still matter for discoverability. Weave high-intent terms into drafts during generation, then run a readability and gap pass so the final piece does not feel stuffed.',
      },
      {
        heading: 'Keep a human editor in the loop',
        body:
          'AI drafts are a starting point. The best published work adds a specific example, a contrarian line, or a first-person observation — the parts search snippets cannot fake.',
      },
    ],
    closing:
      'That is the rhythm BlogCreator Daily tracks: what people are searching for, framed for practitioners who publish every week.',
  },
  {
    id: 'july-5-2026',
    date: 'July 5, 2026',
    topic: 'Keyword clusters beat keyword stuffing every time',
    keywords: ['keyword research', 'SEO clusters', 'content strategy'],
    intro:
      'Readers still reward pages that answer one intent completely — not pages that mention twelve terms once.',
    sections: [
      {
        heading: 'Group queries by intent',
        body:
          'Problem-aware, solution-aware, and comparison queries deserve different outlines. Discovery tools help you see which cluster a brief belongs to before you draft.',
      },
      {
        heading: 'One pillar, many formats',
        body:
          'Teams moving faster repurpose one research pass into website, LinkedIn, and newsletter formats — each native to its channel.',
      },
    ],
    closing: 'Specificity beats volume when you are competing with bigger content budgets.',
  },
  {
    id: 'june-28-2026',
    date: 'June 28, 2026',
    topic: 'MCP installs are changing how devs delegate drafting',
    keywords: ['MCP', 'AI agents', 'developer workflow'],
    intro:
      'One install command beats five pasted API keys — and agents keep humans in the review loop.',
    sections: [
      {
        heading: 'Agents call hosted tools',
        body:
          'Generate, analyze, and outline from Cursor or Claude without wiring secrets into local config files.',
      },
      {
        heading: 'Review in the web workspace',
        body:
          'Draft history and export live in BlogCreator — the agent proposes, the human publishes.',
      },
    ],
    closing: 'See /integrate for the one-line install.',
  },
] as const;

export const NEWSLETTER_SAMPLE_ISSUE = NEWSLETTER_SAMPLE_ISSUES[0];
