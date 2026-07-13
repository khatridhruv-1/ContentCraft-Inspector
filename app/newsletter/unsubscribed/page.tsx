'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LegalPageShell from '@/components/legal/LegalPageShell';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import { marketingAccentSpan } from '@/lib/marketing/marketingTheme';

const STATUS_COPY: Record<string, { title: string; body: string }> = {
  success: {
    title: 'You have been unsubscribed',
    body: 'You will no longer receive BlogCreator Daily emails. A confirmation email has been sent to your inbox.',
  },
  already: {
    title: 'You are already unsubscribed',
    body: 'This email address is not on our active subscriber list, so no new confirmation email was sent. Resubscribe first if you want to test the flow again.',
  },
  invalid: {
    title: 'Invalid unsubscribe link',
    body: 'This link may have expired or already been used. If you still receive emails, contact support@blogcreator.dev.',
  },
  error: {
    title: 'Something went wrong',
    body: 'We could not process your unsubscribe request. Please try again or email support@blogcreator.dev.',
  },
};

function UnsubscribedContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'success';
  const emailSent = searchParams.get('emailSent');
  const copy = STATUS_COPY[status] ?? STATUS_COPY.success;

  const body =
    status === 'success' && emailSent === '0'
      ? 'You have been unsubscribed, but we could not send the confirmation email. Please check spam or try again later.'
      : copy.body;

  return (
    <LegalPageShell
      heading={
        <>
          Newsletter <span className={marketingAccentSpan}>unsubscribe</span>
        </>
      }
      description={copy.title}
    >
      <p>{body}</p>
      <p>
        <Link href="/#newsletter" className="underline underline-offset-2">
          Resubscribe on the homepage
        </Link>
      </p>
    </LegalPageShell>
  );
}

export default function NewsletterUnsubscribedPage() {
  return (
    <Suspense fallback={<PageLoadingScreen label="Loading" />}>
      <UnsubscribedContent />
    </Suspense>
  );
}
