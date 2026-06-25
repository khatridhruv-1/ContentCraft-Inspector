'use client';

import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marketingFocusRing } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface CliCommandBlockProps {
  command: string;
  label?: string;
  className?: string;
}

export default function CliCommandBlock({ command, label, className }: CliCommandBlockProps) {
  const [copied, setCopied] = useState(false);

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
    <div className={cn('group relative', className)}>
      {label ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      ) : null}
      <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-inner">
        <pre className="overflow-x-auto p-4 pr-14 text-sm leading-relaxed text-slate-100">
          <code>{command}</code>
        </pre>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => void handleCopy()}
          className={cn(
            'absolute right-2 top-2 h-8 w-8 text-slate-400 hover:bg-slate-800 hover:text-white',
            marketingFocusRing
          )}
          aria-label={copied ? 'Copied' : 'Copy command'}
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
