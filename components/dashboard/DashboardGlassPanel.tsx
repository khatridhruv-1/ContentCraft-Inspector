'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  dashboardGlassPanel,
  dashboardPanelBody,
  dashboardPanelBodyCompact,
  dashboardPanelHeader,
  dashboardPanelHeaderCompact,
} from '@/components/dashboard/dashboardLayout';

type DashboardGlassPanelProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  compact?: boolean;
};

export default function DashboardGlassPanel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  compact = false,
}: DashboardGlassPanelProps) {
  return (
    <div className={cn(dashboardGlassPanel, className)}>
      <div className={compact ? dashboardPanelHeaderCompact : dashboardPanelHeader}>
        <div className="min-w-0">
          <h2
            className={cn(
              'font-semibold tracking-tight text-slate-900',
              compact ? 'text-sm' : 'text-lg md:text-xl'
            )}
          >
            {title}
          </h2>
          {!compact && description ? (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      <div className={cn(compact ? dashboardPanelBodyCompact : dashboardPanelBody, bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
