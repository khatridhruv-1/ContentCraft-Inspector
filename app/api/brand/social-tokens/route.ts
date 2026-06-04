import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET: Fetch social tokens for a user (tokens hidden in response)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('brand_profiles')
      .select('id, social_tokens')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    // Mask tokens in response — only return connected status
    const masked: Record<string, any> = {};
    const tokens: Record<string, any> = data?.social_tokens ?? {};
    for (const platform of Object.keys(tokens)) {
      masked[platform] = { connected: tokens[platform]?.connected === true };
    }

    return NextResponse.json({ tokens: masked, profileId: data?.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST: Save tokens for a specific platform
export async function POST(req: Request) {
  try {
    const { userId, brandProfileId, platformId, tokens: platformTokens } = await req.json();
    if (!userId || !platformId) return NextResponse.json({ error: 'userId and platformId required' }, { status: 400 });

    // Get existing tokens
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from('brand_profiles')
      .select('social_tokens')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchErr) throw new Error(fetchErr.message);

    const currentTokens: Record<string, any> = existing?.social_tokens ?? {};
    const updatedTokens = { ...currentTokens, [platformId]: { ...platformTokens, connected: true } };

    const { error: updateErr } = await supabaseAdmin
      .from('brand_profiles')
      .update({ social_tokens: updatedTokens, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (updateErr) throw new Error(updateErr.message);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('POST /api/brand/social-tokens error:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE: Disconnect a platform
export async function DELETE(req: Request) {
  try {
    const { userId, platformId } = await req.json();
    if (!userId || !platformId) return NextResponse.json({ error: 'userId and platformId required' }, { status: 400 });

    const { data: existing } = await supabaseAdmin
      .from('brand_profiles')
      .select('social_tokens')
      .eq('user_id', userId)
      .maybeSingle();

    const currentTokens: Record<string, any> = existing?.social_tokens ?? {};
    delete currentTokens[platformId];

    await supabaseAdmin
      .from('brand_profiles')
      .update({ social_tokens: currentTokens, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
