'use client';

import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Pencil, X } from 'lucide-react';
import MarketingPrimaryButton from '@/components/marketing/MarketingPrimaryButton';
import {
  marketingAuthInput,
  marketingFieldShell,
  marketingFocusRing,
  marketingGhostButton,
} from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

const profileSubtleFocus =
  'focus:outline-none focus-visible:ring-1 focus-visible:ring-white/25 focus-visible:ring-offset-1 focus-visible:ring-offset-[#09090b]';

interface ProfileDisplayNameRowProps {
  name: string;
  newName: string;
  editing: boolean;
  updating: boolean;
  error: string | null;
  saved: boolean;
  onNewNameChange: (value: string) => void;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ProfileDisplayNameRow({
  name,
  newName,
  editing,
  updating,
  error,
  saved,
  onNewNameChange,
  onStartEdit,
  onCancel,
  onSave,
}: ProfileDisplayNameRowProps) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const canSave = newName.trim() !== name.trim() && newName.trim().length >= 2;

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  return (
    <section aria-labelledby="profile-display-name-heading">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id="profile-display-name-heading"
            className="text-xs font-semibold uppercase tracking-widest text-white/45"
          >
            Display name
          </h2>
          <p className="mt-1 text-xs text-white/45">Shown in workspace greetings and saved drafts.</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={onStartEdit}
            className={cn(marketingGhostButton, profileSubtleFocus, 'shrink-0 px-3 py-1.5 text-xs')}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 max-w-md space-y-3"
            aria-busy={updating}
          >
            <div className={cn(marketingFieldShell, 'h-11 px-3')}>
              <input
                ref={inputRef}
                id={fieldId}
                type="text"
                value={newName}
                onChange={e => onNewNameChange(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') onCancel();
                  if (e.key === 'Enter' && canSave) onSave();
                }}
                disabled={updating}
                maxLength={64}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : undefined}
                className={marketingAuthInput}
                placeholder="Enter your display name"
                autoComplete="name"
              />
            </div>
            {error && (
              <p id={errorId} role="alert" className="flex items-center gap-1.5 text-sm text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <MarketingPrimaryButton
                type="button"
                size="sm"
                onClick={onSave}
                disabled={updating || !canSave}
                loading={updating}
                loadingText="Saving..."
                className="!w-auto min-w-[120px]"
                fullWidth={false}
              >
                Save changes
              </MarketingPrimaryButton>
              <button
                type="button"
                onClick={onCancel}
                disabled={updating}
                className={cn(marketingGhostButton, profileSubtleFocus, 'px-3 py-1.5 text-xs')}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="read"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2.5 flex items-center gap-3"
          >
            <p className="text-base font-medium text-white/90">{name}</p>
            {saved && (
              <span
                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
                role="status"
                aria-live="polite"
              >
                <Check className="h-3 w-3" aria-hidden />
                Saved
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
