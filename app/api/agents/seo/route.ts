import { NextResponse } from 'next/server';
import { runSEOAgent } from '@/lib/agents/seo';
import type { ContentPlatform } from '@/types/agents';

export async function POST(req: Request) {
  try {
    const { content, brief, platform = 'blog', brandName = '', websiteUrl = '' } = await req.json();

    if (!content) return NextResponse.json({ error: 'content is required' }, { status: 400 });
    if (!brief) return NextResponse.json({ error: 'brief is required' }, { status: 400 });

    const result = await runSEOAgent({
      content,
      brief,
      platform: platform as ContentPlatform,
      brandName,
      websiteUrl,
    });

    return NextResponse.json(result);
  } catch (e: any) {
    console.error('POST /api/agents/seo error:', e.message);
    return NextResponse.json({ error: e.message || 'SEO agent failed' }, { status: 500 });
  }
}
