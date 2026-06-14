'use client';

import type { LucideIcon } from 'lucide-react';

type DashboardEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function DashboardEmptyState({
  icon: Icon,
  title,
  description,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex h-full min-h-[160px] flex-col items-center justify-center px-4 py-8 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-5 w-5 text-slate-400" aria-hidden />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-xs text-xs text-slate-500">{description}</p>
    </div>
  );
}
