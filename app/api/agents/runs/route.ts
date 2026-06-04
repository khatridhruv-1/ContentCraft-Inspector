import { NextResponse } from 'next/server';
import { getAgentRuns } from '@/lib/brand/profile';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const runs = await getAgentRuns(userId, limit);
    return NextResponse.json({ runs });
  } catch (e: any) {
    console.error('GET /api/agents/runs error:', e.message);
    return NextResponse.json({ error: e.message || 'Failed to fetch agent runs' }, { status: 500 });
  }
}
