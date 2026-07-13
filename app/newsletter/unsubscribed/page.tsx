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
    body: 'You will no longer receive BlogCreator Daily emails. Changed your mind? You can resubscribe anytime from our homepage.',
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
  const copy = STATUS_COPY[status] ?? STATUS_COPY.success;

  return (
    <LegalPageShell
      heading={
        <>
          Newsletter <span className={marketingAccentSpan}>unsubscribe</span>
        </>
      }
      description={copy.title}
    >
      <p>{copy.body}</p>
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
