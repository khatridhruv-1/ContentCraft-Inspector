'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import { cn } from '@/lib/utils';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import OAuthButtons from '@/components/auth/OAuthButtons';
import AuthTextField from '@/components/auth/AuthTextField';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import AuthFormStagger from '@/components/auth/AuthFormStagger';
import { MARKETING_EASE, marketingLink } from '@/lib/marketing/marketingTheme';
import { signup } from '@/lib/user/appwrite';

interface ValidationError {
  field: string;
  message: string;
}

export default function SignupFormClient() {
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [nameValue, setNameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  const validateForm = (name: string, email: string, pass: string): ValidationError | null => {
    if (name.length < 2) return { field: 'name', message: 'Name must be at least 2 characters' };
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email))
      return { field: 'email', message: 'Please enter a valid email address' };
    if (pass.length < 6) return { field: 'password', message: 'Password must be at least 6 characters' };
    return null;
  };

  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const getStrengthLabel = (pass: string, strength: number) => {
    if (pass.length < 6) return 'Too short (min. 6 characters)';
    if (strength === 0) return 'Weak';
    return (['Fair', 'Good', 'Strong'] as const)[strength - 1] ?? 'Strong';
  };

  const renderPasswordStrength = () => {
    const strength = getPasswordStrength(password);
    const barColors = ['bg-red-400', 'bg-amber-400', 'bg-teal-400', 'bg-emerald-400'];
    const label = getStrengthLabel(password, strength);
    const barsFilled = password.length < 6 ? 1 : Math.max(strength, 1);
    const barColor =
      password.length < 6 || strength === 0
        ? 'bg-red-400'
        : barColors[Math.min(strength - 1, barColors.length - 1)];

    return (
      <div className="mt-2.5 space-y-1.5" role="status" aria-live="polite">
        <div className="flex gap-1.5" aria-label={`Password strength: ${label}`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                initial={false}
                animate={{ width: i < barsFilled ? '100%' : '0%' }}
                transition={{ duration: 0.25, delay: i * 0.04, ease: MARKETING_EASE }}
                className={cn('h-full rounded-full', i < barsFilled ? barColor : '')}
              />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-500">{label}</p>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const pass = formData.get('password') as string;

    const validationError = validateForm(name, email, pass);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const session = await signup(email, pass, name);
      localStorage.setItem('sessionToken', session.secret);
      setIsRedirecting(true);
      await new Promise(resolve => setTimeout(resolve, shouldReduceMotion ? 0 : 450));
      router.push('/home');
    } catch (err) {
      const msg = (err as Error).message;
      const normalized = msg.toLowerCase();

      const friendlyMessage = normalized.includes('over_email_send_rate_limit')
        ? 'Too many signup attempts in a short time. Please wait a minute and try again.'
        : normalized.includes('email rate limit exceeded')
          ? 'Signup emails are temporarily rate-limited. Please wait a minute and try again.'
          : normalized.includes('already exists')
            ? 'This email is already registered'
            : msg || 'Failed to create account. Please try again.';

      setError({
        field: normalized.includes('already exists') ? 'email' : 'general',
        message: friendlyMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (isRedirecting) {
    return <PageLoadingScreen label="Setting up your account" />;
  }

  return (
    <motion.form onSubmit={handleSubmit} autoComplete="on">
      <AuthFormStagger>
        <AuthTextField
          id="name"
          name="name"
          label="Full name"
          icon={<User />}
          value={nameValue}
          onChange={e => setNameValue(e.target.value)}
          error={error?.field === 'name' ? error.message : undefined}
          autoComplete="name"
          required
        />

        <AuthTextField
          id="email"
          name="email"
          type="email"
          label="Email"
          icon={<Mail />}
          value={emailValue}
          onChange={e => setEmailValue(e.target.value)}
          error={error?.field === 'email' ? error.message : undefined}
          autoComplete="email"
          required
        />

        <div className="scroll-mt-8">
          <AuthTextField
            id="password"
            name="password"
            type="password"
            label="Password"
            icon={<Lock />}
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={error?.field === 'password' ? error.message : undefined}
            autoComplete="new-password"
            placeholder={password ? undefined : 'Min. 6 characters'}
            required
          />
          {password.length > 0 && <div className="mt-2">{renderPasswordStrength()}</div>}
        </div>

        <ErrorAlert message={error?.field === 'general' ? error.message : ''} />

        <p className="text-xs leading-relaxed text-slate-500">
          By continuing, you agree to our{' '}
          <Link href="/terms" className={marketingLink}>
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className={marketingLink}>
            Privacy Policy
          </Link>
          .
        </p>

        <AuthSubmitButton loading={loading} loadingText="Creating account...">
          Create account
        </AuthSubmitButton>

        <OAuthButtons mode="signup" />

        <p className="!mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className={cn(
              'font-semibold text-slate-900 underline-offset-2 hover:underline',
              marketingLink
            )}
          >
            Sign in
          </Link>
        </p>
      </AuthFormStagger>
    </motion.form>
  );
}
