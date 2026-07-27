import { Suspense } from 'react';
import AuthFormHeaderStatic from '@/components/auth/AuthFormHeaderStatic';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import AuthCallbackClient from './AuthCallbackClient';

export default function AuthCallbackPage() {
  return (
    <>
      <AuthFormHeaderStatic
        badge="Almost there"
        title="Finishing sign-in"
        subtitle="We are connecting your Google or GitHub account to your BlogCreator workspace."
      />
      <Suspense fallback={<PageLoadingScreen label="Completing sign-in" />}>
        <AuthCallbackClient />
      </Suspense>
    </>
  );
}
