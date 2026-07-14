import { Suspense } from 'react';
import AuthFormHeaderStatic from '@/components/auth/AuthFormHeaderStatic';
import LoginFormClient from './LoginFormClient';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';

export default function LoginPage() {
  return (
    <>
      <AuthFormHeaderStatic
        badge="Welcome back"
        title="Sign in to your workspace"
        subtitle="Pick up drafts, edits, and analysis right where you left off."
      />
      <Suspense fallback={<PageLoadingScreen label="Loading sign in" />}>
        <LoginFormClient />
      </Suspense>
    </>
  );
}
