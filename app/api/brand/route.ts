import { NextResponse } from 'next/server';
import { getBrandProfile, saveBrandProfile, updateBrandProfile } from '@/lib/brand/profile';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const profile = await getBrandProfile(userId);
    return NextResponse.json({ profile });
  } catch (e: any) {
    console.error('GET /api/brand error:', e.message);
    return NextResponse.json({ error: e.message || 'Failed to fetch brand profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, ...rest } = body;
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const profile = await saveBrandProfile({ userId, ...rest });
    return NextResponse.json({ profile });
  } catch (e: any) {
    console.error('POST /api/brand error:', e.message);
    return NextResponse.json({ error: e.message || 'Failed to save brand profile' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const profile = await updateBrandProfile(id, updates);
    return NextResponse.json({ profile });
  } catch (e: any) {
    console.error('PATCH /api/brand error:', e.message);
    return NextResponse.json({ error: e.message || 'Failed to update brand profile' }, { status: 500 });
  }
}
