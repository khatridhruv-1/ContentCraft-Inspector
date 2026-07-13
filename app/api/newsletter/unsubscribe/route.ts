import { NextResponse } from 'next/server';
import { unsubscribeByToken } from '@/lib/newsletter/subscribers';
import { PRODUCTION_SITE_URL } from '@/lib/marketing/siteConfig';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token')?.trim();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_SITE_URL;
  const redirectUrl = `${siteUrl}/newsletter/unsubscribed`;

  if (!token) {
    return NextResponse.redirect(`${redirectUrl}?status=invalid`);
  }

  try {
    const subscriber = await unsubscribeByToken(token);

    if (!subscriber) {
      return NextResponse.redirect(`${redirectUrl}?status=invalid`);
    }

    return NextResponse.redirect(`${redirectUrl}?status=success`);
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.redirect(`${redirectUrl}?status=error`);
  }
}
