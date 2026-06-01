export function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

export function sanitizeJSONString(text: string): string {
  let inString = false;
  let escaped = false;
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escaped) { result += ch; escaped = false; continue; }
    if (ch === '\\' && inString) { result += ch; escaped = true; continue; }
    if (ch === '"') { inString = !inString; result += ch; continue; }
    if (inString) {
      if (ch === '\n') { result += '\\n'; continue; }
      if (ch === '\r') { result += '\\r'; continue; }
      if (ch === '\t') { result += '\\t'; continue; }
      if (ch.charCodeAt(0) < 0x20) continue;
    }
    result += ch;
  }
  return result;
}

export function cleanContent(html: string, maxChars = 4000): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);
}

export async function groqRequest(
  messages: { role: string; content: string }[],
  retries = 3
): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices[0].message.content;
    }

    const err = await res.json().catch(() => ({}));
    const msg: string = err?.error?.message ?? '';

    if (res.status === 429 && attempt < retries) {
      const seconds = parseFloat(msg.match(/try again in ([\d.]+)s/)?.[1] ?? '10');
      await new Promise(r => setTimeout(r, (seconds + 2) * 1000));
      continue;
    }

    throw new Error(msg || 'Groq API error');
  }
  throw new Error('Rate limit exceeded. Please wait a moment and try again.');
}
