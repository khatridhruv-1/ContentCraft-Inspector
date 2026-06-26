---
name: contentcraft-content-generation
description: Generate SEO-ready content for website, LinkedIn, Quora, Medium, or Substack, analyze copy, and build outlines using ContentCraft Inspector APIs. Use when the user asks to generate blog posts, platform-specific posts, draft SEO content, analyze readability, discover keywords, or integrate ContentCraft into a workflow.
---

# ContentCraft Content Generation

Use ContentCraft Inspector HTTP APIs to generate and optimize content from any AI agent workflow — editors, terminals, or custom agents that read skill files.

## Configuration

Set the API base URL before calling endpoints:

```bash
export CONTENTCRAFT_API_URL="http://localhost:3000"   # replaced by installer with your hosted URL
```

All requests use `POST` with `Content-Type: application/json`. No auth header is required on your machine — keys live on the hosted ContentCraft server.

## Generate content

**Endpoint:** `POST /api/ai-content`

```json
{
  "title": "How to improve Core Web Vitals in 2026",
  "tone": "professional",
  "platform": "linkedin"
}
```

- `title` is required — topic, headline, or brief.
- `tone` is optional — e.g. `professional`, `casual`, `authoritative`.
- `platform` is optional — `website`, `linkedin`, `quora`, `medium`, or `substack` (default `website`). ~3–4 min read per platform.
- Content includes keyword discovery from Google Trends and autocomplete.

**Response:** `{ "content": "...", "keywords": [...], "topic": "...", "platform": "linkedin" }`

## Platform-specific generation

When the user names a channel, **always pass `platform`** (or include the platform name in `title` — the API detects it automatically).

| User says | `platform` value |
|-----------|------------------|
| LinkedIn post / for LinkedIn | `linkedin` |
| Quora answer / for Quora | `quora` |
| Medium article / for Medium | `medium` |
| Substack newsletter / for Substack | `substack` |
| Personal website / my blog | `website` |
| No platform mentioned | `website` (default) |

**Examples:**

```json
{ "title": "Why async teams ship faster", "platform": "linkedin", "tone": "professional" }
```

```json
{ "title": "Quora answer: how do I start investing in my 20s?", "platform": "quora" }
```

```json
{ "title": "Write a Substack essay on creator burnout", "platform": "substack" }
```

If using the **ContentCraft MCP** `generate_content` tool, pass the same `platform` field (or put the platform name in `title` — it is detected automatically). Restart your agent after updating MCP.

**curl example:**

```bash
curl -s -X POST "$CONTENTCRAFT_API_URL/api/ai-content" \
  -H "Content-Type: application/json" \
  -d '{"title":"Benefits of serverless edge computing","tone":"professional","platform":"medium"}'
```

## Analyze content

**Endpoint:** `POST /api/analyze`

```json
{
  "content": "<p>Your HTML or plain text draft...</p>"
}
```

**Response:** `contentScore`, `wordCount`, `readingTime`, `readability`, `tone`, `keyInsights`, `improvements`.

Minimum ~100 characters of plain text after stripping markup.

## Create outline

**Endpoint:** `POST /api/outline`

```json
{
  "content": "<p>Existing draft or brief...</p>"
}
```

**Response:** `outline` (heading levels), `suggestions`, `contentGaps`.

## Agent workflow

1. Confirm `CONTENTCRAFT_API_URL` is set (the installer writes it into this file).
2. **Detect platform** from the user request (LinkedIn, Quora, Medium, Substack, personal website) and pass `platform` on every generate call.
3. For new content: call `/api/ai-content` (or MCP `generate_content`) with `title`, optional `tone`, and `platform`.
4. For optimization: call `/api/analyze` on the draft.
5. For structure: call `/api/outline` before or after drafting.
6. Return the draft formatted for the target platform; mention `platform` and discovered `keywords` in your reply.

## Install via CLI

One command installs this skill for **all supported agent skill directories** (including shared `.agents` paths):

```bash
CONTENTCRAFT_API_URL="https://your-hosted-app.com" \
  curl -fsSL https://raw.githubusercontent.com/khatridhruv-1/ContentCraft-Inspector/master/scripts/install-integration.sh \
  | CONTENTCRAFT_API_URL="https://your-hosted-app.com" bash -s -- skill --global
```

For a single project only, use `--project` instead of `--global`.

**MCP alternative** (native tools in chat — also cross-platform):

```bash
curl -fsSL https://raw.githubusercontent.com/khatridhruv-1/ContentCraft-Inspector/master/scripts/install-integration.sh | CONTENTCRAFT_API_URL="https://your-hosted-app.com" bash -s -- mcp --global
```

Run with **bash** (Git Bash or WSL on Windows). Full setup: `/integrate` on your ContentCraft deployment.

## Install paths

| Artifact | Global install path |
|----------|---------------------|
| MCP server | `~/.contentcraft/contentcraft-mcp/` |
| MCP client snippet | `~/.contentcraft/mcp.json` |
| Agent skill | `~/.contentcraft/skills/contentcraft-content-generation/` |
| Shared skill mirror | `~/.agents/skills/contentcraft-content-generation/` |

Project installs use `./.contentcraft/` (and `./.agents/skills/` for the skill).

**Optional env vars**

- `CONTENTCRAFT_MCP_CONFIG` — comma-separated MCP client config files to merge into automatically
- `CONTENTCRAFT_SKILL_DIRS` — comma-separated extra skill directories to copy into

## Errors

| Status | Meaning |
|--------|---------|
| 400 | Missing or invalid `title` / `content` |
| 500 | Server misconfiguration on the hosted API |
| 502 | Upstream AI or keyword service unavailable |

Surface the `error` field from JSON responses to the user with an actionable next step.
