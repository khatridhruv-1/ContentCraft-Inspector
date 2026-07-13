import { NextResponse } from 'next/server';
import { sendUnsubscribeConfirmationEmail } from '@/lib/email/sendNewsletterEmail';
import { unsubscribeByToken } from '@/lib/newsletter/subscribers';
import { PRODUCTION_SITE_URL } from '@/lib/marketing/siteConfig';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token')?.trim();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || PRODUCTION_SITE_URL;
  const redirectUrl = `${siteUrl}/newsletter/unsubscribed`;

  if (!token) {
    return NextResponse.redirect(`${redirectUrl}?status=invalid`);
  }

  try {
    const { subscriber, didUnsubscribe } = await unsubscribeByToken(token);

    if (!subscriber) {
      return NextResponse.redirect(`${redirectUrl}?status=invalid`);
    }

    if (didUnsubscribe) {
      let emailSent = false;
      try {
        await sendUnsubscribeConfirmationEmail(subscriber);
        emailSent = true;
      } catch (error) {
        console.error('Unsubscribe confirmation email failed:', error);
      }

      const emailParam = emailSent ? '1' : '0';
      return NextResponse.redirect(`${redirectUrl}?status=success&emailSent=${emailParam}`);
    }

    return NextResponse.redirect(`${redirectUrl}?status=already`);
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.redirect(`${redirectUrl}?status=error`);
  }
}
