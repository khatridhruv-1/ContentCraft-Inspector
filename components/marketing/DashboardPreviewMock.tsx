import { Wand2, FileSearch } from 'lucide-react';
import { marketingGlassCard } from '@/lib/marketing/marketingTheme';
import { cn } from '@/lib/utils';

interface DashboardPreviewMockProps {
  className?: string;
  compact?: boolean;
}

export default function DashboardPreviewMock({
  className,
  compact = false,
}: DashboardPreviewMockProps) {
  return (
    <div
      className={cn(marketingGlassCard, 'overflow-hidden p-2 md:p-3', className)}
      role="img"
      aria-label="Preview of the BlogCreator dashboard showing AI generation and deep SEO analysis panels"
    >
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" aria-hidden />
        <span className="ml-2 text-xs text-slate-400">BlogCreator — Dashboard</span>
      </div>

      <div
        className={cn(
          'grid gap-2 p-2 md:gap-3 md:p-3',
          compact ? 'grid-cols-1' : 'md:grid-cols-2'
        )}
      >
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Wand2 className="h-3.5 w-3.5 text-violet-500" aria-hidden />
            AI Generation
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-slate-200" />
            <div className="h-2 w-[92%] rounded bg-slate-200" />
            <div className="h-2 w-[78%] rounded bg-slate-200/80" />
            <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-3 text-[11px] text-violet-800">
              SEO draft with auto-discovered keywords woven naturally into the prose.
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
            <FileSearch className="h-3.5 w-3.5 text-sky-500" aria-hidden />
            Deep Analysis
          </div>
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-emerald-600">82</span>
              <span className="text-[10px] text-slate-400">Readability score</span>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 text-[11px] text-sky-800">
              Outline, info gain, and SEO insights in one pass.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
