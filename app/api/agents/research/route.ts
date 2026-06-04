import { NextResponse } from 'next/server';
import { runResearchAgent } from '@/lib/agents/research';
import type { ContentPlatform } from '@/types/agents';

export async function POST(req: Request) {
  try {
    const {
      topic,
      industry,
      targetAudience,
      brandVoiceTone = 'professional',
      contentCategories = [],
      platform = 'blog',
    } = await req.json();

    if (!topic) return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    if (!industry) return NextResponse.json({ error: 'industry is required' }, { status: 400 });
    if (!targetAudience) return NextResponse.json({ error: 'targetAudience is required' }, { status: 400 });

    const result = await runResearchAgent({
      topic,
      industry,
      targetAudience,
      brandVoiceTone,
      contentCategories,
      platform: platform as ContentPlatform,
    });

    return NextResponse.json(result);
  } catch (e: any) {
    console.error('POST /api/agents/research error:', e.message);
    return NextResponse.json({ error: e.message || 'Research agent failed' }, { status: 500 });
  }
}
