import { NextResponse } from 'next/server';
import { generateContentFromTopic } from '@/lib/ai/generateContent';
import { ollamaErrorResponse, OllamaAuthError, OllamaRateLimitError } from '@/lib/ai/ollama';
import { keywordDiscoveryErrorResponse } from '@/lib/seo/keywords';

interface AIContentRequest {
  title?: string;
  tone?: string;
}

export async function POST(req: Request) {
  if (!process.env.OLLAMA_API_KEY?.trim()) {
    return NextResponse.json(
      { error: 'Server configuration error: OLLAMA_API_KEY is not set' },
      { status: 500 }
    );
  }

  if (!process.env.GROQ_API_KEY?.trim()) {
    return NextResponse.json(
      { error: 'Server configuration error: GROQ_API_KEY is not set (required for keyword discovery)' },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as AIContentRequest;
    const title = body?.title?.trim();
    const tone = body?.tone?.trim();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required to generate content.' },
        { status: 400 }
      );
    }

    const result = await generateContentFromTopic({
      rawBrief: title,
      tone: tone || undefined,
    });

    return NextResponse.json({
      content: result.content,
      keywords: result.keywords,
      topic: result.topic,
    });
  } catch (error) {
    console.error('Error in AI content generation:', error);

    if (
      error instanceof OllamaAuthError ||
      error instanceof OllamaRateLimitError ||
      (error instanceof Error && error.message.toLowerCase().includes('ollama'))
    ) {
      const { status, body } = ollamaErrorResponse(error);
      return NextResponse.json(body, { status });
    }

    const keywordError = keywordDiscoveryErrorResponse(error);
    return NextResponse.json(keywordError.body, { status: keywordError.status });
  }
}
