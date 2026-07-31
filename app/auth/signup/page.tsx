import AuthFormHeaderStatic from '@/components/auth/AuthFormHeaderStatic';
import SignupFormClient from './SignupFormClient';

export default function SignupPage() {
  return (
    <>
      <AuthFormHeaderStatic
        badge="Get started"
        title="Create your"
        titleAccent="workspace"
        subtitle="Humanized drafts for the platforms you publish on."
      />
      <SignupFormClient />
    </>
  );
}
