import { NextResponse } from 'next/server';
import { runFullPipeline } from '@/lib/agents/orchestrator';
import { getBrandProfile } from '@/lib/brand/profile';
import type { ContentPlatform, WorkflowType } from '@/types/agents';

export async function POST(req: Request) {
  try {
    const {
      topic,
      platform = 'blog',
      allPlatforms,
      userId,
      targetWordCount = 1500,
      workflowType = 'full_pipeline',
    } = await req.json();

    if (!topic) return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });

    const brandProfile = await getBrandProfile(userId);
    if (!brandProfile || !brandProfile.isSetupComplete) {
      return NextResponse.json(
        { error: 'Brand profile not set up. Please complete the AI Marketing Manager setup first.' },
        { status: 422 }
      );
    }

    const result = await runFullPipeline({
      topic,
      platform: platform as ContentPlatform,
      brandProfile,
      userId,
      targetWordCount,
      workflowType: workflowType as WorkflowType,
      allPlatforms: allPlatforms ?? [platform],
    });

    return NextResponse.json(result);
  } catch (e: any) {
    console.error('POST /api/agents/orchestrate error:', e.message);
    return NextResponse.json({ error: e.message || 'Orchestration failed' }, { status: 500 });
  }
}
