'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { PenLine } from 'lucide-react';
import { SAMPLE_OUTPUTS } from '@/lib/marketing/sampleOutputs';
import ScrollReveal from '@/components/marketing/ScrollReveal';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import {
  marketingAccentSpan,
  marketingEyebrow,
  marketingFocusRing,
  marketingGlassCard,
  marketingLandingSection,
  marketingPageContainerMedium,
  marketingSectionHeader,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

function pickSampleForTopic(topic: string) {
  const lower = topic.toLowerCase();
  if (lower.includes('linkedin') || lower.includes('social')) {
    return SAMPLE_OUTPUTS.find(s => s.id === 'linkedin-post') ?? SAMPLE_OUTPUTS[0];
  }
  if (lower.includes('quora') || lower.includes('answer')) {
    return SAMPLE_OUTPUTS.find(s => s.id === 'quora-answer') ?? SAMPLE_OUTPUTS[0];
  }
  if (lower.includes('medium') || lower.includes('essay')) {
    return SAMPLE_OUTPUTS.find(s => s.id === 'medium-article') ?? SAMPLE_OUTPUTS[0];
  }
  if (lower.includes('newsletter') || lower.includes('substack') || lower.includes('email')) {
    return SAMPLE_OUTPUTS.find(s => s.id === 'substack-newsletter') ?? SAMPLE_OUTPUTS[0];
  }
  return SAMPLE_OUTPUTS[0];
}

export default function TryTopicWidget() {
  const [topic, setTopic] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [sampleLabel, setSampleLabel] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;
    const sample = pickSampleForTopic(trimmed);
    const excerpt = sample.body.split('\n\n').slice(0, 2).join('\n\n');
    setSampleLabel(sample.platform);
    setPreview(
      `**Preview — ${trimmed}** (${sample.platform} format)\n\n(Sample excerpt only — sign up for full drafts with keyword discovery and SEO scoring.)\n\n${excerpt}`
    );
  };

  return (
    <section className={marketingLandingSection} aria-labelledby="try-topic-heading">
      <div className={marketingPageContainerMedium}>
        <ScrollReveal className={marketingSectionHeader}>
          <span className={marketingEyebrow}>Try it live</span>
          <h2 id="try-topic-heading" className={marketingSectionTitle}>
            Preview a topic —{' '}
            <span className={marketingAccentSpan}>no signup</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            See a sample excerpt in the right platform format. Full drafts with keywords and
            analysis are free after you create an account.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <div className={cn(marketingGlassCard, 'p-6 md:p-8')}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="try-topic-input" className="sr-only">
                Topic
              </label>
              <input
                id="try-topic-input"
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. B2B SaaS onboarding emails"
                className={cn(
                  'h-12 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400',
                  marketingFocusRing
                )}
              />
              <MarketingPrimaryButton
                type="submit"
                size="md"
                className="!h-12 !w-auto sm:min-w-[140px]"
                fullWidth={false}
              >
                <PenLine className="h-4 w-4" aria-hidden />
                Preview
              </MarketingPrimaryButton>
            </form>

            {preview && (
              <div className="mt-5 rounded-xl border border-dashed border-teal-200 bg-teal-50/50 p-5 text-sm leading-relaxed text-slate-700">
                {sampleLabel ? (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
                    Showing {sampleLabel} sample format
                  </p>
                ) : null}
                {preview.split('\n\n').map((block, i) => (
                  <p
                    key={i}
                    className={
                      block.startsWith('**')
                        ? 'font-semibold text-slate-900'
                        : 'mt-2'
                    }
                  >
                    {block.replace(/\*\*/g, '')}
                  </p>
                ))}
                <Link
                  href="/auth/signup"
                  className="mt-4 inline-block text-sm font-semibold text-teal-700 underline-offset-2 hover:underline"
                >
                  Draft the full piece — free
                </Link>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
