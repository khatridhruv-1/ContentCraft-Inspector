/** Copy for the Integrations page — hosted MCP & Skill only. */

import { getSiteUrl } from '@/lib/marketing/siteUrl';

export const INTEGRATION_GITHUB_REPO_URL =
  'https://github.com/khatridhruv-1/ContentCraft-Inspector';

export const INTEGRATION_INSTALL_SCRIPT_URL =
  'https://raw.githubusercontent.com/khatridhruv-1/ContentCraft-Inspector/master/scripts/install-integration.sh';

export function integrationApiUrl(origin?: string) {
  return (origin ?? getSiteUrl()).replace(/\/$/, '');
}

export function isLocalIntegrationPreview(apiUrl: string) {
  return apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
}

function installCommandLines(method: 'mcp' | 'skill', apiUrl: string) {
  const origin = integrationApiUrl(apiUrl);
  return `curl -fsSL ${INTEGRATION_INSTALL_SCRIPT_URL} | BLOGCREATOR_API_URL="${origin}" bash -s -- ${method} --global`;
}

export function integrationInstallCommand(method: 'mcp' | 'skill', apiUrl?: string) {
  return installCommandLines(method, apiUrl ?? getSiteUrl());
}

export function integrationInstallCommandDisplay(method: 'mcp' | 'skill', apiUrl?: string) {
  const origin = integrationApiUrl(apiUrl ?? getSiteUrl());
  return [
    `curl -fsSL ${INTEGRATION_INSTALL_SCRIPT_URL} \\`,
    `  | BLOGCREATOR_API_URL="${origin}" bash -s -- ${method} --global`,
  ].join('\n');
}

export const INTEGRATION_SKILL_PLATFORMS = [
  'MCP-capable agents',
  'Skills-capable agents',
  'Editors & terminals',
  'Cross-platform',
  'Any AI agent',
] as const;

export const INTEGRATION_AGENT_PLATFORMS_LABEL = 'editors, terminals, and AI agents';

export const INTEGRATION_HERO_EYEBROW = 'AI agent integrations';

export const INTEGRATION_HERO_TITLE = 'Use BlogCreator in any AI agent';

export const INTEGRATION_HERO_TITLE_ACCENT = 'any AI agent';

export const INTEGRATION_HERO_SUBTITLE =
  'One CLI command connects MCP tools or an agent skill to our hosted API. Works across editors and agents — no API keys on your machine.';

export const INTEGRATION_INSTALL_OPTIONS = [
  {
    id: 'mcp' as const,
    title: 'MCP Tool',
    tagline: 'Native tools in agent chat — generate, analyze, outline',
    steps: [
      'Run the command in Terminal (bash) — AI chat cannot run install scripts for you',
      'Installer auto-registers in detected MCP client configs when present',
      'Restart your agent, then ask it to use generate_content',
    ],
  },
  {
    id: 'skill' as const,
    title: 'Agent Skill',
    tagline: 'Cross-platform API docs — lighter, no MCP server',
    steps: [
      'Run the command in Terminal (bash)',
      'Restart your agent — skill files land in ~/.blogcreator/skills and ~/.agents/skills',
      'Ask the agent to generate SEO content with BlogCreator',
    ],
  },
];

export const INTEGRATION_AFTER_INSTALL =
  'Run in Terminal (not inside AI chat). Requires bash and curl (Node 18+ for MCP). Auto-configures when an MCP client folder is detected; reference config at ~/.blogcreator/mcp.json. Windows: Git Bash or WSL.';

/** Landing page — keep short for /welcome */
export const INTEGRATION_LANDING_HIGHLIGHTS = [
  {
    id: 'mcp',
    title: 'MCP Tool',
    description: 'Add generate_content, analyze_content, and create_outline to any MCP-capable agent.',
    bullets: ['One CLI command', 'Hosted API', INTEGRATION_AGENT_PLATFORMS_LABEL],
    tag: 'MCP',
  },
  {
    id: 'skill',
    title: 'Agent Skill',
    description: 'Teach any skills-capable agent how to call BlogCreator for SEO workflows.',
    bullets: ['All major platforms', 'No MCP server', 'Hosted API'],
    tag: 'Skill',
  },
] as const;

export const INTEGRATION_MCP_TOOLS = [
  'generate_content',
  'analyze_content',
  'create_outline',
] as const;

export const INTEGRATION_API_ROUTES = [
  { method: 'POST', path: '/api/ai-content', label: 'Generate platform-ready content' },
  { method: 'POST', path: '/api/analyze', label: 'Run deep SEO and readability analysis' },
  { method: 'POST', path: '/api/outline', label: 'Build structured content outlines' },
] as const;

export const INTEGRATION_LANDING_STEPS = [
  'Copy the install command and run it in Terminal (bash) — not inside AI chat.',
  'Restart your editor or AI agent so it picks up the MCP tool or skill.',
  'Ask your agent to generate SEO content with BlogCreator — it calls our hosted API for you.',
] as const;
