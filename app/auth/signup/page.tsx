'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { User, Mail, Lock, Building2, UserPlus } from 'lucide-react';
import PageLoadingScreen from '@/components/loading/PageLoadingScreen';
import { cn } from '@/lib/utils';
import { ErrorAlert } from '@/components/auth/ErrorAlert';
import AuthTextField from '@/components/auth/AuthTextField';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import AuthFormStagger from '@/components/auth/AuthFormStagger';
import { AUTH_EASE } from '@/components/auth/authFeatures';
import { marketingLink } from '@/lib/marketing/marketingTheme';
import { signup } from '@/lib/user/appwrite';
import { createCompany, joinCompany, checkCompanyDomain } from '@/lib/companyHelper/companyHelpers';

interface ValidationError {
  field: string;
  message: string;
}

type Step = 'signup' | 'company' | 'done';

const PUBLIC_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];

function SignupProgress({ step }: { step: Step }) {
  const activeIndex = step === 'signup' ? 0 : 1;
  const isDone = step === 'done';

  const stepClass = (i: number) => {
    const isCompleted = isDone || i < activeIndex;
    const isActive = !isDone && i === activeIndex;
    return cn(
      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all duration-300',
      isCompleted || isActive
        ? 'bg-primary text-primary-foreground shadow-sm'
        : 'border border-slate-200 bg-slate-50 text-slate-400'
    );
  };

  return (
    <div className="mb-7" aria-label="Signup progress" role="group">
      <div className="flex items-center gap-0">
        <div className={stepClass(0)}>{activeIndex > 0 || isDone ? '✓' : '1'}</div>
        <div className="relative mx-3 h-0.5 min-w-[80px] flex-1 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: activeIndex >= 1 || isDone ? '100%' : '0%' }}
            transition={{ duration: 0.55, ease: AUTH_EASE }}
          />
        </div>
        <div className={stepClass(1)}>{isDone ? '✓' : '2'}</div>
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">
        Step {step === 'signup' ? 1 : 2} of 2 · {step === 'signup' ? 'Account' : 'Workspace'}
      </p>
    </div>
  );
}

export default function Signup() {
  const [step, setStep] = useState<Step>('signup');
  const [error, setError] = useState<ValidationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyInfo, setCompanyInfo] = useState<{
    company: { $id: string; name: string } | null;
    user: string;
    domain: string;
  } | null>(null);
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
    const barColors = ['bg-red-400', 'bg-amber-400', 'bg-violet-400', 'bg-emerald-400'];
    const label = getStrengthLabel(password, strength);
    const barsFilled =
      password.length < 6 ? 1 : Math.max(strength, 1);
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
                transition={{ duration: 0.25, delay: i * 0.04, ease: AUTH_EASE }}
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

      const domain = email.split('@')[1];
      const isPublic = PUBLIC_DOMAINS.includes(domain.toLowerCase());

      if (isPublic) {
        setCompanyInfo({ company: null, user: session.userId, domain });
      } else {
        const matchedCompany = await checkCompanyDomain(domain);
        setCompanyInfo({ company: matchedCompany, user: session.userId, domain });
      }

      setStep('company');
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

  const handleJoinCompany = async () => {
    if (!companyInfo?.company || !companyInfo?.user) return;
    setError(null);
    setLoading(true);
    try {
      await joinCompany(companyInfo.company.$id, companyInfo.user);
      setStep('done');
      setIsRedirecting(true);
      await new Promise(resolve => setTimeout(resolve, shouldReduceMotion ? 0 : 450));
      router.push('/home');
    } catch {
      setError({ field: 'general', message: 'Failed to join company. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    if (!companyName.trim()) {
      setError({ field: 'companyName', message: 'Please enter your company name' });
      return;
    }
    if (!companyInfo?.user) return;
    setError(null);
    setLoading(true);
    try {
      await createCompany({
        name: companyName,
        domain: companyInfo.domain,
        users: [companyInfo.user],
      });
      setStep('done');
      setIsRedirecting(true);
      await new Promise(resolve => setTimeout(resolve, shouldReduceMotion ? 0 : 450));
      router.push('/home');
    } catch {
      setError({ field: 'general', message: 'Failed to create company. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const stepMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 24, filter: 'blur(6px)' },
        animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, x: -16, filter: 'blur(4px)' },
        transition: { duration: 0.45, ease: AUTH_EASE },
      };

  if (step === 'done') {
    return <PageLoadingScreen label="Setting up workspace" />;
  }

  return (
    <>
      {step !== 'done' && <SignupProgress step={step} />}

      <AnimatePresence mode="wait">
        {step === 'signup' && (
          <motion.div key="signup" {...stepMotion}>
            <AuthFormHeader
              badge="Get started free"
              title="Create your account"
              subtitle="Free plan · No credit card · Set up in under two minutes."
            />

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
                  label="Work email"
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
                  {password.length > 0 && (
                    <div className="mt-2">{renderPasswordStrength()}</div>
                  )}
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
                  Continue to workspace setup
                </AuthSubmitButton>

                <p className="!mt-6 text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className={cn('font-semibold text-slate-900 underline-offset-2 hover:underline', marketingLink)}
                  >
                    Sign in
                  </Link>
                </p>
              </AuthFormStagger>
            </motion.form>
          </motion.div>
        )}

        {step === 'company' && (
          <motion.div key="company" {...stepMotion}>
            <AuthFormHeader
              badge="Almost done"
              title="Connect your workspace"
              subtitle="Join an existing team or create a new company workspace."
            />

            <div className="space-y-6">
              <ErrorAlert message={error?.field === 'general' ? error.message : ''} />

              {companyInfo?.company ? (
                <>
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-8 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <Building2 className="h-7 w-7" aria-hidden />
                    </div>
                    <p className="text-base leading-relaxed text-slate-700">
                      <strong className="text-slate-900">{companyInfo.company.name}</strong> matches your
                      email domain.
                    </p>
                    <p className="mt-2 text-sm text-slate-500">Join your team in one click.</p>
                  </div>
                  <AuthSubmitButton
                    type="button"
                    onClick={handleJoinCompany}
                    loading={loading || isRedirecting}
                    loadingText="Joining team..."
                  >
                    {`Join ${companyInfo.company.name}`}
                  </AuthSubmitButton>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-violet-200 bg-violet-50 p-8 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <UserPlus className="h-7 w-7" aria-hidden />
                    </div>
                    <p className="text-base leading-relaxed text-slate-700">
                      No company found for your domain yet.
                    </p>
                    <p className="mt-2 text-sm text-slate-500">Create a workspace for your team.</p>
                  </div>

                  <AuthTextField
                    id="companyName"
                    name="companyName"
                    label="Company name"
                    icon={<Building2 />}
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    error={error?.field === 'companyName' ? error.message : undefined}
                    autoComplete="organization"
                  />

                  <AuthSubmitButton
                    type="button"
                    onClick={handleCreateCompany}
                    loading={loading || isRedirecting}
                    loadingText="Creating workspace..."
                  >
                    Create workspace
                  </AuthSubmitButton>
                </>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}
