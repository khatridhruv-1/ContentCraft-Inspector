#!/usr/bin/env node
/**
 * ContentCraft Inspector MCP Server
 * Exposes generate_content, analyze_content, and create_outline tools.
 *
 * Env: CONTENTCRAFT_API_URL (default http://localhost:3000)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { resolveGenerationPlatform } from './platform.js';

const API_BASE = (process.env.CONTENTCRAFT_API_URL || 'http://localhost:3000').replace(/\/$/, '');

const TOOLS = [
  {
    name: 'generate_content',
    description:
      'Generate platform-specific content (website, LinkedIn, Quora, Medium, Substack) from a topic or brief. Always set `platform` when the user names a channel (e.g. "LinkedIn post about …" → platform: linkedin). ~3–4 min read per platform.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description:
            'Topic or brief. May include platform wording (e.g. "LinkedIn post about remote work") — platform is also detected from this text.',
        },
        tone: {
          type: 'string',
          description: 'Optional tone (e.g. professional, casual, authoritative)',
        },
        platform: {
          type: 'string',
          description:
            'Target platform. Set when user asks for a specific channel: website (personal blog), linkedin, quora, medium, substack. Inferred from title if omitted.',
          enum: ['website', 'linkedin', 'quora', 'medium', 'substack'],
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'analyze_content',
    description: 'Run deep SEO and readability analysis on existing content.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'HTML or plain text content to analyze' },
      },
      required: ['content'],
    },
  },
  {
    name: 'create_outline',
    description:
      'Generate a structured outline, suggestions, and content gaps from a draft or brief.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Existing draft, brief, or notes' },
      },
      required: ['content'],
    },
  },
];

async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

const server = new Server(
  { name: 'contentcraft', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  try {
    let result;
    if (name === 'generate_content') {
      if (!args?.title || typeof args.title !== 'string') {
        throw new Error('title is required');
      }

      const platform = resolveGenerationPlatform({
        platform: typeof args.platform === 'string' ? args.platform : undefined,
        rawBrief: args.title,
      });

      result = await postJson('/api/ai-content', {
        title: args.title,
        tone: typeof args.tone === 'string' ? args.tone : undefined,
        platform,
      });
    } else if (name === 'analyze_content') {
      if (!args?.content || typeof args.content !== 'string') {
        throw new Error('content is required');
      }
      result = await postJson('/api/analyze', { content: args.content });
    } else if (name === 'create_outline') {
      if (!args?.content || typeof args.content !== 'string') {
        throw new Error('content is required');
      }
      result = await postJson('/api/outline', { content: args.content });
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Tool call failed';
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: message }) }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
