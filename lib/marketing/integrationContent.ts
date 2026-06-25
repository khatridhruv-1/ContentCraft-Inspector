/** Copy for the Integrations page — hosted MCP & Skill only. */

import { getSiteUrl } from '@/lib/marketing/siteUrl';

export const INTEGRATION_INSTALL_SCRIPT_URL = `https://cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector@master/scripts/install-integration.sh`;

export const INTEGRATION_HOSTED_API_URL = getSiteUrl();

export const INTEGRATION_IS_LOCAL_PREVIEW = INTEGRATION_HOSTED_API_URL.includes('localhost');

function installCommandLines(method: 'mcp' | 'skill') {
  return `CONTENTCRAFT_API_URL="${INTEGRATION_HOSTED_API_URL}" curl -fsSL ${INTEGRATION_INSTALL_SCRIPT_URL} | bash -s -- ${method} --global`;
}

export function integrationInstallCommand(method: 'mcp' | 'skill') {
  return installCommandLines(method);
}

export function integrationInstallCommandDisplay(method: 'mcp' | 'skill') {
  return [
    `CONTENTCRAFT_API_URL="${INTEGRATION_HOSTED_API_URL}"`,
    '',
    `curl -fsSL ${INTEGRATION_INSTALL_SCRIPT_URL} \\`,
    `  | bash -s -- ${method} --global`,
  ].join('\n');
}

export const INTEGRATION_SKILL_PLATFORMS = [
  'Cursor',
  'Claude Code',
  'Antigravity',
  'Windsurf',
  'Any skills-capable agent',
] as const;

export const INTEGRATION_INSTALL_OPTIONS = [
  {
    id: 'mcp' as const,
    title: 'MCP Tool',
    tagline: 'Native tools in agent chat — generate, analyze, outline',
    command: integrationInstallCommand('mcp'),
    commandDisplay: integrationInstallCommandDisplay('mcp'),
    steps: [
      'Run the command in Terminal (bash)',
      'Restart your AI assistant',
      'Ask the agent to use generate_content',
    ],
  },
  {
    id: 'skill' as const,
    title: 'Agent Skill',
    tagline: 'Cross-platform API docs — lighter, no MCP server',
    command: integrationInstallCommand('skill'),
    commandDisplay: integrationInstallCommandDisplay('skill'),
    steps: [
      'Run the command in Terminal (bash)',
      'Restart Cursor, Claude Code, Antigravity, or your agent',
      'Ask the agent to generate SEO content with ContentCraft',
    ],
  },
];

export const INTEGRATION_AFTER_INSTALL =
  'Requires bash and curl (Node 18+ for MCP only). Windows: Git Bash or WSL. No API keys on your machine.';

/** Landing page — keep short for /welcome */
export const INTEGRATION_LANDING_HIGHLIGHTS = [
  {
    id: 'mcp',
    title: 'MCP Tool',
    description: 'Add generate_content, analyze_content, and create_outline to agent chat.',
    bullets: ['One CLI command', 'Hosted API', 'Cursor, Claude, Antigravity'],
    tag: 'MCP',
  },
  {
    id: 'skill',
    title: 'Agent Skill',
    description: 'Teach any skills-capable agent how to call ContentCraft for SEO workflows.',
    bullets: ['All major platforms', 'No MCP server', 'Hosted API'],
    tag: 'Skill',
  },
] as const;

export const INTEGRATION_LANDING_CLI = integrationInstallCommand('mcp');
