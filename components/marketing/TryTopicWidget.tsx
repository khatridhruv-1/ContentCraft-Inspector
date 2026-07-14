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

export default function TryTopicWidget() {
  const [topic, setTopic] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = topic.trim();
    if (!trimmed) return;
    const sample = SAMPLE_OUTPUTS[0];
    const excerpt = sample.body.split('\n\n').slice(0, 2).join('\n\n');
    setPreview(
      `**Preview — ${trimmed}**\n\n(Watermarked demo — sign up for full drafts with keyword discovery and SEO scoring.)\n\n${excerpt}`
    );
  };

  return (
    <section className={cn(marketingLandingSection, 'pt-0')} aria-labelledby="try-topic-heading">
      <div className="mx-auto max-w-2xl px-6">
        <div className={cn(marketingGlassCard, 'p-5 md:p-6')}>
          <h2 id="try-topic-heading" className="text-xl font-bold text-slate-900">
            Try a topic — no signup required
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            See a watermarked sample excerpt. Full generation with keywords and analysis is free
            after signup.
          </p>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. B2B SaaS onboarding emails"
              className={cn(
                'flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm',
                marketingFocusRing
              )}
            />
            <MarketingPrimaryButton type="submit" size="sm" className="!w-auto sm:min-w-[140px]" fullWidth={false}>
              <Sparkles className="mr-1.5 h-4 w-4" aria-hidden />
              Preview
            </MarketingPrimaryButton>
          </form>
          {preview && (
            <div className="mt-4 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-4 text-sm leading-relaxed text-slate-700">
              {preview.split('\n\n').map((block, i) => (
                <p key={i} className={block.startsWith('**') ? 'font-semibold text-slate-900' : 'mt-2'}>
                  {block.replace(/\*\*/g, '')}
                </p>
              ))}
              <Link
                href="/auth/signup"
                className="mt-3 inline-block text-sm font-semibold text-violet-700 underline-offset-2 hover:underline"
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
