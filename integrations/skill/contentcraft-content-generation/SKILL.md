---
name: contentcraft-content-generation
description: Generate SEO-ready content, analyze copy, and build outlines using ContentCraft Inspector APIs. Use when the user asks to generate blog posts, draft SEO content, analyze readability, discover keywords, or integrate ContentCraft into a workflow.
---

# ContentCraft Content Generation

Use ContentCraft Inspector HTTP APIs to generate and optimize content from any AI agent workflow — Cursor, Claude Code, Antigravity, Windsurf, or custom agents that read skill files.

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
  "tone": "professional"
}
```

**Response:** `{ "content": "...", "keywords": [...], "topic": "..." }`

- `title` is required — topic, headline, or brief.
- `tone` is optional — e.g. `professional`, `casual`, `authoritative`.
- Content includes keyword discovery from Google Trends and autocomplete.

**Example (curl):**

```bash
curl -s -X POST "$CONTENTCRAFT_API_URL/api/ai-content" \
  -H "Content-Type: application/json" \
  -d '{"title":"Benefits of serverless edge computing","tone":"professional"}'
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
2. For new articles: call `/api/ai-content` with a clear `title` and optional `tone`.
3. For optimization: call `/api/analyze` on the draft.
4. For structure: call `/api/outline` before or after drafting.
5. Return generated HTML/markdown to the user; surface `keywords` and analysis insights.

## Install via CLI

One command installs this skill for **all supported platforms** (Cursor, Claude Code, Antigravity, and shared `.agents` paths):

```bash
CONTENTCRAFT_API_URL="https://your-hosted-app.com" \
  curl -fsSL https://cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector@master/scripts/install-integration.sh \
  | bash -s -- skill --global
```

For a single project only, use `--project` instead of `--global`.

**MCP alternative** (native tools in chat — also cross-platform):

```bash
curl -fsSL https://cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector@master/scripts/install-integration.sh | bash -s -- mcp --global
```

Run with **bash** (Git Bash or WSL on Windows). Full setup: `/integrate` on your ContentCraft deployment.

## Platform paths

| Platform | Global install path |
|----------|---------------------|
| Cursor | `~/.cursor/skills/contentcraft-content-generation/` |
| Claude Code | `~/.claude/skills/contentcraft-content-generation/` |
| Antigravity | `~/.gemini/antigravity/skills/` or `~/.gemini/antigravity-ide/skills/` |
| Universal | `~/.agents/skills/contentcraft-content-generation/` |

Project installs use `.cursor/skills/`, `.claude/skills/`, `.agents/skills/`, or `.agent/skills/` in the repo root.

## Errors

| Status | Meaning |
|--------|---------|
| 400 | Missing or invalid `title` / `content` |
| 500 | Server misconfiguration on the hosted API |
| 502 | Upstream AI or keyword service unavailable |

Surface the `error` field from JSON responses to the user with an actionable next step.
