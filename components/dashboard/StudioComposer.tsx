'use client';

import { useEffect, useRef } from 'react';
import { AlertCircle, Wand2 } from 'lucide-react';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import { STUDIO_FORMATS, STUDIO_TONES } from '@/lib/dashboard/studioOptions';
import {
  studioChip,
  studioChipActive,
  studioComposer,
  studioField,
  studioFormatChip,
} from '@/lib/dashboard/studioTheme';
import { marketingFieldShell, marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

type StudioComposerProps = {
  brief: string;
  tone: string;
  loading: boolean;
  errorMessage?: string | null;
  variant?: 'hero' | 'docked';
  autoFocus?: boolean;
  onBriefChange: (value: string) => void;
  onToneChange: (tone: string) => void;
  onGenerate: () => void;
};

export default function StudioComposer({
  brief,
  tone,
  loading,
  errorMessage,
  variant = 'hero',
  autoFocus = false,
  onBriefChange,
  onToneChange,
  onGenerate,
}: StudioComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isHero = variant === 'hero';
  const briefTrimmed = brief.trim();
  const canGenerate = briefTrimmed.length > 0;
  const generateDisabled = !canGenerate || loading;

  useEffect(() => {
    if (!autoFocus || !textareaRef.current) return;
    const timer = window.setTimeout(() => textareaRef.current?.focus(), isHero ? 120 : 80);
    return () => window.clearTimeout(timer);
  }, [autoFocus, isHero]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      if (canGenerate && !loading) onGenerate();
    }
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, isHero ? 140 : 120)}px`;
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        isHero ? cn(studioComposer, 'max-w-2xl p-5 shadow-lg md:p-6') : 'gap-4'
      )}
    >
      {isHero && !briefTrimmed ? (
        <div className="mb-4 text-center">
          <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <Wand2 className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="text-base font-semibold text-slate-900">What are we creating?</h3>
          <p className="mt-1 text-sm text-slate-500">
            Describe your topic — we&apos;ll find keywords, then draft SEO-ready content.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {STUDIO_FORMATS.map(format => (
              <button
                key={format.label}
                type="button"
                onClick={() => onBriefChange(format.prompt)}
                className={cn(studioFormatChip, marketingFocusRing)}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div>
          <label htmlFor="studio-brief" className="sr-only">
            Content brief
          </label>
          <div className={cn(marketingFieldShell, 'items-start gap-2 px-3 py-2.5')}>
            <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" aria-hidden />
            <textarea
              ref={textareaRef}
              id="studio-brief"
              value={brief}
              onChange={e => onBriefChange(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              rows={isHero ? 3 : 4}
              placeholder="Topic, audience, and angle…"
              disabled={loading}
              className={cn(
                studioField,
                isHero ? 'min-h-[88px] max-h-[140px]' : 'min-h-[96px] max-h-[160px]'
              )}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(isHero ? STUDIO_TONES.slice(0, 4) : STUDIO_TONES).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => onToneChange(tone === t ? '' : t)}
              disabled={loading}
              className={cn(studioChip, tone === t && studioChipActive, marketingFocusRing)}
            >
              {t}
            </button>
          ))}
        </div>

        {errorMessage ? (
          <div
            className="flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>{errorMessage}</p>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-end gap-3 border-t border-slate-200/80 pt-4">
          <MarketingPrimaryButton
            type="button"
            size="sm"
            fullWidth={false}
            disabled={generateDisabled}
            loading={loading}
            loadingText="Generating…"
            onClick={onGenerate}
            className="!h-10 min-w-[140px] !w-auto shrink-0"
          >
            <Wand2 className="h-4 w-4" aria-hidden />
            Generate
          </MarketingPrimaryButton>
        </div>

        {canGenerate && !loading ? (
          <p className="text-center text-[11px] text-slate-400">⌘↵ to generate</p>
        ) : null}
      </div>
    </div>
  );
}
