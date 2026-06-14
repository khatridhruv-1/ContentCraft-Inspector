import { NextResponse } from 'next/server';
import { groqChat, groqErrorResponse, parseGroqJson } from '@/lib/ai/groq';

type OutlineResult = {
  outline: Array<{ level: number; text: string }>;
  suggestions: string[];
  contentGaps: string[];
};

async function validateContent(req: Request): Promise<string | NextResponse> {
  let content: unknown;
  try {
    const body = await req.json();
    content = body?.content;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!content || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }

  return content;
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY?.trim()) {
    return NextResponse.json(
      { error: 'Server configuration error: GROQ_API_KEY is not set' },
      { status: 500 }
    );
  }

  const validated = await validateContent(req);
  if (validated instanceof NextResponse) {
    return validated;
  }

  try {
    const raw = await groqChat({
      messages: [
        {
          role: 'system',
          content: `
You are an AI assistant that analyzes content and provides an outline with suggestions for improvement.
Return ONLY valid JSON with this structure:
{
  "outline": [{"level": number, "text": string}],
  "suggestions": string[],
  "contentGaps": string[]
}
          `.trim(),
        },
        {
          role: 'user',
          content: `Analyze the following content and provide an outline with suggestions for improvement:\n\n${validated}`,
        },
      ],
      temperature: 0.4,
      maxTokens: 2048,
    });

    const analysis = parseGroqJson<OutlineResult>(raw);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in outline generation:', error);
    const { status, body } = groqErrorResponse(error);
    return NextResponse.json(
      { error: body.error || 'Outline service unavailable' },
      { status: status === 429 ? 429 : 502 }
    );
  }
}
