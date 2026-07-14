export const NEWSLETTER_SAMPLE_ISSUE = {
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
} as const;
