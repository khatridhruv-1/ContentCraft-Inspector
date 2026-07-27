import { CheckCircle2, FileSearch, PenLine } from 'lucide-react';
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
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm',
        className
      )}
      role="img"
      aria-label="Preview of the BlogCreator workspace with a humanized draft and SEO analysis"
    >
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" aria-hidden />
        <span className="ml-2 text-xs font-medium text-slate-500">
          BlogCreator · LinkedIn draft
        </span>
        <span className="ml-auto hidden rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800 sm:inline">
          Humanized
        </span>
      </div>

      <div
        className={cn(
          'grid gap-0',
          compact ? 'grid-cols-1' : 'md:grid-cols-[1.2fr_0.8fr]'
        )}
      >
        <div className="space-y-4 border-b border-slate-100 p-5 md:border-b-0 md:border-r md:p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <PenLine className="h-3.5 w-3.5 text-teal-600" aria-hidden />
            Draft
          </div>
          <p className="text-left text-base font-semibold leading-snug text-slate-900 md:text-lg">
            Platform-specific drafts beat generic chat dumps every time.
          </p>
          <div className="space-y-2.5 text-left text-sm leading-relaxed text-slate-600">
            <p>
              Most teams paste the same paragraph into LinkedIn and call it a day. Structure
              matters — short hooks, one idea per block, a line only you could write.
            </p>
            <p className="text-slate-500">
              BlogCreator starts with where you publish, then weaves live keywords into a draft
              that still reads like a person.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {['LinkedIn writing', 'B2B content', 'humanized voice'].map(tag => (
              <span
                key={tag}
                className="rounded-md border border-teal-100 bg-teal-50/80 px-2 py-0.5 text-[11px] font-medium text-teal-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 bg-slate-50/60 p-5 md:p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <FileSearch className="h-3.5 w-3.5 text-sky-600" aria-hidden />
            Deep analysis
          </div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-3xl font-black tabular-nums text-emerald-600">84</p>
              <p className="text-[11px] text-slate-500">Readability</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold tabular-nums text-teal-800">92</p>
              <p className="text-[11px] text-slate-500">SEO fit</p>
            </div>
          </div>
          <ul className="space-y-2.5 text-left text-xs text-slate-600">
            {[
              'Hook lands in the first two lines',
              'Keywords woven — not stuffed',
              'Platform length on target',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
