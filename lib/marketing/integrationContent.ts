/** Copy and metadata for the Integrations page (MCP + Skill CLI setup). */

export const INTEGRATION_REPO =
  'https://github.com/khatridhruv-1/ContentCraft-Inspector.git';

export const INTEGRATION_REPO_BRANCH = 'master';

export const INTEGRATION_REPO_RAW = `https://raw.githubusercontent.com/khatridhruv-1/ContentCraft-Inspector/${INTEGRATION_REPO_BRANCH}`;

/** jsDelivr serves fresh files; raw.githubusercontent.com branch URLs can lag after pushes. */
export const INTEGRATION_INSTALL_SCRIPT_URL = `https://cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector@${INTEGRATION_REPO_BRANCH}/scripts/install-integration.sh`;

function curlInstall(method: 'mcp' | 'skill', scope: '--global' | '--project') {
  return `curl -fsSL ${INTEGRATION_INSTALL_SCRIPT_URL} | bash -s -- ${method} ${scope}`;
}

export type IntegrationMethod = 'mcp' | 'skill';

export interface IntegrationStep {
  title: string;
  description: string;
  command: string;
}

export interface IntegrationMethodContent {
  id: IntegrationMethod;
  title: string;
  subtitle: string;
  description: string;
  iconSurface: string;
  iconColor: string;
  bestFor: string[];
  steps: IntegrationStep[];
  verifyCommand?: string;
  configNote?: string;
}

export const INTEGRATION_METHODS: IntegrationMethodContent[] = [
  {
    id: 'mcp',
    title: 'MCP Tool',
    subtitle: 'For Cursor, Claude Desktop, and other MCP clients',
    description:
      'Install the ContentCraft MCP server so your AI assistant can generate SEO-ready content and run deep analysis directly from chat.',
    iconSurface: 'bg-violet-100',
    iconColor: 'text-violet-700',
    bestFor: [
      'Cursor or Claude Desktop with MCP support',
      'Calling generate & analyze tools from agent chat',
      'Project or global setup via one CLI command',
    ],
    steps: [
      {
        title: 'From a cloned repo (recommended)',
        description:
          'Clone with GitHub access, then run the installer. Works with private repos; set CONTENTCRAFT_API_URL to your deployment or http://localhost:3000.',
        command: `git clone --depth 1 -b ${INTEGRATION_REPO_BRANCH} ${INTEGRATION_REPO} && cd ContentCraft-Inspector && bash ./scripts/install-integration.sh mcp --global`,
      },
      {
        title: 'Remote one-liner (public repo only)',
        description:
          'Requires a public GitHub repo. Adds the MCP server to your user-level Cursor config.',
        command: curlInstall('mcp', '--global'),
      },
      {
        title: 'Project scope from clone',
        description:
          'Writes .cursor/mcp.json in the current directory — ideal when integrating into a specific codebase.',
        command: 'bash ./scripts/install-integration.sh mcp --project',
      },
    ],
    verifyCommand: 'cat ~/.cursor/mcp.json | grep contentcraft',
    configNote:
      'After install, set CONTENTCRAFT_API_URL in your MCP config env block to point at your ContentCraft instance (e.g. https://your-app.com or http://localhost:3000). Restart Cursor to load the server.',
  },
  {
    id: 'skill',
    title: 'Cursor Skill',
    subtitle: 'Teach the agent ContentCraft workflows in any project',
    description:
      'Install the ContentCraft skill so Cursor agents know how to generate topics, draft SEO content, and analyze copy using your API.',
    iconSurface: 'bg-sky-50',
    iconColor: 'text-sky-700',
    bestFor: [
      'Cursor Agent with skill-based workflows',
      'Teams sharing project-scoped integration docs',
      'Lightweight setup without running an MCP server',
    ],
    steps: [
      {
        title: 'From a cloned repo (recommended)',
        description:
          'Clone with GitHub access, then install. Works with private repos.',
        command: `git clone --depth 1 -b ${INTEGRATION_REPO_BRANCH} ${INTEGRATION_REPO} && cd ContentCraft-Inspector && bash ./scripts/install-integration.sh skill --global`,
      },
      {
        title: 'Remote one-liner (public repo only)',
        description: 'Requires a public GitHub repo. Installs to every Cursor workspace on your machine.',
        command: curlInstall('skill', '--global'),
      },
      {
        title: 'Project scope from clone',
        description: 'Copies the skill into .cursor/skills/ in the current directory.',
        command: 'bash ./scripts/install-integration.sh skill --project',
      },
    ],
    verifyCommand: 'ls ~/.cursor/skills/contentcraft-content-generation/SKILL.md',
    configNote:
      'Set CONTENTCRAFT_API_URL in your shell profile or project .env so the agent knows which API host to call. The skill documents all endpoints and request shapes.',
  },
];

