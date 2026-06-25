'use client';

import { CONTENT_PLATFORM_OPTIONS } from '@/types/contentPlatform';
import type { ContentPlatformId } from '@/types/contentPlatform';
import { studioChip, studioChipActive } from '@/lib/dashboard/studioTheme';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface StudioPlatformPickerProps {
  platform: ContentPlatformId;
  disabled?: boolean;
  compact?: boolean;
  onPlatformChange: (platform: ContentPlatformId) => void;
}

export default function StudioPlatformPicker({
  platform,
  disabled = false,
  compact = false,
  onPlatformChange,
}: StudioPlatformPickerProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', compact ? 'gap-1' : 'gap-2')}>
      <p
        className={cn(
          'font-medium text-slate-600',
          compact ? 'text-[11px] uppercase tracking-wide' : 'text-xs'
        )}
      >
        Platform
        {!compact ? (
          <span className="font-normal text-slate-400"> · 3–4 min read</span>
        ) : null}
      </p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Content platform">
        {CONTENT_PLATFORM_OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onPlatformChange(option.id)}
            className={cn(
              studioChip,
              platform === option.id && studioChipActive,
              marketingFocusRing,
              compact && 'px-2.5 py-1 text-[11px]'
            )}
            aria-pressed={platform === option.id}
          >
            {compact ? option.shortLabel : option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
