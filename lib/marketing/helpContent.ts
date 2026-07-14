export type HelpTroubleshootingItem = {
  question: string;
  answer: string;
  tag: string;
};

export const HELP_TROUBLESHOOTING_ITEMS: HelpTroubleshootingItem[] = [
  {
    question: 'Sign-up or login fails on blogcreator.dev',
    answer:
      'This usually means Supabase environment variables are missing or mismatched on Cloudflare Pages. Confirm NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY are set in the Pages project settings, then redeploy. If the issue persists, contact support with the exact error message.',
    tag: 'Auth',
  },
  {
    question: 'MCP or skill install command did not work',
    answer:
      'Run the command from your project root in Terminal. For MCP, restart Cursor or Claude Desktop after install. If you see a 401 error, your agent may be pointing at the wrong API URL — use the install panel on /integrate to copy the current production endpoint.',
    tag: 'Integrations',
  },
  {
    question: 'Keyword discovery returns no results',
    answer:
      'Try a broader topic phrase (2–5 words) and wait a few seconds for live search to complete. Very niche or brand-new topics may return fewer keywords until the search index catches up.',
    tag: 'SEO',
  },
  {
    question: 'Export to Word or Markdown looks wrong',
    answer:
      'Export uses your current editor content. Save your draft first, then export. Complex custom HTML may simplify on export — use the built-in editor formatting for best results.',
    tag: 'Export',
  },
  {
    question: 'Analysis scores seem low on a short draft',
    answer:
      'Readability and SEO scores work best on drafts of at least a few hundred words. Expand thin sections, add headings, and re-run Deep Analysis for more reliable guidance.',
    tag: 'Analysis',
  },
  {
    question: 'How do I unsubscribe from BlogCreator Daily?',
    answer:
      'Every newsletter email includes an unsubscribe link at the bottom. You can also contact support and we will remove your address within one business day.',
    tag: 'Newsletter',
  },
];
