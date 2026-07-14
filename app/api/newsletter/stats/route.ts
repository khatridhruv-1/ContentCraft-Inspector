import { listActiveSubscribers } from '@/lib/newsletter/subscribers';

export const runtime = 'edge';

export async function GET() {
  try {
    const subscribers = await listActiveSubscribers();
    return Response.json({ count: subscribers.length });
  } catch {
    return Response.json({ count: null });
  }
}
