'use client';

import { cn } from '@/lib/utils';

export function StudioChatListSkeleton() {
  return (
    <ul className="animate-pulse" aria-hidden>
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index} className="flex items-center gap-3 border-b border-slate-200/60 px-3 py-3">
          <div className="h-11 w-11 shrink-0 rounded-full bg-slate-200" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 rounded bg-slate-200" style={{ width: `${68 - index * 4}%` }} />
            <div className="h-3 rounded bg-slate-100" style={{ width: `${88 - index * 3}%` }} />
          </div>
          <div className="h-3 w-8 shrink-0 rounded bg-slate-100" />
        </li>
      ))}
    </ul>
  );
}

export function StudioWorkspaceSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white" aria-busy aria-label="Loading workspace">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-3 sm:px-5">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-16 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-slate-50/40 p-6 md:p-10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.05)_0%,_transparent_70%)]"
          aria-hidden
        />
        <div
          className={cn(
            'w-full max-w-2xl animate-pulse rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'
          )}
        >
          <div className="mx-auto mb-5 flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-200" />
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="h-3 w-64 rounded bg-slate-100" />
          </div>
          <div className="h-28 rounded-xl bg-slate-100" />
          <div className="mt-4 h-9 w-28 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
