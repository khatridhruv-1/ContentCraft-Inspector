'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { CONTENT_PLATFORM_OPTIONS, type ContentPlatformId } from '@/types/contentPlatform';
import { marketingFocusRing, marketingGlassCard } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const ONBOARDING_KEY = 'blogcreator_onboarding_complete';

const STEPS = [
  { id: 1, title: 'Pick your platform', description: 'Where will this content live?' },
  { id: 2, title: 'Describe your topic', description: 'One sentence is enough to start.' },
  { id: 3, title: 'Generate your draft', description: 'Keywords and structure included.' },
] as const;

interface HomeOnboardingProps {
  recentCount: number;
}

export function isOnboardingComplete(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(ONBOARDING_KEY) === '1';
}

export function markOnboardingComplete() {
  localStorage.setItem(ONBOARDING_KEY, '1');
}

export default function HomeOnboarding({ recentCount }: HomeOnboardingProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<ContentPlatformId>('website');
  const [brief, setBrief] = useState('');
  const [dismissed, setDismissed] = useState(() => isOnboardingComplete() || recentCount > 0);

  if (dismissed) return null;

  const finish = () => {
    markOnboardingComplete();
    const params = new URLSearchParams({ mode: 'ai-generate' });
    if (brief.trim()) params.set('brief', brief.trim());
    params.set('platform', platform);
    router.push(`/dashboard?${params.toString()}`);
  };

  const skip = () => {
    markOnboardingComplete();
    setDismissed(true);
  };

  return (
    <section
      aria-labelledby="onboarding-heading"
      className={cn(marketingGlassCard, 'mb-8 p-5 md:p-6')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
            Quick start
          </p>
          <h2 id="onboarding-heading" className="mt-1 text-lg font-bold text-slate-900">
            Create your first draft in 3 steps
          </h2>
        </div>
        <button
          type="button"
          onClick={skip}
          className={cn('text-sm text-slate-500 hover:text-slate-700', marketingFocusRing)}
        >
          Skip for now
        </button>
      </div>

      <ol className="mt-4 flex flex-wrap gap-2">
        {STEPS.map(s => (
          <li
            key={s.id}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              step === s.id ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
            )}
          >
            {s.id}. {s.title}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <div className="mt-4">
          <p className="mb-3 text-sm text-slate-600">{STEPS[0].description}</p>
          <div className="flex flex-wrap gap-2">
            {CONTENT_PLATFORM_OPTIONS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                  platform === p.id
                    ? 'border-teal-300 bg-teal-50 text-teal-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                  marketingFocusRing
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={cn(
              'mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700',
              marketingFocusRing
            )}
          >
            Next
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4">
          <p className="mb-3 text-sm text-slate-600">{STEPS[1].description}</p>
          <textarea
            value={brief}
            onChange={e => setBrief(e.target.value)}
            rows={3}
            placeholder="e.g. How to improve B2B SaaS onboarding emails in 2026"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={cn('text-sm text-slate-600', marketingFocusRing)}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!brief.trim()}
              className={cn(
                'inline-flex items-center gap-2 text-sm font-semibold text-teal-700 disabled:opacity-40',
                marketingFocusRing
              )}
            >
              Next
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-4">
          <p className="text-sm text-slate-600">{STEPS[2].description}</p>
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" aria-hidden />
              Platform: {CONTENT_PLATFORM_OPTIONS.find(p => p.id === platform)?.label}
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" aria-hidden />
              Topic: {brief.trim()}
            </li>
          </ul>
          <button
            type="button"
            onClick={finish}
            className={cn(
              'mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700',
              marketingFocusRing
            )}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Open dashboard & generate
          </button>
        </div>
      )}
    </section>
  );
}
