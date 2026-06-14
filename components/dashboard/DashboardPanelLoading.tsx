'use client';

import { AppLoader } from '@/components/loading/AppLoader';

type DashboardPanelLoadingProps = {
  label: string;
};

export default function DashboardPanelLoading({ label }: DashboardPanelLoadingProps) {
  return (
    <div
      className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-12"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <AppLoader decorative />
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}
