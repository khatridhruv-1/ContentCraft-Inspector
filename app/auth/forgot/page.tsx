import type { Metadata } from 'next';
import AuthFormHeaderStatic from '@/components/auth/AuthFormHeaderStatic';
import ForgotPasswordFormClient from './ForgotPasswordFormClient';

export const metadata: Metadata = {
  title: 'Forgot password — BlogCreator',
  description: 'Request a password reset link for your BlogCreator account.',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthFormHeaderStatic
        badge="Account recovery"
        title="Reset your password"
        subtitle="Enter your email and we will send a reset link."
      />
      <ForgotPasswordFormClient />
    </>
  );
}