export const INTEGRATION_API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/ai-content',
    summary: 'Generate SEO-ready content from a topic or brief.',
    body: '{ "title": "Your topic", "tone": "professional" }',
    response: '{ "content": "...", "keywords": [...], "topic": "..." }',
  },
  {
    method: 'POST',
    path: '/api/analyze',
    summary: 'Score content and return SEO insights, readability, and improvements.',
    body: '{ "content": "<p>Your HTML or plain text</p>" }',
    response: '{ "contentScore": 85, "wordCount": 1200, "keyInsights": [...], ... }',
  },
  {
    method: 'POST',
    path: '/api/outline',
    summary: 'Build a structured outline and surface content gaps.',
    body: '{ "content": "<p>Existing draft or brief</p>" }',
    response: '{ "outline": [...], "suggestions": [...], "contentGaps": [...] }',
  },
] as const;

export const INTEGRATION_PREREQUISITES = [
  'Node.js 18+ (for the MCP server runtime)',
  'bash — run installs with bash, not sh/dash (Git Bash or WSL on Windows)',
  'curl and git (for the one-line remote installer)',
  'A running ContentCraft Inspector instance with API keys configured',
  'CONTENTCRAFT_API_URL set to your app origin (e.g. http://localhost:3000)',
] as const;

export const INTEGRATION_PLATFORM_NOTES = [
  {
    platform: 'macOS / Linux',
    status: 'Supported',
    note: 'Run with bash. Global install uses ~/.cursor; project install uses ./.cursor in your current directory.',
  },
  {
    platform: 'WSL',
    status: 'Supported with caveat',
    note: 'Install from the same environment Windows Cursor uses, or paths in mcp.json may not match.',
  },
  {
    platform: 'Windows (Git Bash)',
    status: 'Supported',
    note: 'Use Git Bash, not CMD/PowerShell. Verify node and npm are on PATH inside Git Bash.',
  },
  {
    platform: 'Windows (CMD / PowerShell)',
    status: 'Not supported',
    note: 'The installer requires bash. Use Git Bash or WSL instead.',
  },
] as const;

export const INTEGRATION_PRIVATE_REPO_NOTE =
  'This repository is private. The curl one-liner requires a public repo or GitHub authentication. Clone with access, then run the installer locally (see “Alternative: clone the repo first” below).';

export const INTEGRATION_CLONE_FALLBACK = `git clone --depth 1 -b ${INTEGRATION_REPO_BRANCH} ${INTEGRATION_REPO}
cd ContentCraft-Inspector
bash ./scripts/install-integration.sh mcp --global`;

/** Landing page highlights — SEO-friendly summaries of each integration path. */
export const INTEGRATION_LANDING_HIGHLIGHTS = [
  {
    id: 'mcp',
    title: 'MCP Tool for AI Assistants',
    description:
      'Connect ContentCraft to Cursor, Claude Desktop, or any MCP-compatible client. Your agent gets generate_content, analyze_content, and create_outline tools — no copy-paste between apps.',
    bullets: [
      'One CLI command installs the MCP server',
      'Works globally or per-project',
      'Generate and analyze from agent chat',
    ],
    tag: 'MCP',
  },
  {
    id: 'skill',
    title: 'Cursor Skill for Any Project',
    description:
      'Install the ContentCraft skill so Cursor agents know your API endpoints, request shapes, and SEO workflow — ideal for teams embedding content generation into existing codebases.',
    bullets: [
      'Teaches agents ContentCraft API patterns',
      'Project-scoped or user-wide install',
      'No separate server process required',
    ],
    tag: 'Skill',
  },
  {
    id: 'api',
    title: 'REST API for Custom Builds',
    description:
      'Call the same generation and analysis endpoints from your own apps, CI pipelines, or internal tools. Full control over how ContentCraft fits your stack.',
    bullets: [
      'POST /api/ai-content, /api/analyze, /api/outline',
      'JSON request and response',
      'Self-host or point at your deployment',
    ],
    tag: 'API',
  },
] as const;

export const INTEGRATION_LANDING_CLI = curlInstall('mcp', '--global');
