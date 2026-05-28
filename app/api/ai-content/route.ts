import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, keywords, tone, targetWords = 1000 } = await req.json();

    let keywordPrompt = keywords?.trim() ? `Focus on these keywords: ${keywords}.` : '';
    let tonePrompt = tone?.trim() ? `Write in a ${tone} tone.` : '';

    const openaiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        stream: true,
        messages: [
          {
            role: "system",
            content: `You are a knowledgeable assistant. Generate a well-structured article on "${title}". Include headings, subheadings, and bullet points. ${keywordPrompt} ${tonePrompt}`,
          },
          {
            role: "user",
            content: `Generate a detailed, informative article of approximately ${targetWords} words.`,
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      return NextResponse.json({ error: "Error generating content" }, { status: 500 });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = openaiRes.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (!trimmed.startsWith('data: ')) continue;

            try {
              const json = JSON.parse(trimmed.slice(6));
              const token = json.choices?.[0]?.delta?.content ?? '';
              if (token) controller.enqueue(new TextEncoder().encode(token));
            } catch {
              // skip malformed chunks
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error("Error in AI content generation:", error);
    return NextResponse.json({ error: "Error generating content" }, { status: 500 });
  }
}
