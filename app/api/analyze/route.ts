import { NextResponse } from 'next/server';
import { groqChat, groqErrorResponse, parseGroqJson } from '@/lib/ai/groq';
import {
  ANALYSIS_MAX_PLAIN_CHARS,
  ANALYSIS_MIN_PLAIN_CHARS,
  normalizeAnalysisInput,
} from '@/lib/content/plainText';

export const runtime = 'edge';

type AnalysisResult = {
  contentScore: number;
  wordCount: number;
  readingTime: number;
  readability: number;
  tone: string;
  keyInsights: string[];
  improvements: string[];
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

  const plain = normalizeAnalysisInput(content);
  if (!plain) {
    return NextResponse.json(
      { error: 'Content is empty after removing formatting. Please add text to analyze.' },
      { status: 400 }
    );
  }

  if (plain.length < ANALYSIS_MIN_PLAIN_CHARS) {
    return NextResponse.json(
      { error: `Content is too short to analyze. Add at least ${ANALYSIS_MIN_PLAIN_CHARS} characters of text.` },
      { status: 400 }
    );
  }

  if (plain.length > ANALYSIS_MAX_PLAIN_CHARS) {
    return NextResponse.json(
      { error: `Content exceeds maximum length of ${ANALYSIS_MAX_PLAIN_CHARS} characters.` },
      { status: 400 }
    );
  }

  return plain;
}

async function fetchAnalysis(content: string): Promise<AnalysisResult> {
  const raw = await groqChat({
    messages: [
      {
        role: 'system',
        content: `
You are a powerful AI assistant that analyzes content and provides detailed insights and scores.
Evaluate the given content and return ONLY valid JSON with this structure:
{
  "contentScore": number,
  "wordCount": number,
  "readingTime": number,
  "readability": number,
  "tone": string,
  "keyInsights": string[],
  "improvements": string[]
}

Scoring rules for contentScore (0-100):
- Readability (30%)
- Structure and organization (30%)
- Tone appropriateness (20%)
- Engaging, concise language (20%)

Assume 150 words per minute for readingTime. Provide up to 5 keyInsights and up to 5 improvements.
        `.trim(),
      },
      {
        role: 'user',
        content: `Analyze the following content and provide scores and insights:\n\n${content}`,
      },
    ],
    temperature: 0.3,
    maxTokens: 2048,
  });

  return parseGroqJson<AnalysisResult>(raw);
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
    const analysis = await fetchAnalysis(validated);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in content analysis:', error);
    const { status, body } = groqErrorResponse(error);
    return NextResponse.json(
      { error: body.error || 'Analysis service unavailable' },
      { status: status === 429 ? 429 : 502 }
    );
  }
}
