import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET — fetch queue for a user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('content_queue')
    .select('*')
    .eq('user_id', userId)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ queue: data ?? [] });
}

// POST — add topic to queue
export async function POST(req: Request) {
  try {
    const { userId, companyId, topic, platform = 'blog', priority = 0, scheduledAt } = await req.json();
    if (!userId || !topic) return NextResponse.json({ error: 'userId and topic required' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('content_queue')
      .insert({
        user_id: userId,
        company_id: companyId || null,
        topic: topic.trim(),
        platform,
        priority,
        status: 'queued',
        scheduled_at: scheduledAt || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ item: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE — remove from queue
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    await supabaseAdmin.from('content_queue').delete().eq('id', id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH — reorder / update priority
export async function PATCH(req: Request) {
  try {
    const { id, priority, status } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const updates: any = {};
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;

    const { data, error } = await supabaseAdmin
      .from('content_queue')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ item: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
