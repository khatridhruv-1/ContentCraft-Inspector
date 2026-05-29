export function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

export function cleanContent(html: string, maxChars = 4000): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxChars);
}

export async function groqRequest(
  messages: { role: string; content: string }[],
  retries = 2
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

    // rate limit — extract wait time and retry
    if (res.status === 429 && attempt < retries) {
      const seconds = parseFloat(msg.match(/try again in ([\d.]+)s/)?.[1] ?? '6');
      await new Promise(r => setTimeout(r, (seconds + 1) * 1000));
      continue;
    }

    throw new Error(msg || 'Groq API error');
  }
  throw new Error('Max retries exceeded');
}
