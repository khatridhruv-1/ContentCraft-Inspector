'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare } from 'lucide-react';
import LegalPageShell from '@/components/legal/LegalPageShell';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { marketingAccentSpan, marketingLink } from '@/lib/marketing/marketingTheme';

const fieldClassName =
  'border-white/[0.12] bg-white/[0.05] text-white placeholder:text-white/35 focus-visible:ring-violet-500';

const SUPPORT_EMAIL = 'support@contentcraftinspector.com';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.subject.trim()) next.subject = 'Please enter a subject.';
    if (!form.message.trim()) next.message = 'Please enter a message.';
    else if (form.message.trim().length < 10) {
      next.message = 'Message must be at least 10 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const body = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      '',
      form.message.trim(),
    ].join('\n');

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm(initialForm);
    }, 600);
  };

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <LegalPageShell
      badge="Contact"
      heading={
        <>
          Contact <span className={marketingAccentSpan}>us</span>
        </>
      }
      description="Questions about your account, billing, privacy, or how to use ContentCraft Inspector? Send us a message and we'll get back to you as soon as we can."
    >
      <div className="grid gap-4 sm:grid-cols-2 not-prose">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
            <Mail className="h-4 w-4 text-white" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">Email</span>
            <span className={cn('block text-sm', marketingLink)}>{SUPPORT_EMAIL}</span>
          </span>
        </a>
        <Link
          href="/help"
          className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
            <MessageSquare className="h-4 w-4 text-white" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">Help Center</span>
            <span className="block text-sm text-white/60">Guides and frequently asked questions</span>
          </span>
        </Link>
      </div>

      {submitted ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] px-5 py-4 text-sm text-emerald-100/90"
        >
          <p className="font-semibold text-emerald-200">Your email client should open shortly.</p>
          <p className="mt-1 text-emerald-100/80">
            If it didn&apos;t open, email us directly at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 border-white/15 bg-transparent text-white hover:bg-white/[0.06]"
            onClick={() => setSubmitted(false)}
          >
            Send another message
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="not-prose space-y-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name" className="text-white/85">
                Name
              </Label>
              <Input
                id="contact-name"
                name="name"
                value={form.name}
                onChange={update('name')}
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                className={fieldClassName}
                placeholder="Your name"
              />
              {errors.name && (
                <p id="contact-name-error" role="alert" className="text-sm text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-email" className="text-white/85">
                Email
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                className={fieldClassName}
                placeholder="you@company.com"
              />
              {errors.email && (
                <p id="contact-email-error" role="alert" className="text-sm text-red-400">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-subject" className="text-white/85">
              Subject
            </Label>
            <Input
              id="contact-subject"
              name="subject"
              value={form.subject}
              onChange={update('subject')}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
              className={fieldClassName}
              placeholder="How can we help?"
            />
            {errors.subject && (
              <p id="contact-subject-error" role="alert" className="text-sm text-red-400">
                {errors.subject}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-message" className="text-white/85">
              Message
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              value={form.message}
              onChange={update('message')}
              rows={5}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className={cn('min-h-[120px] resize-y', fieldClassName)}
              placeholder="Tell us about your question or issue..."
            />
            {errors.message && (
              <p id="contact-message-error" role="alert" className="text-sm text-red-400">
                {errors.message}
              </p>
            )}
          </div>

          <MarketingPrimaryButton
            type="submit"
            disabled={submitting}
            loading={submitting}
            loadingText="Opening email..."
            className="sm:!w-auto sm:min-w-[160px]"
            fullWidth={false}
          >
            Send message
          </MarketingPrimaryButton>
        </form>
      )}

    </LegalPageShell>
  );
}
