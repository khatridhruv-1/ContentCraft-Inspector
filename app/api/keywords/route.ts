import { NextResponse } from 'next/server';
import {
  discoverKeywordsForTopic,
  keywordDiscoveryErrorResponse,
} from '@/lib/seo/keywords';

interface KeywordsRequest {
  topic?: string;
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY?.trim()) {
    return NextResponse.json(
      { error: 'Server configuration error: GROQ_API_KEY is not set' },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as KeywordsRequest;
    const topic = body?.topic?.trim();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const keywords = await discoverKeywordsForTopic(topic);
    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Error in keyword discovery:', error);
    const { status, body } = keywordDiscoveryErrorResponse(error);
    return NextResponse.json(body, { status });
  }
}
