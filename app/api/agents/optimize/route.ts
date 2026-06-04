import { NextResponse } from 'next/server';
import { runOptimizationAgent } from '@/lib/agents/optimization';
import type { ContentPlatform } from '@/types/agents';

export async function POST(req: Request) {
  try {
    const {
      content,
      seoReport,
      brandVoice,
      platform = 'blog',
      analysisResult,
    } = await req.json();

    if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 });
    if (!seoReport) return NextResponse.json({ error: 'seoReport is required' }, { status: 400 });
    if (!brandVoice) return NextResponse.json({ error: 'brandVoice is required' }, { status: 400 });

    const result = await runOptimizationAgent({
      content,
      seoReport,
      brandVoice,
      platform: platform as ContentPlatform,
      analysisResult,
    });

    return NextResponse.json(result);
  } catch (e: any) {
    console.error('POST /api/agents/optimize error:', e.message);
    return NextResponse.json({ error: e.message || 'Optimization agent failed' }, { status: 500 });
  }
}
