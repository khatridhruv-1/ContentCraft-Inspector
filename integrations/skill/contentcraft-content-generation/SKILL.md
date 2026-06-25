---
name: contentcraft-content-generation
description: Generate SEO-ready content, analyze copy, and build outlines using ContentCraft Inspector APIs. Use when the user asks to generate blog posts, draft SEO content, analyze readability, discover keywords, or integrate ContentCraft into a workflow.
---

# ContentCraft Content Generation

Use ContentCraft Inspector HTTP APIs to generate and optimize content from any Cursor project or agent workflow.

## Configuration

Set the API base URL before calling endpoints:

```bash
export CONTENTCRAFT_API_URL="http://localhost:3000"   # local dev
# export CONTENTCRAFT_API_URL="https://your-deployed-app.com"
```

All requests use `POST` with `Content-Type: application/json`. No auth header is required for the public API routes when keys are configured on the server.

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

1. Confirm `CONTENTCRAFT_API_URL` is set and the server is running.
2. For new articles: call `/api/ai-content` with a clear `title` and optional `tone`.
3. For optimization: call `/api/analyze` on the draft.
4. For structure: call `/api/outline` before or after drafting.
5. Return generated HTML/markdown to the user; surface `keywords` and analysis insights.

## Install via CLI

```bash
# MCP tool (tools in agent chat)
curl -fsSL https://cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector@master/scripts/install-integration.sh | bash -s -- mcp --global

# This skill (project copy)
curl -fsSL https://cdn.jsdelivr.net/gh/khatridhruv-1/ContentCraft-Inspector@master/scripts/install-integration.sh | bash -s -- skill --project
```

Or clone and install locally:

```bash
git clone --depth 1 -b master https://github.com/khatridhruv-1/ContentCraft-Inspector.git
cd ContentCraft-Inspector
bash ./scripts/install-integration.sh mcp --global
```

Run with **bash** (Git Bash or WSL on Windows). Full setup docs: `/integrate` on your ContentCraft Inspector deployment.

## Errors

| Status | Meaning |
|--------|---------|
| 400 | Missing or invalid `title` / `content` |
| 500 | Server missing `OLLAMA_API_KEY`, `GROQ_API_KEY`, etc. |
| 502 | Upstream AI or keyword service unavailable |

Surface the `error` field from JSON responses to the user with a actionable next step.
