import { NextResponse } from 'next/server';

export const runtime = 'edge';

const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

export async function GET() {
  const missing = REQUIRED_VARS.filter(key => !process.env[key]?.trim());
  const configured = REQUIRED_VARS.filter(key => process.env[key]?.trim());

  return NextResponse.json({
    ok: missing.length === 0,
    configured,
    missing,
    hint:
      missing.length > 0
        ? 'Set missing variables in Cloudflare Pages → Settings → Environment variables, then redeploy.'
        : 'Auth environment looks configured.',
  });
}
