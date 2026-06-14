'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  dashboardResultCard,
  dashboardResultCardBody,
  dashboardResultCardHeader,
  dashboardResultCardTitle,
} from '@/components/dashboard/dashboardLayout';

type DashboardResultCardProps = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function DashboardResultCard({
  title,
  icon,
  children,
  className,
}: DashboardResultCardProps) {
  return (
    <div className={cn(dashboardResultCard, className)}>
      <div className={dashboardResultCardHeader}>
        <h3 className={dashboardResultCardTitle}>
          {icon}
          {title}
        </h3>
      </div>
      <div className={dashboardResultCardBody}>{children}</div>
    </div>
  );
}
