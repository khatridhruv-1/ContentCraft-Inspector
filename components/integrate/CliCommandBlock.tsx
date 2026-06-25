'use client';

import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface CliCommandBlockProps {
  /** Value copied to clipboard (single line). */
  command: string;
  /** Optional multiline display; defaults to `command`. */
  displayCommand?: string;
  label?: string;
  className?: string;
}

export default function CliCommandBlock({
  command,
  displayCommand,
  label,
  className,
}: CliCommandBlockProps) {
  const [copied, setCopied] = useState(false);
  const shown = displayCommand ?? command;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [command]);

  return (
    <div className={cn('relative', className)}>
      {label ? (
        <p className="mb-2 text-sm font-bold text-slate-900">{label}</p>
      ) : null}
      <div className="overflow-hidden rounded-xl border-2 border-slate-300 bg-white shadow-md">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-100 px-4 py-2.5">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-700">bash</span>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-bold text-slate-900 shadow-sm hover:bg-slate-50',
              marketingFocusRing
            )}
            aria-label={copied ? 'Copied' : 'Copy command'}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden />
                Copy
              </>
            )}
          </button>
        </div>
        <div
          className="overflow-x-auto whitespace-pre p-4 font-mono text-[13px] font-medium leading-7 text-slate-900 sm:text-sm"
          style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
          role="textbox"
          aria-readonly
          tabIndex={0}
        >
          {shown}
        </div>
      </div>
    </div>
  );
}
