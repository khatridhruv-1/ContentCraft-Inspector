import type { Metadata } from 'next';
import AuthFormHeaderStatic from '@/components/auth/AuthFormHeaderStatic';
import ResetPasswordFormClient from './ResetPasswordFormClient';

export const metadata: Metadata = {
  title: 'Set new password — BlogCreator',
  description: 'Choose a new password for your BlogCreator account.',
};

export default function ResetPasswordPage() {
  return (
    <>
      <AuthFormHeaderStatic
        badge="Almost done"
        title="Set a new password"
        subtitle="Choose a strong password with at least 6 characters."
      />
      <ResetPasswordFormClient />
    </>
  );
}
