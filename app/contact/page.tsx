import { Suspense } from 'react';
import ContactPageShell from '@/components/contact/ContactPageShell';
import ContactFormClient from '@/components/contact/ContactFormClient';

export default function ContactPage() {
  return (
    <ContactPageShell>
      <Suspense fallback={null}>
        <ContactFormClient />
      </Suspense>
    </ContactPageShell>
  );
}
