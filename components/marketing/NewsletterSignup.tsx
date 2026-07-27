'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Mail, Sparkles, TrendingUp } from 'lucide-react';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import { Input } from '@/components/ui/input';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGlassCard,
  marketingInput,
  marketingLandingSection,
  marketingPageContainer,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface NewsletterSignupProps {
  className?: string;
}

export default function NewsletterSignup({ className }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(true);

  useEffect(() => {
    fetch('/api/newsletter/stats')
      .then(res => res.json())
      .then((data: { count?: number | null }) => {
        if (typeof data.count === 'number') setSubscriberCount(data.count);
      })
      .catch(() => undefined);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEmailSent(true);

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'landing' }),
      });

      const data = (await res.json()) as {
        message?: string;
        error?: string;
        emailSent?: boolean;
      };

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      const message = data.message || 'You are subscribed!';
      setSuccess(message);
      setEmailSent(data.emailSent !== false);
      setEmail('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="newsletter"
      className={cn(marketingLandingSection, className)}
      aria-labelledby="newsletter-heading"
    >
      <div className={marketingPageContainer}>
        <ScrollReveal>
          <div className={marketingSectionHeader}>
            <span className={marketingEyebrow}>
              <Mail className="h-3.5 w-3.5" aria-hidden />
              Daily briefing
            </span>
            <h2 id="newsletter-heading" className={marketingSectionTitle}>
              Trending topics, <span className={marketingAccentSpan}>humanized</span> every day
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Subscribe to BlogCreator Daily — fresh editorial content on what people are searching
              for right now, written in a clear practitioner voice.
              {subscriberCount !== null && subscriberCount > 0 && (
                <span className="mt-1 block text-sm font-medium text-teal-700">
                  Join {subscriberCount.toLocaleString()}+ subscribers
                </span>
              )}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div
            className={cn(
              marketingGlassCard,
              'mx-auto mt-10 max-w-3xl overflow-hidden p-6 md:p-8'
            )}
          >
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <TrendingUp className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Live trend data</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Topics sourced from Google Trends and live search signals.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Humanized writing</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Editorial drafts — not generic listicles or hype.
                  </p>
                </div>
              </div>
            </div>

            {success ? (
              <div
                role="status"
                className={cn(
                  'rounded-xl border px-5 py-4 text-sm',
                  emailSent
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                )}
              >
                <p className="font-semibold">{success}</p>
                {emailSent && (
                  <p className="mt-1 text-emerald-700">
                    Your first daily issue arrives tomorrow morning.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row" noValidate>
                <div className="min-w-0 flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    autoComplete="email"
                    placeholder="you@company.com"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'newsletter-email-error' : undefined}
                    className={cn(marketingInput, 'h-11')}
                  />
                  {error && (
                    <p id="newsletter-email-error" role="alert" className="mt-2 text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </div>
                <MarketingPrimaryButton
                  type="submit"
                  disabled={submitting}
                  loading={submitting}
                  loadingText="Subscribing..."
                  className="sm:min-w-[160px]"
                  fullWidth={false}
                >
                  Subscribe free
                </MarketingPrimaryButton>
              </form>
            )}

            <p className="mt-4 text-center text-xs text-slate-500">
              One email per day. Unsubscribe anytime. No spam.{' '}
              <Link
                href="/newsletter/sample"
                className={cn('font-medium text-teal-700 underline-offset-2 hover:underline', marketingFocusRing)}
              >
                Read a sample issue
              </Link>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
