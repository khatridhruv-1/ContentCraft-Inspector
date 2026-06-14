import { NextResponse } from 'next/server';
import { buildHumanizedContentPrompt } from '@/lib/ai/contentPrompts';
import { groqChat, groqErrorResponse } from '@/lib/ai/groq';
import {
  discoverKeywordsForTopic,
  formatKeywordsForPrompt,
  isKeywordDiscoveryConfigured,
} from '@/lib/seo/keywords';
import type { DiscoveredKeyword } from '@/types/seo';

interface AIContentRequest {
  title?: string;
  keywords?: string;
  tone?: string;
  /** When true (default), auto-discover keywords from search signals if keywords are empty */
  autoKeywords?: boolean;
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY?.trim()) {
    return NextResponse.json(
      { error: 'Server configuration error: GROQ_API_KEY is not set' },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as AIContentRequest;
    const title = body?.title?.trim();
    let keywords = body?.keywords?.trim();
    const tone = body?.tone?.trim();
    const autoKeywords = body?.autoKeywords !== false;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required to generate content.' },
        { status: 400 }
      );
    }

    let discoveredKeywords: DiscoveredKeyword[] | undefined;

    if (!keywords && autoKeywords && isKeywordDiscoveryConfigured()) {
      try {
        discoveredKeywords = await discoverKeywordsForTopic(title);
        keywords = formatKeywordsForPrompt(discoveredKeywords);
      } catch (error) {
        console.warn('Keyword discovery failed, generating without SEO keywords:', error);
      }
    }

    const { system, user } = buildHumanizedContentPrompt({
      title,
      keywords,
      tone,
      seoOptimized: Boolean(keywords),
    });

    const contentResponse = await groqChat({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.88,
      topP: 0.92,
      maxTokens: 4096,
    });

    return NextResponse.json({
      content: contentResponse,
      discoveredKeywords,
    });
  } catch (error) {
    console.error('Error in AI content generation:', error);
    const { status, body } = groqErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
