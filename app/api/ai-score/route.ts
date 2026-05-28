import { NextResponse } from 'next/server';

function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

function cleanContent(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 8000);
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const plainContent = cleanContent(content);
    const wordCount = plainContent.split(/\s+/).filter(Boolean).length;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a content analyzer and humanizer. Return ONLY a JSON object with these exact keys:
{
  "aiScore": number (0-100, likelihood of AI-generated),
  "humanScore": number (0-100, likelihood of human-written),
  "analysis": string (breakdown of AI vs human characteristics),
  "humanizedVersion": string (rewritten version ~${wordCount} words, more natural and conversational)
}`,
          },
          {
            role: "user",
            content: `Analyze and humanize this content: ${plainContent}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Groq error in ai-score:", errData);
      return NextResponse.json({ error: errData?.error?.message || "Error analyzing content" }, { status: 500 });
    }

    const data = await response.json();
    const raw = data.choices[0].message.content;

    let analysis;
    try {
      analysis = JSON.parse(extractJSON(raw));
    } catch {
      console.error("JSON parse failed in ai-score:", raw);
      return NextResponse.json({ error: "AI returned invalid response" }, { status: 500 });
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in AI score analysis:', error);
    return NextResponse.json({ error: 'Error analyzing content' }, { status: 500 });
  }
}
