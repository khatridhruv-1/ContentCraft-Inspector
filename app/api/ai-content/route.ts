import { NextResponse } from 'next/server';
import { generateContentFromTopic } from '@/lib/ai/generateContent';
import { ollamaErrorResponse, OllamaAuthError, OllamaRateLimitError } from '@/lib/ai/ollama';
import { keywordDiscoveryErrorResponse } from '@/lib/seo/keywords';
import { parseContentPlatform } from '@/types/contentPlatform';

export const runtime = 'edge';

interface AIContentRequest {
  title?: string;
  tone?: string;
  platform?: string;
}

export async function POST(req: Request) {
  if (!process.env.OLLAMA_API_KEY?.trim()) {
    return NextResponse.json(
      { error: 'Server configuration error: OLLAMA_API_KEY is not set' },
      { status: 500 }
    );
  }

  if (!process.env.SCRAPING_HUB_API_KEY?.trim()) {
    return NextResponse.json(
      {
        error:
          'Server configuration error: SCRAPING_HUB_API_KEY is not set (required for keyword discovery)',
      },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as AIContentRequest;
    const title = body?.title?.trim();
    const tone = body?.tone?.trim();
    const platform = parseContentPlatform(body?.platform);

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required to generate content.' },
        { status: 400 }
      );
    }

    if (body?.platform !== undefined && body.platform !== '' && !platform) {
      return NextResponse.json(
        { error: 'Invalid platform. Use: website, linkedin, quora, medium, or substack.' },
        { status: 400 }
      );
    }

    const result = await generateContentFromTopic({
      rawBrief: title,
      tone: tone || undefined,
      platform,
    });

    return NextResponse.json({
      content: result.content,
      keywords: result.keywords,
      topic: result.topic,
      platform: result.platform,
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
