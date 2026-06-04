import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { publishToAll, type PublishPlatform } from '@/lib/agents/publisher';

export async function POST(req: Request) {
  try {
    const { userId, content, platforms } = await req.json();

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });
    if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });
    if (!Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ error: 'at least one platform required' }, { status: 400 });
    }

    // Get social tokens from DB
    const { data, error } = await supabaseAdmin
      .from('brand_profiles')
      .select('social_tokens')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    const socialTokens: Record<string, any> = data?.social_tokens ?? {};

    // Publish to all requested platforms
    const results = await publishToAll(content, platforms as PublishPlatform[], socialTokens);

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    return NextResponse.json({
      results,
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
      },
    });
  } catch (e: any) {
    console.error('POST /api/agents/publish error:', e.message);
    return NextResponse.json({ error: e.message || 'Publishing failed' }, { status: 500 });
  }
}
