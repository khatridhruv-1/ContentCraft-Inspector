export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  context: string;
};

/** Quotes from early users (Jul 2026). */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Platform mode for LinkedIn actually changes the structure. Short paragraphs, strong hook — not a blog post dumped into a feed.',
    name: 'James T.',
    role: 'Solo creator',
    context: 'Technical blogging',
  },
  {
    quote:
      'Installed the MCP tool in Cursor in one command. My agent now calls generate_content without me pasting API keys into config files.',
    name: 'Alex R.',
    role: 'Software engineer',
    context: 'Agent workflows',
  },
  {
    quote:
      'First website post took 20 minutes end to end — then I spun LinkedIn versions from the same brief. Replaced ChatGPT, a keyword tool, and a readability checker.',
    name: 'Priya M.',
    role: 'Content lead',
    context: 'B2B SaaS',
  },
];
