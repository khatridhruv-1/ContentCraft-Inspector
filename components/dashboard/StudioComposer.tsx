'use client';

import { useRef, useState } from 'react';
import { ChevronDown, Sparkles, Wand2 } from 'lucide-react';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { STUDIO_FORMATS, STUDIO_TONES } from '@/lib/dashboard/studioOptions';
import {
  studioChip,
  studioChipActive,
  studioComposer,
  studioField,
  studioFormatChip,
  studioInputRow,
  studioSectionLabel,
} from '@/lib/dashboard/studioTheme';
import { marketingFieldShell, marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

type StudioComposerProps = {
  brief: string;
  tone: string;
  keywords: string;
  loading: boolean;
  errorMessage?: string | null;
  variant?: 'hero' | 'docked';
  onBriefChange: (value: string) => void;
  onToneChange: (tone: string) => void;
  onKeywordsChange: (keywords: string) => void;
  onGenerate: () => void;
};

export default function StudioComposer({
  brief,
  tone,
  keywords,
  loading,
  errorMessage,
  variant = 'hero',
  onBriefChange,
  onToneChange,
  onKeywordsChange,
  onGenerate,
}: StudioComposerProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isHero = variant === 'hero';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      if (brief.trim() && !loading) onGenerate();
    }
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, isHero ? 160 : 120)}px`;
  };

  return (
    <div
      className={cn(
        studioComposer,
        'w-full',
        isHero ? 'max-w-2xl p-6 shadow-lg md:p-8' : 'max-w-xl p-4 shadow-md md:p-5'
      )}
    >
      {isHero ? (
        <div className="mb-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <Wand2 className="h-6 w-6" aria-hidden />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900">What are we creating?</h3>
          <p className="mt-1 text-sm text-slate-500">
            Describe your topic, audience, and angle — then generate a draft.
          </p>
        </div>
      ) : (
        <div className="mb-3 flex items-center gap-2">
          <Wand2 className="h-4 w-4 shrink-0 text-violet-600" aria-hidden />
          <p className="text-sm font-semibold text-slate-900">Refine &amp; regenerate</p>
        </div>
      )}

      <div className="space-y-3">
        <div className={cn(marketingFieldShell, 'items-start gap-2 px-3 py-3')}>
          <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden />
          <textarea
            ref={textareaRef}
            id="studio-brief"
            value={brief}
            onChange={e => onBriefChange(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            rows={isHero ? 4 : 2}
            placeholder="Topic, audience, angle, and key points…"
            disabled={loading}
            aria-label="Your brief"
            className={cn(
              studioField,
              isHero ? 'min-h-[108px] max-h-[160px]' : 'min-h-[72px] max-h-[120px]'
            )}
          />
        </div>

        {!optionsOpen && !isHero ? (
          <div className="flex flex-wrap gap-1.5">
            {STUDIO_TONES.slice(0, 4).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => onToneChange(tone === t ? '' : t)}
                className={cn(studioChip, tone === t && studioChipActive, marketingFocusRing)}
              >
                {t}
              </button>
            ))}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOptionsOpen(open => !open)}
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700',
            marketingFocusRing,
            'rounded-md px-1'
          )}
          aria-expanded={optionsOpen}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Tone &amp; options
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform', optionsOpen && 'rotate-180')}
            aria-hidden
          />
        </button>

        {optionsOpen ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <div>
              <p className={studioSectionLabel}>Tone</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {STUDIO_TONES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onToneChange(tone === t ? '' : t)}
                    className={cn(studioChip, tone === t && studioChipActive, marketingFocusRing)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className={studioSectionLabel}>Format</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {STUDIO_FORMATS.map(f => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => onBriefChange(brief.trim() ? brief : f.prompt)}
                    className={cn(studioFormatChip, marketingFocusRing)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="studio-composer-keywords" className={studioSectionLabel}>
                SEO keywords
              </label>
              <input
                id="studio-composer-keywords"
                type="text"
                value={keywords}
                onChange={e => onKeywordsChange(e.target.value)}
                placeholder="Auto-discovered when empty"
                className={cn(studioInputRow, 'mt-1.5 text-xs')}
              />
            </div>
          </div>
        ) : null}

        {errorMessage ? (
          <p
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {isHero ? (
            <p className="text-xs text-slate-400">
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px]">
                ⌘
              </kbd>
              {' + '}
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              {' '}to generate
            </p>
          ) : (
            <span className="hidden sm:block" />
          )}
          <MarketingPrimaryButton
            type="button"
            size={isHero ? 'md' : 'sm'}
            fullWidth={false}
            disabled={!brief.trim()}
            loading={loading}
            loadingText={keywords.trim() ? 'Generating…' : 'Finding keywords…'}
            onClick={onGenerate}
            className={cn('shrink-0 sm:ml-auto', isHero ? 'min-w-[168px] !w-auto' : '!w-auto')}
          >
            <Wand2 className="h-4 w-4" aria-hidden />
            Generate
          </MarketingPrimaryButton>
        </div>
      </div>
    </div>
  );
}
