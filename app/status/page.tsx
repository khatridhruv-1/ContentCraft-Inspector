import type { Metadata } from 'next';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import MarketingSubpageHeader from '@/components/marketing/MarketingSubpageHeader';
import {
  MARKETING_PAGE_GRADIENT,
  marketingAccentSpan,
  marketingGlassCard,
  marketingPageClass,
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

type ServiceStatus = 'operational' | 'degraded' | 'down';

const SERVICES = [
  { id: 'website', name: 'Website & marketing pages' },
  { id: 'auth', name: 'Authentication' },
  { id: 'api', name: 'AI generation API' },
  { id: 'newsletter', name: 'Newsletter delivery' },
  { id: 'mcp', name: 'MCP / integrations' },
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

function statusForService(id: string, health: HealthResponse | null): ServiceStatus {
  if (!health) return 'degraded';
  if (id === 'auth') return health.ok ? 'operational' : 'down';
  return health.ok ? 'operational' : 'degraded';
}

const STATUS_STYLES: Record<ServiceStatus, string> = {
  operational: 'bg-emerald-100 text-emerald-800',
  degraded: 'bg-amber-100 text-amber-800',
  down: 'bg-red-100 text-red-800',
};

export default async function StatusPage() {
  const health = await fetchAuthHealth();
  const allOperational = SERVICES.every(s => statusForService(s.id, health) === 'operational');
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

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className={marketingSectionTitle}>
          System <span className={marketingAccentSpan}>status</span>
        </h1>
        <p
          className={cn(
            'mt-3 font-semibold',
            allOperational ? 'text-emerald-700' : 'text-amber-700'
          )}
        >
          {allOperational ? 'All systems operational' : 'Some systems need attention'}
        </p>
        <p className="mt-1 text-sm text-slate-500">Last checked: {checkedAt}</p>
        {health?.hint ? (
          <p className="mt-2 text-xs text-slate-500">{health.hint}</p>
        ) : null}

        <ul className="mt-8 space-y-3">
          {SERVICES.map(s => {
            const status = statusForService(s.id, health);
            return (
              <li
                key={s.id}
                className={cn(marketingGlassCard, 'flex items-center justify-between px-4 py-3')}
              >
                <span className="text-sm font-medium text-slate-800">{s.name}</span>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                    STATUS_STYLES[status]
                  )}
                >
                  {status}
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
