import { listActiveSubscribers } from '@/lib/newsletter/subscribers';
import { PRODUCTION_SITE_URL } from '@/lib/marketing/siteConfig';

export const runtime = 'edge';

function supabaseConfigStatus() {
  return {
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
  };
}

export async function GET(req: Request) {
  try {
    const subscribers = await listActiveSubscribers();
    return Response.json({ count: subscribers.length, config: supabaseConfigStatus() });
  } catch (error) {
    return Response.json({ count: null, config: supabaseConfigStatus() });
  }
}
