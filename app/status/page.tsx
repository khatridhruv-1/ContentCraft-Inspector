import type { Metadata } from 'next';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import {
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingGlassCard,
  marketingPageClass,
  marketingSubpageMain,
  marketingSectionTitle,
} from '@/lib/marketing/marketingTheme';
import { absoluteUrl } from '@/lib/marketing/siteUrl';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Status — BlogCreator',
  description: 'BlogCreator service status and uptime.',
  alternates: { canonical: absoluteUrl('/status') },
};

type HealthResponse = {
  ok: boolean;
  configured?: string[];
  missing?: string[];
  hint?: string;
};

type ServiceStatus = 'operational' | 'degraded' | 'down' | 'not_monitored';

const SERVICES = [
  { id: 'website', name: 'Website & marketing pages', monitored: true },
  { id: 'auth', name: 'Authentication', monitored: true },
  { id: 'api', name: 'Content drafting API', monitored: false },
  { id: 'newsletter', name: 'Newsletter delivery', monitored: false },
  { id: 'mcp', name: 'MCP / integrations', monitored: false },
] as const;

async function fetchAuthHealth(): Promise<HealthResponse | null> {
  try {
    const res = await fetch(absoluteUrl('/api/health/auth'), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as HealthResponse;
  } catch {
    return null;
  }
}

function statusForService(
  id: string,
  monitored: boolean,
  health: HealthResponse | null
): ServiceStatus {
  if (!monitored) return 'not_monitored';
  if (id === 'website') return 'operational';
  if (id === 'auth') {
    if (!health) return 'degraded';
    return health.ok ? 'operational' : 'down';
  }
  return 'not_monitored';
}

const STATUS_STYLES: Record<ServiceStatus, string> = {
  operational: 'bg-emerald-100 text-emerald-800',
  degraded: 'bg-amber-100 text-amber-800',
  down: 'bg-red-100 text-red-800',
  not_monitored: 'bg-slate-100 text-slate-600',
};

const STATUS_LABELS: Record<ServiceStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
  not_monitored: 'Not monitored',
};

export default async function StatusPage() {
  const health = await fetchAuthHealth();
  const monitoredServices = SERVICES.filter(s => s.monitored);
  const allMonitoredOperational = monitoredServices.every(
    s => statusForService(s.id, s.monitored, health) === 'operational'
  );
  const checkedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div
      className={cn('marketing-page min-h-screen', marketingPageClass)}
      style={{ background: MARKETING_PAGE_GRADIENT }}
    >
      <MarketingSubpageHeader maxWidth="6xl" />

      <main className={marketingSubpageMain}>
        <h1 className={marketingSectionTitle}>
          System <span className={marketingAccentSpan}>status</span>
        </h1>
        <p
          className={cn(
            'mt-3 font-semibold',
            allMonitoredOperational ? 'text-emerald-700' : 'text-amber-700'
          )}
        >
          {allMonitoredOperational
            ? 'Monitored systems operational'
            : 'Some monitored systems need attention'}
        </p>
        <p className="mt-1 text-sm text-slate-500">Last checked: {checkedAt}</p>
        {health?.hint ? (
          <p className="mt-2 text-xs text-slate-500">{health.hint}</p>
        ) : null}
        <p className="mt-2 text-xs text-slate-500">
          Only website and authentication are actively monitored. Other services are listed for
          reference.
        </p>

        <ul className="mt-8 space-y-3">
          {SERVICES.map(s => {
            const status = statusForService(s.id, s.monitored, health);
            return (
              <li
                key={s.id}
                className={cn(marketingGlassCard, 'flex items-center justify-between px-4 py-3')}
              >
                <span className="text-sm font-medium text-slate-800">{s.name}</span>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                    STATUS_STYLES[status]
                  )}
                >
                  {STATUS_LABELS[status]}
                </span>
              </li>
            );
          })}
        </ul>
      </main>

      <MarketingFooter />
    </div>
  );
}
