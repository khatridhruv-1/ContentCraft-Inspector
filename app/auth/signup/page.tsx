import AuthFormHeaderStatic from '@/components/auth/AuthFormHeaderStatic';
import SignupFormClient from './SignupFormClient';

export default function SignupPage() {
  return (
    <>
      <AuthFormHeaderStatic
        badge="Get started"
        title="Create your account"
        subtitle="Free for everyone · Set up in under two minutes."
      />
      <SignupFormClient />
    </>
  );
}
