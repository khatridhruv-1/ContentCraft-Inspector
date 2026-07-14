export type DashboardMode = 'ai-generate' | 'analyze';

export type DashboardStatePayload = {
  id: string;
  mode: DashboardMode;
  content: string;
  documentId: string;
  fromHistory?: boolean;
  analysis?: string;
};

export function persistDashboardState(payload: DashboardStatePayload) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dashboardState', JSON.stringify(payload));
  localStorage.setItem('documentId', payload.documentId);
}

export function buildDashboardUrl(mode: DashboardMode, documentId?: string) {
  const params = new URLSearchParams({ mode });
  if (documentId) params.set('documentId', documentId);
  return `/dashboard?${params.toString()}`;
}
