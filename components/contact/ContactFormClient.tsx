'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { SITE_EMAILS } from '@/lib/marketing/siteConfig';

const fieldClassName =
  'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-teal-500';

const SUPPORT_EMAIL = SITE_EMAILS.support;

type FormState = {
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
};

export const CONTACT_TOPICS = [
  { value: 'general', label: 'General question' },
  { value: 'account', label: 'Account or login' },
  { value: 'billing', label: 'Billing or pricing' },
  { value: 'integrations', label: 'MCP / API / integrations' },
  { value: 'pro-waitlist', label: 'Pro plan waitlist' },
  { value: 'privacy', label: 'Privacy or data request' },
] as const;

const initialForm: FormState = {
  name: '',
  email: '',
  topic: 'general',
  subject: '',
  message: '',
};

export default function ContactFormClient() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const [form, setForm] = useState<FormState>(() => ({
    ...initialForm,
    topic:
      CONTACT_TOPICS.some(t => t.value === topicParam) && topicParam
        ? topicParam
        : 'general',
    subject: topicParam === 'pro-waitlist' ? 'Pro plan waitlist' : '',
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setSubmitError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          topic: form.topic,
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      const data = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        throw new Error(data.error || 'Could not send your message. Please try again.');
      }

      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not send your message. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"
      >
        <p className="font-semibold text-emerald-950">Message sent</p>
        <p className="mt-1 text-emerald-800">
          We received your note and typically reply within one business day. You can also reach us at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="not-prose space-y-5 rounded-2xl border border-slate-200 bg-white/70 p-6 md:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name">Name</Label>
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
            <p id="contact-name-error" role="alert" className="text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contact-email">Email</Label>
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
            <p id="contact-email-error" role="alert" className="text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-topic">Topic</Label>
        <select
          id="contact-topic"
          name="topic"
          value={form.topic}
          onChange={e => setForm(prev => ({ ...prev, topic: e.target.value }))}
          className={cn('flex h-10 w-full rounded-md border px-3 py-2 text-sm', fieldClassName)}
        >
          {CONTACT_TOPICS.map(topic => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">Subject</Label>
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
          <p id="contact-subject-error" role="alert" className="text-sm text-red-600">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
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
          <p id="contact-message-error" role="alert" className="text-sm text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      <MarketingPrimaryButton
        type="submit"
        disabled={submitting}
        loading={submitting}
        loadingText="Sending..."
        className="sm:!w-auto sm:min-w-[160px]"
        fullWidth={false}
      >
        Send message
      </MarketingPrimaryButton>
      {submitError ? (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      ) : null}
    </form>
  );
}
