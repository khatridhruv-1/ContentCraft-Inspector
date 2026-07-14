'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { SAMPLE_OUTPUTS } from '@/lib/marketing/sampleOutputs';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import {
  marketingFocusRing,
  marketingGlassCard,
  marketingLandingSection,
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
    <section className={cn(marketingLandingSection, 'pt-0')} aria-labelledby="try-topic-heading">
      <div className="mx-auto max-w-2xl px-6">
        <div className={cn(marketingGlassCard, 'p-5 md:p-6')}>
          <h2 id="try-topic-heading" className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Try a topic — no signup required
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            See a watermarked sample excerpt matched to your topic type. Full generation with keywords
            and analysis is free after signup.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. B2B SaaS onboarding emails"
              className={cn(
                'flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100',
                marketingFocusRing
              )}
            />
            <MarketingPrimaryButton type="submit" size="sm" className="!w-auto sm:min-w-[140px]" fullWidth={false}>
              <Sparkles className="mr-1.5 h-4 w-4" aria-hidden />
              Preview
            </MarketingPrimaryButton>
          </form>
          {preview && (
            <div className="mt-4 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-4 text-sm leading-relaxed text-slate-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-slate-300">
              {sampleLabel ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-400">
                  Showing {sampleLabel} sample format
                </p>
              ) : null}
              {preview.split('\n\n').map((block, i) => (
                <p key={i} className={block.startsWith('**') ? 'font-semibold text-slate-900 dark:text-slate-100' : 'mt-2'}>
                  {block.replace(/\*\*/g, '')}
                </p>
              ))}
              <Link
                href="/auth/signup"
                className="mt-3 inline-block text-sm font-semibold text-violet-700 underline-offset-2 hover:underline dark:text-violet-400"
              >
                Generate the full draft — free
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
